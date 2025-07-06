const fs = require("fs");
const path = require("path");

// 🇯🇵 JSTで「今日」の00:00を生成（補正なしでOK）
const getTodayJST = () => {
  const now = new Date(); // OSローカル（JST）前提
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const today = getTodayJST();

// 📅 今週の月曜〜日曜（JST基準）
const dow = today.getDay(); // 0:日〜6:土
const monday = new Date(today);
monday.setDate(today.getDate() - ((dow + 6) % 7));
const sunday = new Date(monday);
sunday.setDate(monday.getDate() + 6);

// 📂 入出力パス
const templatePath = path.join(__dirname, "templates", "race_template.html");
const jsonPath = path.join(__dirname, "data", "race_schedule_2025.json");
const outputDir = path.join(__dirname, "output");

// 📄 テンプレート＆データ読込
const template = fs.readFileSync(templatePath, "utf-8");
const json = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

// 📆 'YYYY-MM-DD[...Z]' → JSTのDateオブジェクトへ（時間情報無視）
const parseLocalDate = (dateStr) => {
  const clean = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const [yyyy, mm, dd] = clean.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
};

// 🔍 日付が今週の範囲内か
const isWithinThisWeek = (date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return d >= monday && d <= sunday;
};

// 🎯 今週のレース抽出（JST比較）
const thisWeekRaces = json.races.filter(race => {
  const raceDate = parseLocalDate(race.date);
  return isWithinThisWeek(raceDate);
});

// 📁 出力フォルダの作成（なければ）
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// 📝 各レースのHTML生成（完全対応版）
thisWeekRaces.forEach(race => {
  const fileBase = race.preview.replace(/\.html.*/i, "");
  const html = template
    .replace(/{{title}}/g, `${race.name}（${race.grade}）`)
    .replace(/{{date}}/g, race.date)
    .replace(/{{venue}}/g, race.venue)
    .replace(/{{highlight}}/g, race.highlight || "<p>見どころ準備中</p>")
    .replace(/{{development}}/g, race.development || "<p>展開予想準備中</p>")
    .replace(/{{review}}/g, race.review_text || "<p>レース回顧は後日掲載予定です。</p>");

  const outputPath = path.join(outputDir, `${fileBase}.html`);
  fs.writeFileSync(outputPath, html, "utf-8");
  console.log(`✅ ${fileBase}.html を生成しました`);
});

// 🧭 デバッグ表示（日本時間で確認）
console.log("today:  ", today.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));
console.log("monday: ", monday.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));
console.log("sunday: ", sunday.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));

const fs = require("fs");
const path = require("path");

// 🕒 JSTの「今日」00:00を安全に生成
// 🇯🇵 JSTで「今日」の00:00を生成（補正なしでOK）
const getTodayJST = () => {
  const now = new Date(); // これはOSのローカルタイム（＝JST環境ならそのままでOK）
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const today = getTodayJST();


// 📅 週範囲（JST基準）
const dow = today.getDay(); // 0:日〜6:土
const monday = new Date(today);
monday.setDate(today.getDate() - ((dow + 6) % 7));
const sunday = new Date(monday);
sunday.setDate(monday.getDate() + 6);

// 📂 ファイル読み込みパス
const templatePath = path.join(__dirname, "templates", "race_template.html");
const jsonPath = path.join(__dirname, "data", "race_schedule_2025.json");
const outputDir = path.join(__dirname, "output");

// 📄 テンプレート＆データ読込
const template = fs.readFileSync(templatePath, "utf-8");
const json = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

// 📆 'YYYY-MM-DD' → JST日付に変換
const parseLocalDate = (dateStr) => {
  const [yyyy, mm, dd] = dateStr.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
};

// 🔍 今週の範囲に入っているか
const isWithinThisWeek = (date) => {
  return date >= monday && date <= sunday;
};

// 🎯 今週のレース抽出
const thisWeekRaces = json.races.filter(race => {
  const raceDate = parseLocalDate(race.date);
  return isWithinThisWeek(raceDate);
});

// 📁 出力フォルダを準備
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// 🔁 各レースページを生成（完全版）
thisWeekRaces.forEach(race => {
  const fileBase = race.preview.replace(/\.html.*/, ""); // "kitakyushu" など
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


// 🧭 デバッグログ
console.log('today:', today.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));
console.log('monday:', monday.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));
console.log('sunday:', sunday.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));


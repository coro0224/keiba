const fs = require("fs");
const path = require("path");

// 📁 パス定義
const templatePath = path.join(__dirname, "templates", "race_template.html");
const jsonPath = path.join(__dirname, "data", "race_schedule_2025.json");
const outputDir = path.join(__dirname, "output");

// テンプレートとJSON読み込み
const template = fs.readFileSync(templatePath, "utf-8");
const json = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

// 📆 今週の月曜〜日曜を計算
const stripTime = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const today = stripTime(new Date());
const dow = today.getDay();
const monday = new Date(today);
monday.setDate(today.getDate() - ((dow + 6) % 7));
const sunday = new Date(monday);
sunday.setDate(monday.getDate() + 6);

// 🐎 今週のレースだけ抽出
const isWithinThisWeek = (date) => {
  const d = stripTime(date);
  return d >= monday && d <= sunday;
};

const thisWeekRaces = json.races.filter(race => {
  const raceDate = new Date(race.date);
  return isWithinThisWeek(raceDate) && isWithinThisWeek(today);
});

// 📁 出力フォルダを準備
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// 🔁 各レースページを生成
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

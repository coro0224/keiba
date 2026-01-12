const fs = require("fs");
const path = require("path");

const jsonPath = path.join(__dirname, "data", "race_schedule_2026.json");
const templatePath = path.join(__dirname, "templates", "race_template.html");
const outputDir = path.join(__dirname, "output");

const template = fs.readFileSync(templatePath, "utf-8");
const json = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

// 本日の日付（今週だけ生成したい場合用）
const now = new Date();

const getFileName = (url) => {
  const match = url.match(/^(.+)\.html/);
  return match ? match[1] : "race";
};

json.races.forEach(race => {
  const raceDate = new Date(race.date);
  const fileName = getFileName(race.preview);
  const html = template
    .replace(/{{title}}/g, `${race.name}（${race.grade}）`)
    .replace(/{{date}}/g, `${race.date}`)
    .replace(/{{venue}}/g, `${race.venue}`)
    .replace(/{{preview}}/g, `展開予想の内容をここに記載予定`)
    .replace(/{{review}}/g, `レース回顧の内容をここに記載予定`);

  const outputPath = path.join(outputDir, `${fileName}.html`);
  fs.writeFileSync(outputPath, html, "utf-8");
  console.log(`✅ ${fileName}.html を生成しました`);
});

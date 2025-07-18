const fs = require("fs");
const path = require("path");

// ファイルパス定義
const dataPath = path.join(__dirname, "..", "data", "race_schedule_2025.json");
const templatePath = path.join(__dirname,"..", "templates", "race_template.html");
const outputDir = path.join(__dirname, "output");

// データとテンプレート読み込み
const raceData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const template = fs.readFileSync(templatePath, "utf8");

// 出力フォルダがなければ作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// 曜日取得関数
function getWeekday(dateStr) {
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const date = new Date(dateStr);
  return days[date.getDay()];
}

// レースごとにHTML生成
raceData.races.forEach((race) => {
  const weekday = getWeekday(race.date);
  const gradeNumber = race.grade.replace(/[^0-9]/g, "") || race.grade;
  const distance = race.venue.match(/\d+m/)?.[0] || "";
  const surface = race.venue.includes("芝") ? "芝" : race.venue.includes("ダ") ? "ダート" : race.venue.includes("障害") ? "障害" : "";

  const html = template
    .replace(/{{title}}/g, race.name)
    .replace(/{{grade}}/g, gradeNumber)
    .replace(/{{date}}/g, race.date)
    .replace(/{{weekday}}/g, weekday)
    .replace(/{{venue}}/g, race.venue.split("・")[0])
    .replace(/{{surface}}/g, surface)
    .replace(/{{distance}}/g, distance)
    .replace(/{{highlight}}/g, race.highlight || "")
    .replace(/{{development}}/g, race.development || "")
    .replace(/{{review}}/g, race.review_text || "")
    .replace(/{{image_name}}/g, race.image?.file || "")
    .replace(/{{note_link}}/g, race.note_url
      ? `<a href="${race.note_url}" target="_blank" rel="noopener">📘 NOTEで読む</a>`
      : `<span style="color:#999;">NOTEリンクは準備中です</span>`);

  const outputFileName = `${race.sections.preview.split(".")[0]}.html`;
  const outputPath = path.join(outputDir, outputFileName);

  fs.writeFileSync(outputPath, html);
  console.log(`✅ ${outputFileName} を生成しました`);
});

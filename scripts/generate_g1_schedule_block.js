const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/race_schedule_2025.json");
const races = JSON.parse(fs.readFileSync(filePath, "utf8")).races;

// GⅠレースのみ抽出＆日付順にソート
const g1Races = races
  .filter((race) => race.grade === "G1")
  .sort((a, b) => new Date(a.date) - new Date(b.date));

// 日付→月日形式変換（例：2025-02-23 → 2/23）
function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${parseInt(month, 10)}/${parseInt(day, 10)}`;
}

// HTML生成
let html = `<section class="g1-schedule">\n  <h2>🏇 【GⅠ】レーススケジュール</h2>\n`;

g1Races.forEach((race) => {
  const dateStr = formatDate(race.date);
  const venue = race.venue.split("・")[0];
  const surface = race.venue.includes("芝") ? "芝" : race.venue.includes("ダ") ? "ダ" : race.venue.includes("障害") ? "障害" : "";
  const distance = race.venue.match(/\d+m/)?.[0] || "";
  const htmlName = race.sections.preview.split(".")[0];

  html += `  <details class="schedule-block">\n`;
  html += `    <summary><span class="arrow-icon"></span> ${dateStr}　${race.name}（${venue}・${surface}${distance}）</summary>\n`;
  html += `    <p><a href="${htmlName}.html">▶ レース詳細ページへ</a></p>\n`;
  html += `  </details>\n`;
});

html += `</section>\n`;

fs.writeFileSync(path.join(__dirname, "g1_schedule_block.html"), html, "utf8");
console.log("✅ g1_schedule_block.html を生成しました");

const fs = require("fs");
const path = require("path");
const racePath = path.join(__dirname, "../data/race_schedule_2025.json");
const weeklyPath = path.join(__dirname, "../output/weekly.html");

const racesData = JSON.parse(fs.readFileSync(racePath, "utf-8"));
const today = new Date();
const todayStr = today.toISOString().split("T")[0];

const monday = new Date(today);
monday.setDate(today.getDate() - today.getDay() + 1);
const sunday = new Date(monday);
sunday.setDate(monday.getDate() + 6);

// 曜日変換
function getWeekdayStr(dateStr) {
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const d = new Date(dateStr);
  return days[d.getDay()];
}

// セクション表示関数
function renderRaceBlock(race, sectionType) {
  const file = race.sections?.[sectionType]?.split("#")[0] || "index.html";
  const labelMap = {
    highlight: "見どころ",
    preview: "展開予想",
    review: "レース回顧"
  };
  return `<li><a href="${file}#${sectionType}">${labelMap[sectionType]}</a></li>`;
}

let html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <title>今週のレース</title>
  <link rel="stylesheet" href="styles-weekly.css" />
</head>
<body>
  <article class="weekly-wrap">
    <h1>?? 今週の重賞（${monday.toLocaleDateString("ja-JP")}?${sunday.toLocaleDateString("ja-JP")}）</h1>
`;

racesData.races.forEach((race) => {
  const raceDate = new Date(race.date);
  const dateStr = race.date;
  const weekday = getWeekdayStr(dateStr);
  const label = `${dateStr}（${weekday}）｜${race.name}（${race.grade}）`;

  if (raceDate >= monday && raceDate <= sunday) {
    html += `
      <section class="weekly-race">
        <h3>${label}</h3>
        <ul>
          ${renderRaceBlock(race, "highlight")}
          ${renderRaceBlock(race, "preview")}
          ${renderRaceBlock(race, "review")}
        </ul>
      </section>
    `;
  }
});

html += `
    <h1 style="margin-top:48px;">?? 過去の重賞</h1>
`;

racesData.races.forEach((race) => {
  const raceDate = new Date(race.date);
  const dateStr = race.date;
  const weekday = getWeekdayStr(dateStr);
  const label = `${dateStr}（${weekday}）｜${race.name}（${race.grade}）`;

  if (raceDate < today) {
    html += `
      <section class="past-race">
        <h3>${label}</h3>
        <ul>
          ${renderRaceBlock(race, "highlight")}
          ${renderRaceBlock(race, "preview")}
          ${renderRaceBlock(race, "review")}
        </ul>
      </section>
    `;
  }
});

html += `
    <footer style="text-align:center; margin-top:48px;">
      <a href="index.html">?? トップページへ戻る</a>
    </footer>
  </article>
</body>
</html>
`;

fs.writeFileSync(weeklyPath, html, "utf-8");
console.log("? weekly.html を生成しました");
console.log(`today:   ${today.toLocaleDateString("ja-JP")} ${today.toTimeString().split(" ")[0]}`);
console.log(`monday:  ${monday.toLocaleDateString("ja-JP")}`);
console.log(`sunday:  ${sunday.toLocaleDateString("ja-JP")}`);

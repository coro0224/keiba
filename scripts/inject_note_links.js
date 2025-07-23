const fs = require("fs");
const path = require("path");

const racePath = path.join(__dirname, "../data/race_schedule_2025.json");
const notePath = path.join(__dirname, "../data/note_articles.json");

// JSON読み込み（races配列にアクセス）
const raceWrapper = JSON.parse(fs.readFileSync(racePath, "utf8"));
const raceArray = raceWrapper.races;
const notes = JSON.parse(fs.readFileSync(notePath, "utf8"));

// 差し込み処理
raceArray.forEach(race => {
  const note = notes.find(n =>
    n.race_name === race.name && n.date === race.date
  );

  if (note && note.url && note.url.trim() !== "") {
    race.note_url = note.url;
    console.log(`✅ 注入: ${race.name} → ${note.url}`);
  } else {
    console.log(`⚠️ NOTEなし → ${race.name}`);
  }
});

// 上書き保存
fs.writeFileSync(racePath, JSON.stringify({ races: raceArray }, null, 2), "utf8");
console.log("✅ race_schedule_2025.json に note_url を注入しました");

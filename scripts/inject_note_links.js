const fs = require("fs");
const path = require("path");

const racePath = path.join(__dirname, "../data/race_schedule_2025.json");
const raceData = JSON.parse(fs.readFileSync(racePath, "utf8"));
const notePath = path.join(__dirname, "../data/note_articles.json");

const races = JSON.parse(fs.readFileSync(racePath, "utf-8"));
const notes = JSON.parse(fs.readFileSync(notePath, "utf-8"));
for (const raceId in raceData) {
  const race = raceData[raceId];
  if (!race.note || !race.note.url || race.note.url.trim() === "") {
    console.log(`⚠️ NOTEなし → ${race.name}`);
    continue;
  }

  // HTML処理などの挿入ロジック
}

races.races.forEach(race => {
  const note = notes.find(n =>
    n.race_name === race.name && n.date === race.date
  );
  if (note) {
    race.note_url = note.url;
  }
});

fs.writeFileSync(racePath, JSON.stringify(races, null, 2), "utf-8");
console.log("✅ race_schedule_2025.json に note_url を注入しました");

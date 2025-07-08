const fs = require("fs");
const path = require("path");

const racePath = path.join(__dirname, "../data/race_schedule_2025.json");
const notePath = path.join(__dirname, "../data/note_articles.json");

const races = JSON.parse(fs.readFileSync(racePath, "utf-8"));
const notes = JSON.parse(fs.readFileSync(notePath, "utf-8"));

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

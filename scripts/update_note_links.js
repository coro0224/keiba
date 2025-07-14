const fs = require("fs");
const path = require("path");

const racePath = path.join(__dirname, "../data/race_schedule_2025.json");
const outputDir = path.join(__dirname, "../output");

const raceJson = JSON.parse(fs.readFileSync(racePath, "utf8"));
let updated = 0;

raceJson.races.forEach(race => {
  if (race.note_url) return;

  const notePath = path.join(outputDir, `note_${race.id}.html`);
  if (fs.existsSync(notePath)) {
    race.note_url = `note_${race.id}.html`;
    updated++;
  }
});

fs.writeFileSync(racePath, JSON.stringify(raceJson, null, 2), "utf8");
console.log(`✅ NOTEリンクを追加したレース数: ${updated}`);

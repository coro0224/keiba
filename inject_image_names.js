// scripts/inject_image_names.js
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../data/race_schedule_2025.json");
const json = JSON.parse(fs.readFileSync(file, "utf-8"));

const normalize = name =>
  name.toLowerCase()
      .replace(/記念|ステークス|ジャンプ|賞|カップ|S|特別/g, "")
      .replace(/[^\wぁ-んァ-ン]+/g, "_")
      .replace(/__+/g, "_")
      .replace(/(^_|_$)/g, "")
      .replace(/ー/g, "")
      .replace(/[ぁ-ん]/g, s => s.normalize("NFKC")); // 平仮名対策

json.races.forEach(race => {
  const datePart = race.date.replace(/-/g, "");
  const gradePart = race.grade.toUpperCase();
  const baseName = normalize(race.name);
  race.image_name = `${baseName}_${datePart}_${gradePart}.png`;
});

fs.writeFileSync(file, JSON.stringify(json, null, 2), "utf-8");
console.log("✅ image_name を注入しました");

const fs = require("fs");
const path = require("path");

const racePath = path.join(__dirname, "../data/race_schedule_2025.json");
const outputDir = path.join(__dirname, "../output");

const raceJson = JSON.parse(fs.readFileSync(racePath, "utf8"));
let injected = 0;

raceJson.races.forEach(race => {
  const highlight = race.highlight?.trim();
  const htmlFile = race.sections?.highlight?.split("#")[0];
  if (!highlight || !htmlFile) return;

  const filePath = path.join(outputDir, htmlFile);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ highlight 未注入 → ${race.name}（${htmlFile} が未作成）`);
    return;
  }

  const html = fs.readFileSync(filePath, "utf8");
  const newSection = `
<section id="highlight">
  <h2>見どころ</h2>
  <p>${highlight}</p>
</section>
  `.trim();

  const updatedHtml = html.replace(/<section id="highlight">[\s\S]*?<\/section>/, newSection);
  fs.writeFileSync(filePath, updatedHtml, "utf8");
  injected++;
  console.log(`✅ ${race.name} に highlight を注入しました`);
});

console.log(`✅ highlight を注入したレース数: ${injected}`);

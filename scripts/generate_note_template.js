const fs = require("fs");
const path = require("path");

const racePath = path.join(__dirname, "../data/race_schedule_2025.json");
const outputDir = path.join(__dirname, "../output");

const raceJson = JSON.parse(fs.readFileSync(racePath, "utf8"));
let count = 0;

raceJson.races.forEach(race => {
  const note = race.note;
  if (!note || !note.url || !note.title) return;

  const fileName = `note_${race.id}.html`;
  const filePath = path.join(outputDir, fileName);

  if (fs.existsSync(filePath)) return;

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <title>${note.title}</title>
  <link rel="stylesheet" href="styles-note.css" />
</head>
<body>
  <section class="note-header">
    <h1>${note.title}</h1>
    <p><strong>著者:</strong> ${note.author || "不明"}</p>
    <p><a href="${note.url}" target="_blank">▶ NOTEページを見る</a></p>
  </section>
</body>
</html>
  `.trim();

  fs.writeFileSync(filePath, html, "utf8");
  count++;
});

console.log(`✅ NOTEテンプレートを追加したレース数: ${count}`);

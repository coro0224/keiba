const fs = require("fs");
const path = require("path");

const racePath = path.join(__dirname, "../data/race_schedule_2025.json");
const outputDir = path.join(__dirname, "../output");

const raceJson = JSON.parse(fs.readFileSync(racePath, "utf8"));
let injected = 0;

raceJson.races.forEach(race => {
  const htmlFile = race.sections?.highlight?.split("#")[0];
  if (!htmlFile) return;

  const filePath = path.join(outputDir, htmlFile);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ 注入未実行 → ${race.name}（${htmlFile} が未作成）`);
    return;
  }

  let html = fs.readFileSync(filePath, "utf8");
  let updated = false;

  // 🎯 highlight セクション注入
  if (race.highlight?.trim()) {
    const highlightHtml = `
<section id="highlight">
  <h2>見どころ</h2>
  ${race.highlight}
</section>`.trim();
    html.replace(/<section[^>]+id=["']highlight["'][^>]*>[\s\S]*?<\/section>/, newSection);

    console.log(`✅ ${race.name} に highlight を注入しました`);
    updated = true;
  }

  // 📊 preview セクション注入
  if (race.preview_text?.trim()) {
    const previewHtml = `
<section id="preview">
  <h2>展開予想</h2>
  ${race.preview_text}
</section>`.trim();
    html.replace(/<section[^>]+id=["']preview["'][^>]*>[\s\S]*?<\/section>/, newSection);
    console.log(`✅ ${race.name} に preview を注入しました`);
    updated = true;
  }

  // 🐎 review セクション注入
  if (race.review_text?.trim()) {
    const reviewHtml = `
<section id="review">
  <h2>レース回顧</h2>
  ${race.review_text}
</section>`.trim();
    html.replace(/<section[^>]+id=["']review["'][^>]*>[\s\S]*?<\/section>/, newSection);
    console.log(`✅ ${race.name} に review を注入しました`);
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(filePath, html, "utf8");
    injected++;
  }
});

console.log(`✅ 注入を実施したレース数: ${injected}`);

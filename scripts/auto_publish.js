const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const { log, divider } = require("./logger");

log("🚀 Copilot連携・一括更新フロー開始");
divider();

// 🛠 画像パス補正（preview内）
function fixPreviewImagePath(previewText, raceId) {
  return previewText.replace(/<img src=['"]images\/[^'"]+['"]/g, `<img src='../images/${raceId}.png'`);
}

// 🎯 バナー生成（NOTEリンクと誘導見出し付き）
function buildLeadBanner(race) {
  return `
  <div class="race-lead-banner">
    <h4 class="race-lead-caption">📢 ${race.name}の買い目はこちらからチェック！</h4>
    <a href="${race.note_url}" target="_blank" rel="noopener" class="note-banner-link">
      <div class="note-banner">
        <img src="../images/${race.id}.png" alt="${race.name}バナー" />
      </div>
    </a>
  </div>
  `;
}

// 🔃 スクリプト順次実行
const scripts = [
  "generate_note_template.js",
  "update_note_links.js",
  "generate_highlights.js",
  "inject_highlights.js",
  "inject_note_links.js",
  "inject_right_note.js",
  "generate_weekly.js"
];

for (const script of scripts) {
  try {
    log(`▶ 実行中: ${script}`);
    execSync(`node ${path.join(__dirname, script)}`, { stdio: "inherit" });
    log(`✅ 完了: ${script}`);
    divider();
  } catch (error) {
    log(`❌ エラー: ${script}`);
    log(error.message);
    divider();
  }
}

// 📄 race_template.html 適用開始
try {
  log("📄 race_template.html に HTML生成開始");

  const schedulePath = path.join(__dirname, "../data/race_schedule_2025.json");
  const templatePath = path.join(__dirname, "../templates/race_template.html");
  const outputDir = path.join(__dirname, "../output");

  const scheduleRaw = fs.readFileSync(schedulePath, "utf8");
  const templateRaw = fs.readFileSync(templatePath, "utf8");
  const scheduleJson = JSON.parse(scheduleRaw);
  const races = scheduleJson.races;

  function applyTemplate(template, race) {
    race.preview = fixPreviewImagePath(race.preview_text || "", race.id);
    race.lead_banner = buildLeadBanner(race);

    let result = template;

    Object.entries(race).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([subKey, subVal]) => {
          const pattern = new RegExp(`{{${key}.${subKey}}}`, "g");
          result = result.replace(pattern, subVal || "");
        });
      } else {
        const pattern = new RegExp(`{{${key}}}`, "g");
        result = result.replace(pattern, value || "");
      }
    });

    const weekday = "日";
    const surface = race.venue.includes("芝") ? "芝" : "ダート";
    const distance = race.venue.match(/\d+m/)?.[0] || "";

    result = result
      .replace(/{{title}}/g, race.name) // ✅ title 明示的マッピング
      .replace(/{{weekday}}/g, weekday)
      .replace(/{{surface}}/g, surface)
      .replace(/{{distance}}/g, distance)
      .replace(/{{note_link}}/g, `<a href="${race.note_url}" target="_blank" class="note-button">note記事を見る</a>`);

    return result;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  races.forEach((race) => {
    const filledHtml = applyTemplate(templateRaw, race);
    const outputPath = path.join(outputDir, `${race.id}.html`);
    fs.writeFileSync(outputPath, filledHtml, "utf8");
    log(`✅ HTML生成完了: ${race.id}.html`);
  });

  divider();
} catch (err) {
  log("💥 HTML生成中にエラーが発生しました");
  log(err.message);
  divider();
}

log("🏁 Copilot一括更新フロー終了");
console.log(chalk.bold("\n✅ 一連の更新作業が正常に完了しました\n"));

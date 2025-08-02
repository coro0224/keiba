const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk"); // 色付きログ表示（optional）
const { log, divider } = require("./logger");

log("🚀 Copilot連携・一括更新フロー開始");
divider();

// 🧩 自動実行するスクリプト一覧（順番が重要）
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
    log(`🟢 実行中: ${script}`);
    execSync(`node ${path.join(__dirname, script)}`, { stdio: "inherit" });
    log(`✅ 完了: ${script}`);
    divider();
  } catch (error) {
    log(`❌ エラー: ${script}`);
    log(error.message);
    divider();
  }
}

// 🚀 最終HTMLを生成して note_banner を注入
try {
  log("📄 race_template.html に HTML生成中");

  const schedulePath = path.join(__dirname, "../data/race_schedule_2025.json");
  const templatePath = path.join(__dirname, "../templates/race_template.html");
  const outputDir = path.join(__dirname, "../output");

  const scheduleJson = JSON.parse(fs.readFileSync(schedulePath, "utf8"));
  const templateRaw = fs.readFileSync(templatePath, "utf8");

  const sekiyaData = scheduleJson.find(race => race.id === "20250727_sekiya");
  if (!sekiyaData) throw new Error("関屋記念のレース情報が見つかりません");

  // 置換処理
  let template = templateRaw
    .replace(/{{title}}/g, sekiyaData.name)
    .replace(/{{grade}}/g, sekiyaData.grade)
    .replace(/{{date}}/g, sekiyaData.date)
    .replace(/{{weekday}}/g, "日") // 固定 or 日付から計算可
    .replace(/{{venue}}/g, sekiyaData.venue.split("・")[0])
    .replace(/{{surface}}/g, sekiyaData.venue.includes("芝") ? "芝" : "ダート")
    .replace(/{{distance}}/g, sekiyaData.venue.match(/\d+m/)?.[0] || "")
    .replace(/{{image_name}}/g, sekiyaData.image?.file || "")
    .replace(/{{highlight}}/g, sekiyaData.highlight || "")
    .replace(/{{preview}}/g, sekiyaData.preview_text || "")
    .replace(/{{review}}/g, sekiyaData.review_text || "")
    .replace(/{{note_banner}}/g, sekiyaData.note_banner || "")
    .replace(/{{note_link}}/g, `<a href="${sekiyaData.note_url}" target="_blank" class="note-button">note記事を見る</a>`);

  const outputPath = path.join(outputDir, "sekiya.html");
  fs.writeFileSync(outputPath, template, "utf8");

  log("✅ HTML出力完了: sekiya.html にバナー含めて反映済み");
  divider();
} catch (err) {
  log("❌ 最終HTML出力時にエラー発生");
  log(err.message);
  divider();
}

log("✅ Copilot一括更新フロー終了");
console.log(chalk.bold("\n🎉 一連の更新作業が正常に完了しました\n"));

// scripts/auto_publish.js

const { execSync } = require("child_process");
const path = require("path");
const chalk = require("chalk"); // 色付きログ表示（optional）
const { log, divider } = require("./logger");


function run(scriptName) {
  const scriptPath = path.join(__dirname, scriptName);
  try {
    console.log(chalk.cyan(`🚀 実行中: ${scriptName}`));
    execSync(`node ${scriptPath}`, { stdio: "inherit" });
    console.log(chalk.green(`✅ 完了: ${scriptName}\n`));
  } catch (err) {
    console.error(chalk.red(`❌ エラー: ${scriptName}`));
    console.error(chalk.gray(err.message));
  }
}

log("🚀 Copilot連携・一括更新フロー開始");
divider();

// 🧩 自動実行するスクリプト一覧（順番が重要）
const scripts = [
  "generate_note_template.js",
  "update_note_links.js",
  "generate_highlights.js",
  "inject_highlights.js",
  "inject_note_links.js",
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

log("✅ Copilot一括更新フロー終了");

console.log(chalk.bold("\n📦 Copilot連携・一括更新フロー開始\n"));


console.log(chalk.bold("\n🎉 一連の更新作業が正常に完了しました\n"));

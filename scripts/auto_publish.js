// scripts/auto_publish.js

const { execSync } = require("child_process");
const path = require("path");
const chalk = require("chalk"); // 色付きログ表示（optional）

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

// 🧩 自動実行するスクリプト一覧（順番が重要）
const tasks = [
  "generate_highlights.js",     // 見どころ文を自動生成（Copilot組込み）
  "inject_highlights.js",       // highlight文をHTMLに挿入
  "inject_note_links.js",       // NOTEリンクをHTMLに追加
  "inject_image_names.js",      // 画像ファイル名を挿入（任意）
  "generate_weekly.js"          // レースHTMLをテンプレートから出力
];

console.log(chalk.bold("\n📦 Copilot連携・一括更新フロー開始\n"));

tasks.forEach(run);

console.log(chalk.bold("\n🎉 一連の更新作業が正常に完了しました\n"));

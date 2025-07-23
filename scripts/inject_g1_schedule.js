const fs = require("fs");
const path = require("path");

// ファイルパス（必要に応じて調整）
const indexPath = path.join(__dirname, "..", "index.html");
const blockPath = path.join(__dirname, "..", "g1_schedule_block.html");

// ファイル読み込み
const indexHtml = fs.readFileSync(indexPath, "utf8");
const g1Block = fs.readFileSync(blockPath, "utf8");

// インクルードコメント部分を静的HTMLに差し替え
const result = indexHtml.replace(
  /<!--#include\s+file=["']g1_schedule_block\.html["']\s*-->/g,
  g1Block
);

// 上書き保存（index.htmlを直接更新）
fs.writeFileSync(indexPath, result, "utf8");
console.log("✅ index.html に GⅠスケジュールを埋め込みました");

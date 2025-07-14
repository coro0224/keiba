const fs   = require("fs");
const path = require("path");

// JST 本日の00:00 を取得
const getTodayJST = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};
const today = getTodayJST();

// 週の範囲を計算
const dow    = today.getDay();          // 0=日曜～6=土曜
const monday = new Date(today);
monday.setDate(today.getDate() - ((dow + 6) % 7));
const sunday = new Date(monday);
sunday.setDate(monday.getDate() + 6);

// ファイルパス
const templatePath = path.join(__dirname, "../templates/race_template.html");
const jsonPath     = path.join(__dirname, "../data/race_schedule_2025.json");
const outputDir    = path.join(__dirname, "../output");

// テンプレート & JSON 読み込み
const template = fs.readFileSync(templatePath, "utf-8");
const json     = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

// YYYY-MM-DD→Date オブジェクト化
const parseLocalDate = dateStr => {
  const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d);
};

// 今週のレースを抽出
const thisWeekRaces = json.races.filter(r => {
  const d = parseLocalDate(r.date);
  return d >= monday && d <= sunday;
});

// 出力先がなければ作成
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// 各レース HTML を生成

thisWeekRaces.forEach(race => {
	const preview = race.preview || race.sections?.preview || "";

	if (!preview) {
	  console.warn(`⚠️ preview 未定義 → ${race.name}`);
	  return; // もしくは continue;
	}

	const fileBase = preview.replace(/\.html.*/i, "");
	if (race.preview && typeof race.preview === "string") {
	  // 続きの処理...
	} else {
	  console.warn(`⚠️ previewが未定義: ${race.name || "未設定レース"}`);
	  return;
	}
  
  // ─── 修正ポイント ───
  // template 文字列から始まるチェーンで .replace() をつなぎます
  const html = template
    .replace(/{{title}}/g,
      `${race.name}（<span class="grade-label ${race.grade.toLowerCase()}">${race.grade}</span>）`
    )
    .replace(/{{image_name}}/g,
      race.image_name || "default_race_image.png"
    )
    .replace(/{{date}}/g, race.date)
    .replace(/{{venue}}/g, race.venue)
    .replace(/{{highlight}}/g,
      race.highlight || "<p>見どころは後日掲載予定です。</p>"
    )
    .replace(/{{development}}/g,
      race.development || "<p>展開予想は準備中です。</p>"
    )
    .replace(/{{review}}/g,
      race.review_text || "<p>レース回顧はレース終了後に追記予定です。</p>"
    )
    .replace(/{{note_link}}/g,
      race.note_url
        ? `<a href="${race.note_url}" target="_blank">
             <img src="images/note_button.png" alt="NOTE考察はこちら" />
             <span>▶ NOTEで展開全文を見る</span>
           </a>`
        : "▶ NOTE考察：<span style='color:#888;'>後日掲載予定</span>"
    .replace(/{{note_link}}/g, race.note_url
	  ? `<a href="${race.note_url}" target="_blank">▶ NOTE考察を見る</a>`
	  : "▶ NOTE考察：<span style='color:#888;'>後日掲載予定</span>")

    );
  // ────────────────────

  const outputPath = path.join(outputDir, `${fileBase}.html`);
  fs.writeFileSync(outputPath, html, "utf-8");
  console.log(`✅ ${fileBase}.html を生成しました`);
});

// デバッグログ
console.log("today:  ", today.toLocaleString("ja-JP"));
console.log("monday: ", monday.toLocaleString("ja-JP"));
console.log("sunday: ", sunday.toLocaleString("ja-JP"));

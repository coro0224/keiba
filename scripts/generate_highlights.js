const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const racePath = path.join(__dirname, "../data/race_schedule_2025.json");

// ✨ GPT補助で生成する関数群
async function generateHighlight(title, venue, date, horses = []) {
  const systemPrompt =
    "あなたは競馬ファン向けの解説に長けた専門ライターです。レースの“見どころ”を1～2文で、語感・臨場感・競馬らしさを込めて簡潔にまとめてください。";

  const horseText = horses.length ? `注目馬: ${horses.join("、")}` : "";
  const userPrompt = `レース名: ${title}\n開催地: ${venue}\n日付: ${date}\n${horseText}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 300
    })
  });

  const json = await response.json();
  const content = json?.choices?.[0]?.message?.content?.trim();

  if (!content) {
    console.warn("⚠️ Copilot応答なし → にの補完文で対応します");
    return `注目馬が激突する ${title}。展開の鍵を握るのは ${horses.join("、")}。`;
  }

  return content;
}

async function generatePreview(title, venue, date, horses = []) {
  const systemPrompt =
    "あなたは競馬ファン向けに展開予想を書く専門ライターです。レース展開・コース特性・脚質傾向・注目馬の動きを含めた解説を、note記事向けに読みやすくHTMLの<p>タグ付きでまとめてください。改行・語感重視。";

  const userPrompt = `レース名: ${title}\n開催地: ${venue}\n日付: ${date}\n展開を読み解く馬: ${horses.join("、")}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 600
    })
  });

  const json = await response.json();
  const content = json?.choices?.[0]?.message?.content?.trim();

  if (!content) {
    console.warn("⚠️ Copilot応答なし → にの補完文で対応します");
    return `<p>${title}は展開が鍵を握る一戦。注目は ${horses.join("、")} の動き。</p>`;
  }

  return content;
}

async function generateReview(title, date, winner, horses = []) {
  const systemPrompt =
    "あなたは競馬専門のレース回顧ライターです。勝ち馬・展開・時計・位置取り・今後の展望を含めて、noteやWeb記事向けに読みやすくHTMLの<p>タグ付きでまとめてください。文体は柔らかめ、臨場感重視。";

  const userPrompt = `レース名: ${title}\n日付: ${date}\n勝ち馬: ${winner}\n展開で注目された馬: ${horses.join("、")}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.75,
      max_tokens: 700
    })
  });

  const json = await response.json();
  const content = json?.choices?.[0]?.message?.content?.trim();

  if (!content) {
    console.warn("⚠️ Copilot応答なし → にの補完文で対応します");
    return `<p>${title}は${date}に行われ、${winner}が勝利。展開の鍵を握った馬たちは ${horses.join("、")}。</p>`;
  }

  return content;
}

// ✅ 今週レースの判定（月曜〜日曜）
function isThisWeek(dateStr) {
  const raceDate = new Date(dateStr);
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return raceDate >= monday && raceDate <= sunday;
}

// 🏇 実行本体
async function run() {
  const raw = fs.readFileSync(racePath, "utf8");
  const raceJson = JSON.parse(raw);
  let updated = 0;

  for (const race of raceJson.races) {
    if (isThisWeek(race.date)) {
      const horses = race.main_horses || [];

      // 🎯 highlight
      if (!race.highlight || race.highlight.trim() === "") {
        console.log(`📝 ${race.name} → 見どころ生成中...`);
        race.highlight = await generateHighlight(race.name, race.venue, race.date, horses);
        updated++;
      }

      // 📊 preview_text
      if (!race.preview_text || race.preview_text.trim() === "") {
        console.log(`📊 ${race.name} → 展開予想生成中...`);
        race.preview_text = await generatePreview(race.name, race.venue, race.date, horses);
        updated++;
      }

      // 🐎 review_text
      if (!race.review_text || race.review_text.trim() === "") {
        if (race.result?.winner) {
          console.log(`🐎 ${race.name} → レース回顧生成中...`);
          race.review_text = await generateReview(race.name, race.date, race.result.winner, horses);
          updated++;
        } else {
          console.warn(`⏳ ${race.name} → 勝ち馬不明のためレース回顧未生成`);
        }
      }
    }
  }

  fs.writeFileSync(racePath, JSON.stringify(raceJson, null, 2), "utf8");
  console.log(`✅ セクションを追加・更新したレース数: ${updated}`);
}

run();

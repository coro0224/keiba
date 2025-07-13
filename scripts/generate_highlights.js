// scripts/generate_highlights.js

const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

// ✅ OpenAI APIキー（.env管理推奨）
require("dotenv").config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 📄 読み込むファイルパス
const dataPath = path.join(__dirname, "../data/race_schedule_2025.json");

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
  return json?.choices?.[0]?.message?.content?.trim() || "（見どころ未生成）";
}

async function run() {
  const raw = fs.readFileSync(dataPath, "utf8");
  const races = JSON.parse(raw);
  let updated = 0;

  for (const raceId in races) {
    const race = races[raceId];
    if (!race.highlight || race.highlight.trim() === "") {
      console.log(`📝 ${race.title} → 見どころ生成中...`);

      const horses = race.main_horses || [];
      const highlight = await generateHighlight(race.title, race.venue, race.date, horses);

      race.highlight = highlight;
      updated++;
    }
  }

  fs.writeFileSync(dataPath, JSON.stringify(races, null, 2), "utf8");
  console.log(`✅ highlight を追加したレース数: ${updated}`);
}

run();

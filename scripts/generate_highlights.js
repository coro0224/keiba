const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const racePath = path.join(__dirname, "../data/race_schedule_2025.json");

// Copilot補助の見どころ生成（応答なし → にの補完）
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

  // 🔰 にの補完ブロック（API応答がない場合）
  if (!content) {
    console.warn("⚠️ Copilot応答なし → にの補完文で対応します");
    const fallbackText = `注目馬が激突する ${title}。展開の鍵を握るのは ${horses.join("、")}。`;
    return fallbackText;
  }

  return content;
}

// 今週の判定（月曜〜日曜）
function isThisWeek(dateStr) {
  const raceDate = new Date(dateStr);
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return raceDate >= monday && raceDate <= sunday;
}

async function run() {
  const raw = fs.readFileSync(racePath, "utf8");
  const raceJson = JSON.parse(raw);
  let updated = 0;

  for (const race of raceJson.races) {
    if (!race.highlight || race.highlight.trim() === "") {
      if (isThisWeek(race.date)) {
        console.log(`📝 ${race.name} → 見どころ生成中...`);
        const highlight = await generateHighlight(race.name, race.venue, race.date, race.main_horses);
        race.highlight = highlight;
        updated++;
      }
    }
  }

  fs.writeFileSync(racePath, JSON.stringify(raceJson, null, 2), "utf8");
  console.log(`✅ highlight を追加したレース数: ${updated}`);
}

run();

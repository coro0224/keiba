const fs = require("fs");
const path = require("path");

const jsonPath = path.join(__dirname, "data", "race_schedule_2025.json");
const json = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

const today = new Date();
const dow = today.getDay();
const monday = new Date(today);
monday.setDate(today.getDate() - ((dow + 6) % 7));
monday.setHours(0, 0, 0, 0);

const sunday = new Date(monday);
sunday.setDate(monday.getDate() + 6);
sunday.setHours(23, 59, 59, 999);

json.races.forEach(race => {
  const raceDate = new Date(race.date);
  if (raceDate >= monday && raceDate <= sunday && race.name.includes("北九州記念")) {
    race.highlight = `<p>夏の短距離重賞・北九州記念は、実績馬と上り馬が入り混じる混戦模様。<br>
注目は14番アブキールベイ。3歳牝馬ながら葵Sを制し、古馬相手でも通用するスピードを証明した。<br>
2番人気の18番ヨシノイースターは昨年2着のリベンジを狙い、坂路での好調教が光る。<br>
6歳牝馬11番ドロップオブライトは高松宮記念8着の実績があり、人気薄でも激走の可能性を秘める。<br>
さらに、4歳馬15番ロードフォアエースは芝1200mで安定感抜群の差し脚を武器に、重賞初制覇を狙う。<br>
斤量差と馬場適性が勝敗を分ける一戦となりそうだ。</p>`;

    race.development = `<p>【前半】<br>
スタート直後、5番モズメイメイが好ダッシュを決めて先頭へ。<br>
14番アブキールベイが外から並びかけ、18番ヨシノイースターは好位の外目をキープ。<br>
内からは1番ヤマニンアンフィル、3番レッドヒルシューズが先団に取りつく。<br>
15番ロードフォアエースは中団のインで脚を溜め、11番ドロップオブライトは後方からじっくり構える展開。</p>

<p>【中盤】<br>
3コーナーにかけて、5番モズメイメイがペースを引き上げ、14番アブキールベイがぴったりマーク。<br>
18番ヨシノイースターは外から徐々に進出を開始。<br>
7番クラスペディア、9番ヤマニンアルリフラも中団から押し上げる。<br>
15番ロードフォアエースは内でじっと我慢、11番ドロップオブライトは馬群の後方で進路を探る。</p>

<p>【終盤】<br>
直線に向いても5番モズメイメイが粘るが、14番アブキールベイが外から並びかける。<br>
18番ヨシノイースターが大外から豪脚を繰り出し、先頭争いに加わる。<br>
内からは15番ロードフォアエースが馬群を割って伸び、11番ドロップオブライトも大外から追い込む。<br>
最後は14番アブキールベイと18番ヨシノイースターの叩き合いに、15番ロードフォアエースが迫る白熱のゴール前。</p>`;

    race.review_text = `<p>レース回顧はレース終了後に追記予定です。</p>`;
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2), "utf-8");
console.log("✅ 北九州記念の highlight / development / review_text を注入しました");

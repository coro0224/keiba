document.addEventListener("DOMContentLoaded", () => {
  fetch("data/race_schedule_2025.json?v=20250706")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("past-race-container");
      container.innerHTML = "";

      // 🇯🇵 JSTで今日00:00を取得
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // 📅 今週の月曜〜日曜を定義
      const dow = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - ((dow + 6) % 7));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      // 🔎 文字列日付 → JST基準Dateに変換
      const parseDate = (str) => {
        const clean = str.includes("T") ? str.split("T")[0] : str;
        const [yyyy, mm, dd] = clean.split("-").map(Number);
        return new Date(yyyy, mm - 1, dd);
      };

      // 🐴 今週より前のレースのみを抽出
      const pastRaces = data.races.filter(race => {
        const raceDate = parseDate(race.date);
        return raceDate < monday;
      });

      // 📅 月 → 日付 → レース の3階層構造にまとめる
      const months = {};
      pastRaces.forEach(race => {
        const dateObj = parseDate(race.date);
        const month = `${dateObj.getMonth() + 1}`.padStart(2, "0");
        const day = `${dateObj.getDate()}`.padStart(2, "0");
        const key = `${month}`;
        const weekKey = `${month}/${day}`;

        if (!months[key]) months[key] = {};
        if (!months[key][weekKey]) months[key][weekKey] = [];
        months[key][weekKey].push(race);
      });

      // 🧩 HTML構築：月 → 週 → レース
      Object.keys(months).sort().forEach(month => {
        const monthDetails = document.createElement("details");
        monthDetails.classList.add("note-block");

        const monthSummary = document.createElement("summary");
        monthSummary.innerHTML = `<span class="arrow-icon"></span>${month}月`;
        monthDetails.appendChild(monthSummary);

        Object.keys(months[month]).sort().reverse().forEach(week => {
          const weekDetails = document.createElement("details");
          weekDetails.classList.add("race-block");

          const weekSummary = document.createElement("summary");
          weekSummary.innerHTML = `<span class="arrow-icon"></span>${week} の重賞`;
          weekDetails.appendChild(weekSummary);

          months[month][week].forEach(race => {
            const raceItem = document.createElement("p");
            raceItem.innerHTML = `
              【<span class="${race.grade.toLowerCase()}">${race.grade}</span>】
              ${race.name}（${race.venue}）<br>
              <a href="${race.review}">▶ レース回顧を見る</a>
            `;
            weekDetails.appendChild(raceItem);
          });

          monthDetails.appendChild(weekDetails);
        });

        container.appendChild(monthDetails);
      });

      // ✅ デバッグログ
      console.log("today(JST):", today.toLocaleDateString("ja-JP"));
      console.log("monday:", monday.toLocaleDateString("ja-JP"));
      console.log("sunday:", sunday.toLocaleDateString("ja-JP"));
    })
    .catch(err => {
      console.error("過去重賞データ取得エラー:", err);
      const fallback = document.getElementById("past-race-container");
      if (fallback) {
        fallback.innerHTML = `<p style="color:red;">過去レース情報を読み込めませんでした。</p>`;
      }
    });
});

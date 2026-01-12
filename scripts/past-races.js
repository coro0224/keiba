document.addEventListener("DOMContentLoaded", () => {
  fetch("data/race_schedule_2026.json?v=20250706")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("past-race-container");
      container.innerHTML = "";

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const dow = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - ((dow + 6) % 7));
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999); // ✅ 日曜の終わりまで含める

      const parseDate = (str) => {
        const clean = str.includes("T") ? str.split("T")[0] : str;
        const [yyyy, mm, dd] = clean.split("-").map(Number);
        return new Date(yyyy, mm - 1, dd);
      };

      const pastRaces = data.races.filter(race => {
        const raceDate = parseDate(race.date);
        raceDate.setHours(0, 0, 0, 0);
        return raceDate < today; // ✅ 今週の日曜まで含める
      });

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
            const links = [];

            if (race.sections?.highlight) {
              links.push(`<a href="${race.sections.highlight}">▶ 見どころを見る</a>`);
            } else {
              links.push(`▶ 見どころ：<span style="color:#888;">後日記載予定</span>`);
            }

            if (race.sections?.preview) {
              links.push(`<a href="${race.sections.preview}">▶ 展開予想を見る</a>`);
            } else {
              links.push(`▶ 展開予想：<span style="color:#888;">後日記載予定</span>`);
            }

            if (race.sections?.review) {
              links.push(`<a href="${race.sections.review}">▶ レース回顧を見る</a>`);
            } else {
              links.push(`▶ レース回顧：<span style="color:#888;">後日記載予定</span>`);
            }

            const raceItem = document.createElement("p");
            raceItem.innerHTML = `
              【<span class="${race.grade.toLowerCase()}">${race.grade}</span>】
              ${race.name}（${race.venue}）<br>
              ${links.join("<br>")}
            `;
            weekDetails.appendChild(raceItem);
          });

          monthDetails.appendChild(weekDetails);
        });

        container.appendChild(monthDetails);
      });

      console.log("past-races loaded:", pastRaces.length, "件");
    })
    .catch(err => {
      console.error("過去重賞データ取得エラー:", err);
      const fallback = document.getElementById("past-race-container");
      if (fallback) {
        fallback.innerHTML = `<p style="color:red;">過去レース情報を読み込めませんでした。</p>`;
      }
    });
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("data/race_schedule_2026.json?v=20250706")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("past-race-container");
      if (!container) return;

      container.innerHTML = "";

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const parseDate = (str) => {
        const clean = str.includes("T") ? str.split("T")[0] : str;
        const [yyyy, mm, dd] = clean.split("-").map(Number);
        return new Date(yyyy, mm - 1, dd);
      };

      // ▼ 過去レース抽出
      const pastRaces = data.races.filter(race => {
        const raceDate = parseDate(race.date);
        raceDate.setHours(0, 0, 0, 0);
        return raceDate <= today;
      });

      // ▼ 年度 → 月 → 日付 の3階層構造
      const years = {};

      pastRaces.forEach(race => {
        const dateObj = parseDate(race.date);
        const year = `${dateObj.getFullYear()}`;
        const month = `${dateObj.getMonth() + 1}`.padStart(2, "0");
        const day = `${dateObj.getDate()}`.padStart(2, "0");
        const weekKey = `${month}/${day}`;

        if (!years[year]) years[year] = {};
        if (!years[year][month]) years[year][month] = {};
        if (!years[year][month][weekKey]) years[year][month][weekKey] = [];

        years[year][month][weekKey].push(race);
      });

      // ▼ 最新年度を取得（最大値）
      const yearKeys = Object.keys(years).map(Number);
      const latestYear = Math.max(...yearKeys).toString();

      // ▼ DOM生成（年度 → 月 → 日付）
      Object.keys(years).sort().reverse().forEach(year => {
        const yearDetails = document.createElement("details");
        yearDetails.classList.add("note-block");
        if (year === latestYear) yearDetails.open = true;

        const yearSummary = document.createElement("summary");
        yearSummary.innerHTML = `<span class="arrow-icon"></span>${year}年`;
        yearDetails.appendChild(yearSummary);

        const months = years[year];
        Object.keys(months).sort().forEach(month => {
          const monthDetails = document.createElement("details");
          monthDetails.classList.add("note-block");

          const monthSummary = document.createElement("summary");
          monthSummary.innerHTML = `<span class="arrow-icon"></span>${month}月`;
          monthDetails.appendChild(monthSummary);

          const weeks = months[month];
          Object.keys(weeks).sort().reverse().forEach(week => {
            const weekDetails = document.createElement("details");
            weekDetails.classList.add("race-block");

            const weekSummary = document.createElement("summary");
            weekSummary.innerHTML = `<span class="arrow-icon"></span>${week} の重賞`;
            weekDetails.appendChild(weekSummary);

            weeks[week].forEach(race => {
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

          yearDetails.appendChild(monthDetails);
        });

        container.appendChild(yearDetails);
      });

      console.log("✅ 過去重賞レース表示完了:", pastRaces.length, "件");
    })
    .catch(err => {
      console.error("❌ 過去重賞データ取得エラー:", err);
      const fallback = document.getElementById("past-race-container");
      if (fallback) {
        fallback.innerHTML = `<p style="color:red;">過去レース情報を読み込めませんでした。</p>`;
      }
    });
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("data/race_schedule_2026.json?v=20250706")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("past-race-container");
      container.innerHTML = "";

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

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

        // ★ 最新年度だけデフォルトで開く
        if (year === latestYear) {
          yearDetails.open = true;
        }

        const yearSummary = document.createElement("summary");
        yearSummary.innerHTML = `<span class="arrow-icon"></span>${year}年`;
        yearDetails.appendChild(yearSummary);

        // ★ 月は昇順
        Object.keys(years[year]).sort().forEach(month => {
          const monthDetails = document.createElement("details");
          monthDetails.classList.add("note-block");

          const monthSummary = document.createElement("summary");
          monthSummary.innerHTML = `<span class="arrow-icon"></span>${month}月`;
          monthDetails.appendChild(monthSummary);

          // ★ 週は降順（最新週が上）
          Object.keys(years[year][month]).sort().reverse().forEach(week => {
            const weekDetails = document.createElement("details");
            weekDetails.classList.add("race-block");

            const weekSummary = document.createElement("summary");
            week
    
    
    
    
document.addEventListener("DOMContentLoaded", () => {
  fetch("data/race_schedule_2025.json?v=20250706")
    .then(response => {
      if (!response.ok) throw new Error("JSON読み込み失敗");
      return response.json();
    })
    .then(data => {
      const container = document.getElementById("race-block-container");
      container.innerHTML = ""; // 既存クリア

      const today = new Date();

      // 今週の月曜～日曜を定義
      const firstDay = new Date(today);
      firstDay.setDate(today.getDate() - today.getDay() + 1); // 月曜
      firstDay.setHours(0, 0, 0, 0);

      const lastDay = new Date(firstDay);
      lastDay.setDate(firstDay.getDate() + 6); // 日曜
      lastDay.setHours(23, 59, 59, 999);

      // 今週のレースのみ抽出
      const thisWeekRaces = data.races.filter(race => {
        const raceDate = new Date(race.date);
        return raceDate >= firstDay && raceDate <= lastDay;
      });

      if (thisWeekRaces.length === 0) {
        container.innerHTML = `<p>今週の重賞レースは登録されていません。</p>`;
        return;
      }

      // 表示構築
      thisWeekRaces.forEach(race => {
        const details = document.createElement("details");
        details.classList.add("race-block");

        const summary = document.createElement("summary");
        summary.innerHTML = `
          <span class="arrow-icon"></span>
          【<span class="${race.grade.toLowerCase()}">${race.grade}</span>】${race.name}（${race.venue}）
        `;
        details.appendChild(summary);

        const preview = document.createElement("p");
        preview.innerHTML = `<a href="${race.preview}">▶ 展開予想を見る</a>`;
        details.appendChild(preview);

        const review = document.createElement("p");
        review.innerHTML = `<a href="${race.review}">▶ レース回顧を見る</a>`;
        details.appendChild(review);

        container.appendChild(details);
      });
    })
    .catch(err => {
      console.error("重賞データ取得エラー:", err);
      const fallback = document.getElementById("race-block-container");
      if (fallback) {
        fallback.innerHTML = `<p style="color: red;">今週の重賞レース情報を読み込めませんでした。</p>`;
      }
    });
});

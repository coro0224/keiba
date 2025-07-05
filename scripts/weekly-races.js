document.addEventListener("DOMContentLoaded", () => {
  fetch("data/race_schedule_2025.json?v=20250706")
    .then(response => {
      if (!response.ok) throw new Error("JSON読み込み失敗");
      return response.json();
    })
    .then(data => {
      const container = document.getElementById("race-block-container");
      container.innerHTML = "";

      const today = new Date();
      const dow = today.getDay(); // 0=日, 1=月...6=土

      const firstDay = new Date(today);
      firstDay.setDate(today.getDate() - dow + 1); // 月曜
      firstDay.setHours(0, 0, 0, 0);

      const lastDay = new Date(firstDay);
      lastDay.setDate(firstDay.getDate() + 6); // 日曜
      lastDay.setHours(23, 59, 59, 999);

      const thisWeekRaces = data.races.filter(race => {
        const raceDate = new Date(race.date);
        return raceDate >= firstDay && raceDate <= lastDay;
      });

      if (thisWeekRaces.length === 0) {
        container.innerHTML = `<p>今週の重賞レースは登録されていません。</p>`;
        return;
      }

      thisWeekRaces.forEach(race => {
        const details = document.createElement("details");
        details.classList.add("race-block");

        const summary = document.createElement("summary");
        summary.innerHTML = `
          <span class="arrow-icon"></span>
          【<span class="${race.grade.toLowerCase()}">${race.grade}</span>】
          ${race.name}（${race.venue}）
        `;
        details.appendChild(summary);

        // 🔁 曜日による表示切替
        let contentHTML = "";

        if (dow >= 1 && dow <= 4) {
          // 月〜木：見どころ
          contentHTML += `<p><a href="${race.preview}">▶ レースの見どころを見る</a></p>`;
        } else {
          // 金・土・日：展開予想（馬番入り）
          contentHTML += `<p><a href="${race.preview}">▶ 展開予想（馬番号付き）を見る</a></p>`;
        }

        // ✅ レース回顧は常時表示
        contentHTML += `<p><a href="${race.review}">▶ レース回顧を見る</a></p>`;

        details.innerHTML += contentHTML;
        container.appendChild(details);
      });
    })
    .catch(err => {
      console.error("重賞データ取得エラー:", err);
      const fallback = document.getElementById("race-block-container");
      if (fallback) {
        fallback.innerHTML = `<p style="color:red;">今週の重賞レース情報を読み込めませんでした。</p>`;
      }
    });
});

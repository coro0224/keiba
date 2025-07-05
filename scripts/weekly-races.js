document.addEventListener("DOMContentLoaded", () => {
  fetch("data/race_schedule_2025.json?v=20250706")
    .then(response => {
      if (!response.ok) throw new Error("JSON読み込み失敗");
      return response.json();
    })
    .then(data => {
      const container = document.getElementById("race-block-container");
      container.innerHTML = "";

      data.races.forEach(race => {
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
      document.getElementById("race-block-container").innerHTML = `
        <p style="color: red;">今週の重賞レース情報を読み込めませんでした。</p>
      `;
    });
});

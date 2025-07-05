<script>
document.addEventListener("DOMContentLoaded", () => {
  fetch("data/race_schedule_2025.json?v=20250706")
    .then(res => res.json())
    .then(data => {
      const today = new Date();
      const pastRaces = data.races.filter(r => new Date(r.date) < today);

      const months = {};
      pastRaces.forEach(race => {
        const dateObj = new Date(race.date);
        const month = `${dateObj.getMonth() + 1}`.padStart(2, "0");
        const day = `${dateObj.getDate()}`.padStart(2, "0");
        const key = `${month}`;

        if (!months[key]) months[key] = {};
        const weekKey = `${month}/${day}`;
        if (!months[key][weekKey]) months[key][weekKey] = [];
        months[key][weekKey].push(race);
      });

      const container = document.getElementById("past-race-container");
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
              <a href="${race.review}">? レース回顧を見る</a>
            `;
            weekDetails.appendChild(raceItem);
          });

          monthDetails.appendChild(weekDetails);
        });

        container.appendChild(monthDetails);
      });
    })
    .catch(err => {
      console.error("過去重賞データ取得エラー:", err);
      document.getElementById("past-race-container").innerHTML = `<p style="color:red;">過去レース情報を読み込めませんでした。</p>`;
    });
});
</script>

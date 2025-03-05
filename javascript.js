const races = [
  {
    date: "2月23日",
    name: "フェブラリーステークス",
    venue: "東京",
    distance: "ダート 1,600m",
    image: "path/to/february-stakes.jpg",
    review: "2024年のフェブラリーステークスは感動的なレースでした。"
  },
  {
    date: "3月30日",
    name: "高松宮記念",
    venue: "中京",
    distance: "芝 1,200m",
    image: "path/to/takamatsunomiya-kinen.jpg",
    review: "2024年の高松宮記念はスリリングなスプリント戦でした。"
  }
  // 他のレースデータをここに追加
];

const raceSchedule = document.getElementById("race-schedule");
const raceInfo = document.getElementById("race-info");
const raceTitle = document.getElementById("race-title");
const raceImage = document.getElementById("race-image");
const raceReview = document.getElementById("race-review");

races.forEach(race => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${race.date}</td>
    <td class="race-name">${race.name}</td>
    <td>${race.venue}</td>
    <td>${race.distance}</td>
  `;
  raceSchedule.appendChild(row);

  row.querySelector(".race-name").addEventListener("click", () => {
    raceTitle.innerText = race.name;
    raceImage.src = race.image;
    raceReview.innerText = race.review;
    raceInfo.classList.remove("hidden");
  });
});

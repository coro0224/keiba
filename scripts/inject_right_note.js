// 自動注入：右カラムNOTE一覧
function injectNoteLinks(raceList) {
  const today = new Date();
  const weeklyContainer = document.getElementById("note-weekly");
  const monthlyRoot = document.getElementById("note-monthly-root"); // ← 過去NOTE格納先

  raceList.forEach(race => {
    if (!race.note_url) return;

    const raceDate = new Date(race.date);
    const isThisWeek = raceDate >= today && raceDate - today < 7 * 86400000;

    const noteLink = document.createElement("li");
    noteLink.innerHTML = `<a href="${race.note_url}" target="_blank">▶ ${race.title}の買い目</a>`;

    if (isThisWeek) {
      weeklyContainer?.appendChild(noteLink);
    } else {
      const month = raceDate.getMonth() + 1;
      const day = raceDate.getDate();
      const monthId = `note-month-${month}`;
      const weekId = `note-week-${month}-${day}`;

      // 月Container
      let monthContainer = document.getElementById(monthId);
      if (!monthContainer) {
        monthContainer = document.createElement("details");
        monthContainer.id = monthId;
        monthContainer.className = "rightnote-sub";
        monthContainer.innerHTML = `<summary><span class="arrow-icon"></span>${month}月</summary>`;
        monthlyRoot?.appendChild(monthContainer);
      }

      // 週Container
      let weekContainer = document.getElementById(weekId);
      if (!weekContainer) {
        weekContainer = document.createElement("details");
        weekContainer.id = weekId;
        weekContainer.className = "rightnote-sub";
        weekContainer.innerHTML = `<summary><span class="arrow-icon"></span>${month}/${day}</summary>`;
        monthContainer.appendChild(weekContainer);
      }

      // 買い目リンク追加
      const ul = weekContainer.querySelector("ul") || document.createElement("ul");
      ul.appendChild(noteLink);
      if (!weekContainer.querySelector("ul")) weekContainer.appendChild(ul);
    }
  });
}

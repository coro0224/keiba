function injectNoteLinks(raceList) {
  const today = new Date();
  const weeklyContainer = document.getElementById("note-weekly");
  const monthlyRoot = document.getElementById("note-monthly-root");

  raceList.forEach(race => {
    if (!race.note_url || race.note_url.trim() === "") return;

    const raceDate = new Date(race.date);
    const isThisWeek = raceDate >= today && raceDate - today < 7 * 86400000;

    // 買い目リンクの生成（ラベルは固定＋レース名変動）
    const noteLink = document.createElement("li");
    noteLink.innerHTML = `<a href="${race.note_url}" target="_blank">▶ ${race.name}の買い目</a>`;

    if (isThisWeek) {
      // 今週表示欄への注入
      const ul = weeklyContainer.querySelector("ul") || document.createElement("ul");
      ul.appendChild(noteLink);
      if (!weeklyContainer.querySelector("ul")) weeklyContainer.appendChild(ul);
    } else {
      // 過去レース → 月別 → 日付別 → 買い目リンクの階層表示
      const month = raceDate.getMonth() + 1;
      const day = raceDate.getDate();
      const monthId = `note-month-${month}`;
      const weekId = `note-week-${month}-${day}`;

      let monthContainer = document.getElementById(monthId);
      if (!monthContainer) {
        monthContainer = document.createElement("details");
        monthContainer.id = monthId;
        monthContainer.className = "rightnote-sub";
        monthContainer.innerHTML = `<summary><span class="arrow-icon"></span>${month}月</summary>`;
        monthlyRoot.appendChild(monthContainer);
      }

      let weekContainer = document.getElementById(weekId);
      if (!weekContainer) {
        weekContainer = document.createElement("details");
        weekContainer.id = weekId;
        weekContainer.className = "rightnote-sub";
        weekContainer.innerHTML = `<summary><span class="arrow-icon"></span>${month}/${day}</summary>`;
        monthContainer.appendChild(weekContainer);
      }

      const ul = weekContainer.querySelector("ul") || document.createElement("ul");
      ul.appendChild(noteLink);
      if (!weekContainer.querySelector("ul")) weekContainer.appendChild(ul);
    }
  });
}

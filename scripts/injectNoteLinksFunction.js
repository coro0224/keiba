function injectNoteLinks(raceList) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 月曜始まり・日曜終わりの週定義
  const dayOfWeek = today.getDay(); // 0:日, 1:月, ..., 6:土
  const mondayStart = new Date(today);
  const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  mondayStart.setDate(today.getDate() + offsetToMonday);
  mondayStart.setHours(0, 0, 0, 0);

  const sundayEnd = new Date(mondayStart);
  sundayEnd.setDate(mondayStart.getDate() + 6);
  sundayEnd.setHours(23, 59, 59, 999);

  const weeklyContainer = document.getElementById("note-weekly");
  const monthlyRoot = document.getElementById("note-monthly-root");

  raceList.forEach(race => {
    if (!race.note_url || race.note_url.trim() === "") return;

    const raceDate = new Date(race.date);
    raceDate.setHours(0, 0, 0, 0);

    const isThisWeek = raceDate >= mondayStart && raceDate <= sundayEnd;

    const noteLink = document.createElement("li");
    noteLink.innerHTML = `<a href="${race.note_url}" target="_blank">▶ ${race.name}の買い目</a>`;

    if (isThisWeek) {
      const ul = weeklyContainer.querySelector("ul") || document.createElement("ul");
      ul.appendChild(noteLink);
      if (!weeklyContainer.querySelector("ul")) weeklyContainer.appendChild(ul);
    } else {
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

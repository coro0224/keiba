function injectNoteLinks(raceList) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 時刻を揃える

  // ✅ 日曜〜土曜の週を定義（日本文化に合わせる）
  const dayOfWeek = today.getDay(); // 0:日曜, 1:月曜, ..., 6:土曜
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek); // 今週の日曜
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6); // 今週の土曜

  const weeklyContainer = document.getElementById("note-weekly");
  const monthlyRoot = document.getElementById("note-monthly-root");

  raceList.forEach(race => {
    if (!race.note_url || race.note_url.trim() === "") return;

    const raceDate = new Date(race.date);
    raceDate.setHours(0, 0, 0, 0); // 日付比較の精度を揃える

    const isThisWeek = raceDate >= sunday && raceDate <= saturday;

    const noteLink = document.createElement("li");
    noteLink.innerHTML = `<a href="${race.note_url}" target="_blank">▶ ${race.name}の買い目</a>`;

    if (isThisWeek) {
      // ✅ 今週のNOTE差し込み
      const ul = weeklyContainer.querySelector("ul") || document.createElement("ul");
      ul.appendChild(noteLink);
      if (!weeklyContainer.querySelector("ul")) weeklyContainer.appendChild(ul);
    } else {
      // ✅ 過去NOTE差し込み（階層化）
      const month = raceDate.getMonth() + 1;
      const day = raceDate.getDate();
      const monthId = `note-month-${month}`;
      const weekId = `note-week-${month}-${day}`;

      // 月コンテナ
      let monthContainer = document.getElementById(monthId);
      if (!monthContainer) {
        monthContainer = document.createElement("details");
        monthContainer.id = monthId;
        monthContainer.className = "rightnote-sub";
        monthContainer.innerHTML = `<summary><span class="arrow-icon"></span>${month}月</summary>`;
        monthlyRoot.appendChild(monthContainer);
      }

      // 週コンテナ
      let weekContainer = document.getElementById(weekId);
      if (!weekContainer) {
        weekContainer = document.createElement("details");
        weekContainer.id = weekId;
        weekContainer.className = "rightnote-sub";
        weekContainer.innerHTML = `<summary><span class="arrow-icon"></span>${month}/${day}</summary>`;
        monthContainer.appendChild(weekContainer);
      }

      // 買い目リンク差し込み
      const ul = weekContainer.querySelector("ul") || document.createElement("ul");
      ul.appendChild(noteLink);
      if (!weekContainer.querySelector("ul")) weekContainer.appendChild(ul);
    }
  });
}

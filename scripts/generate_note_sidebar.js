document.addEventListener("DOMContentLoaded", () => {
  fetch("data/note_articles.json")
    .then(res => res.json())
    .then(data => {
      const container = document.querySelector(".note-summary");
      if (!container) return;

      const notesByMonth = {};

      data.forEach(note => {
        const month = note.date.slice(5, 7); // "07"
        if (!notesByMonth[month]) notesByMonth[month] = [];
        notesByMonth[month].push(note);
      });

      Object.keys(notesByMonth).sort().forEach(month => {
        const monthBlock = document.createElement("details");
        monthBlock.classList.add("note-block");
        monthBlock.innerHTML = `<summary><span class="arrow-icon"></span>${Number(month)}月</summary>`;

        notesByMonth[month].sort((a, b) => b.date.localeCompare(a.date)).forEach(note => {
          const entry = document.createElement("p");
          entry.innerHTML = `
            ${note.date} ${note.race_name}<br>
            <a href="${note.url}" target="_blank">▶ ${note.title}</a>
          `;
          monthBlock.appendChild(entry);
        });

        container.appendChild(monthBlock);
      });
    });

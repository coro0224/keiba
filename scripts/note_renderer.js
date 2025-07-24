// note_renderer.js（右カラムNOTE表示用）

fetch("data/race_schedule_2025.json")
  .then(res => res.json())
  .then(json => {
    const raceList = json.races;
    injectNoteLinks(raceList); // ✅ injectNoteLinks()は事前に定義済み関数
  });

// ✅ injectNoteLinks()（表示用関数は別JSまたはHTML内に含める）

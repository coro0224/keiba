document.addEventListener("DOMContentLoaded", () => {
  fetch("data/race_schedule_2025.json?v=20250706")
    .then(response => {
      if (!response.ok) throw new Error("JSON読み込み失敗");
      return response.json();
    })
    .then(data => {
      const container = document.getElementById("race-block-container");
      container.innerHTML = "";

      // 🇯🇵 JSTで今日00:00を取得
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // 📅 今週の月曜〜日曜を計算（JST）
      const dow = today.getDay(); // 0(日)〜6(土)
      const monday = new Date(today);
      monday.setDate(today.getDate() - ((dow + 6) % 7)); // 月曜
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6); // 日曜

      // 🔎 'YYYY-MM-DD[T...]' を JSTの Date に変換
      const parseDate = (str) => {
        const datePart = str.includes("T") ? str.split("T")[0] : str;
        const [yyyy, mm, dd] = datePart.split("-").map(Number);
        return new Date(yyyy, mm - 1, dd);
      };

      // 🎯 今週のレース抽出
      const thisWeekRaces = data.races.filter(race => {
        const raceDate = parseDate(race.date);
        return raceDate >= monday && raceDate <= sunday;
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

		  // 🔁 常に3リンクを出力（見どころ・展開予想・回顧）
		  let contentHTML = "";

			const createLink = (label, url) => {
			  if (url && typeof url === "string" && !url.includes("undefined")) {
			    return `<p><a href="${url}">▶ ${label}</a></p>`;
			  } else {
			    return `<p>▶ ${label}：<span style="color:#888;">後日記載予定</span></p>`;
			  }
			};

			contentHTML += createLink("見どころを見る", race.sections?.highlight);
			contentHTML += createLink("展開予想（馬番号付き）を見る", race.sections?.preview);
			contentHTML += createLink("レース回顧を見る", race.sections?.review);


		  details.innerHTML += contentHTML;
		  container.appendChild(details);
		});


      // 🧭 デバッグログ（JST）
      console.log("today(JST):", today.toLocaleDateString("ja-JP"));
      console.log("monday:", monday.toLocaleDateString("ja-JP"));
      console.log("sunday:", sunday.toLocaleDateString("ja-JP"));
    })
    .catch(err => {
      console.error("重賞データ取得エラー:", err);
      const fallback = document.getElementById("race-block-container");
      if (fallback) {
        fallback.innerHTML = `<p style="color:red;">今週の重賞レース情報を読み込めませんでした。</p>`;
      }
    });
});


document.addEventListener("DOMContentLoaded", () => {
  const g1Data = [
    { date: "2026-02-22", name: "フェブラリーステークス（東京・ダ1600m）", id: "20260222_february_stakes" },
    { date: "2026-03-29", name: "高松宮記念（中京・芝1200m）", id: "20260329_takamatsunomiya_kinen" },
    { date: "2026-04-05", name: "大阪杯（阪神・芝2000m）", id: "20260405_osaka_hai" },
    { date: "2026-04-12", name: "桜花賞（阪神・芝1600m）", id: "20260412_oak_sho" },
    { date: "2026-04-18", name: "中山グランドジャンプ（中山・障4260m）", id: "20260418_nakayama_grand_jump" },
    { date: "2026-04-19", name: "皐月賞（中山・芝2000m）", id: "20260419_satsuki_sho" },
    { date: "2026-05-03", name: "天皇賞（春）（京都・芝3200m）", id: "20260503_tennosho_spring" },
    { date: "2026-05-10", name: "NHKマイルカップ（東京・芝1600m）", id: "20260510_nhk_mile" },
    { date: "2026-05-17", name: "ヴィクトリアマイル（東京・芝1600m）", id: "20260517_victoria_mile" },
    { date: "2026-05-24", name: "オークス（東京・芝2400m）", id: "20260524_oaks" },
    { date: "2026-05-31", name: "日本ダービー（東京・芝2400m）", id: "20260531_derby" },
    { date: "2026-06-07", name: "安田記念（東京・芝1600m）", id: "20260607_yasuda_kinen" },
    { date: "2026-06-14", name: "宝塚記念（阪神・芝2200m）", id: "20260614_takarazuka_kinen" },
    { date: "2026-09-27", name: "スプリンターズステークス（中山・芝1200m）", id: "20260927_sprinters" },
    { date: "2026-10-18", name: "秋華賞（京都・芝2000m）", id: "20261018_shuka_sho" },
    { date: "2026-10-25", name: "菊花賞（京都・芝3000m）", id: "20261025_kikka_sho" },
    { date: "2026-11-01", name: "天皇賞（秋）（東京・芝2000m）", id: "20261101_tenno_autumn" },
    { date: "2026-11-15", name: "エリザベス女王杯（京都・芝2200m）", id: "20261115_elizabeth" },
    { date: "2026-11-22", name: "マイルチャンピオンシップ（京都・芝1600m）", id: "20261122_milecs" },
    { date: "2026-11-29", name: "ジャパンカップ（東京・芝2400m）", id: "20261129_japan_cup" },
    { date: "2026-12-08", name: "チャンピオンズカップ（中京・ダ1800m）", id: "20261208_champions_cup" },
    { date: "2026-12-15", name: "朝日杯フューチュリティステークス（阪神・芝1600m）", id: "20261215_asahi_hai" },
    { date: "2026-12-22", name: "阪神ジュベナイルフィリーズ（阪神・芝1600m）", id: "20261222_juvenile_fillies" },
    { date: "2026-12-27", name: "有馬記念（中山・芝2500m）", id: "20261227_arima" },
    { date: "2026-12-28", name: "ホープフルステークス（中山・芝2000m）", id: "20261228_hopeful" }
  ];

  const container = document.getElementById("g1-schedule-container");
  if (!container) return;

  container.innerHTML = "";

  const years = {};

  g1Data.forEach(item => {
    const [yyyy, mm, dd] = item.date.split("-").map(Number);
    const year = `${yyyy}`;
    const month = `${mm}`.padStart(2, "0");
    const day = `${mm}/${dd}`;

    if (!years[year]) years[year] = {};
    if (!years[year][month]) years[year][month] = {};
    if (!years[year][month][day]) years[year][month][day] = [];

    years[year][month][day].push(item);
  });

  Object.keys(years).sort().reverse().forEach(year => {
    const yearDetails = document.createElement("details");
    yearDetails.classList.add("note-block");
    yearDetails.open = true;

    const yearSummary = document.createElement("summary");
    yearSummary.innerHTML = `<span class="arrow-icon"></span>${year}年`;
    yearDetails.appendChild(yearSummary);

    Object.keys(years[year]).sort().forEach(month => {
      const monthDetails = document.createElement("details");
      monthDetails.classList.add("note-block");

      const monthSummary = document.createElement("summary");
      monthSummary.innerHTML = `<span class="arrow-icon"></span>${month}月`;
      monthDetails.appendChild(monthSummary);

      Object.keys(years[year][month]).sort().reverse().forEach(day => {
        const dayDetails = document.createElement("details");
        dayDetails.classList.add("race-block");

        const daySummary = document.createElement("summary");
        daySummary.innerHTML = `<span class="arrow-icon"></span>${day} のGⅠ`;
        dayDetails.appendChild(daySummary);

        years[year][month][day].forEach(item => {
          const raceItem = document.createElement("p");
          raceItem.innerHTML = `
            🏆 ${item.name}<br>
            <a href="output/${item.id}.html">▶ レース詳細ページへ</a>
          `;
          dayDetails.appendChild(raceItem);
        });

        monthDetails.appendChild(dayDetails);
      });

      yearDetails.appendChild(monthDetails);
    });

    container.appendChild(yearDetails);
  });

  console.log("✅ GⅠスケジュール表示完了:", g1Data.length, "件");
});

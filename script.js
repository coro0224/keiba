document.getElementById("load-data").addEventListener("click", loadPredictionData);

function loadPredictionData() {
  const raceName = document.getElementById("race-name").value.trim();
  const tableBody = document.querySelector("#prediction-table tbody");
  const errorMessage = document.getElementById("error-message");

  // スポーツ新聞の予想データ
  const raceData = {
    "フェブラリーステークス": [
      {
        newspaper: "スポニチ",
        main: "エンペラーワケア",
        rival: "ミッキーファイト",
        underdog: "コスタノヴァ",
        outsider: "サンライズジパング"
      },
      {
        newspaper: "日刊スポーツ",
        main: "ミッキーファイト",
        rival: "エンペラーワケア",
        underdog: "ペプチドナイル",
        outsider: "コスタノヴァ"
      },
      {
        newspaper: "スポーツ報知",
        main: "コスタノヴァ",
        rival: "サンライズジパング",
        underdog: "エンペラーワケア",
        outsider: "ミッキーファイト"
      },
      {
        newspaper: "サンスポ",
        main: "ペプチドナイル",
        rival: "コスタノヴァ",
        underdog: "ミッキーファイト",
        outsider: "エンペラーワケア"
      }
    ],
    // 他のレース名とそのデータを追加可能
  };

  // レース名に該当するデータを取得
  const predictions = raceData[raceName];

  if (predictions) {
    // テーブルをクリア
    tableBody.innerHTML = "";

    // データをテーブルに挿入
    predictions.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.newspaper}</td>
        <td>◎ ${row.main}</td>
        <td>〇 ${row.rival}</td>
        <td>△ ${row.underdog}</td>
        <td>▲ ${row.outsider}</td>
      `;
      tableBody.appendChild(tr);
    });

    // エラーを非表示
    errorMessage.classList.add("hidden");
  } else {
    // エラーメッセージを表示
    tableBody.innerHTML = "";
    errorMessage.classList.remove("hidden");
  }
}

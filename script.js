document.getElementById("load-data").addEventListener("click", loadPredictionData);

function loadPredictionData() {
  // データのサンプル。実際はAPIやファイルから取得可能
  const data = [
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
  ];

  const tableBody = document.querySelector("#prediction-table tbody");
  tableBody.innerHTML = ""; // テーブルをクリア

  data.forEach(row => {
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
}

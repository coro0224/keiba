document.getElementById("load-data").addEventListener("click", loadPredictionData);

async function loadPredictionData() {
  const raceName = document.getElementById("race-name").value.trim();
  const tableBody = document.querySelector("#prediction-table tbody");
  const errorMessage = document.getElementById("error-message");

  // 入力がない場合はエラーを表示
  if (!raceName) {
    errorMessage.textContent = "レース名を入力してください。";
    errorMessage.classList.remove("hidden");
    return;
  }

  // API呼び出しの例
  const apiUrl = `https://example.com/api/predictions?race=${encodeURIComponent(raceName)}`;

  try {
    // データを取得
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("データを取得できませんでした。");
    }

    const data = await response.json();

    // テーブルをクリア
    tableBody.innerHTML = "";

    // データをテーブルに挿入
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

    // エラーを非表示
    errorMessage.classList.add("hidden");
  } catch (error) {
    console.error(error);
    errorMessage.textContent = "データを取得できませんでした。再試行してください。";
    errorMessage.classList.remove("hidden");
  }
}

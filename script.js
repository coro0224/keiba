<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>競馬予想一覧</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>競馬予想一覧</h1>
  <button id="load-data">データ読み込み</button>
  <table id="prediction-table">
    <thead>
      <tr>
        <th>新聞社</th>
        <th>本命 (◎)</th>
        <th>対抗 (〇)</th>
        <th>連下 (△)</th>
        <th>単穴 (▲)</th>
      </tr>
    </thead>
    <tbody>
      <!-- データが動的に挿入されます -->
    </tbody>
  </table>
  <script src="script.js"></script>
</body>
</html>

const horses = document.querySelectorAll('.horse');
const commentary = document.getElementById('commentary');
const startButton = document.getElementById('start-race');

// トラックの設定
const centerX = 400;
const centerY = 200; // 半楕円トラックの中心
const radiusX = 350; // 横幅の半径
const radiusY = 150; // 縦幅の半径

// 初期配置（右上のスタート位置からスタート）
horses.forEach((horse, index) => {
  const startX = centerX + radiusX - 50 * index; // 馬を横一列に配置
  const startY = centerY - radiusY; // 右上スタート位置
  horse.style.left = `${startX}px`;
  horse.style.top = `${startY}px`;
});

// 実況コメントを更新
function updateCommentary(stage) {
  if (stage === 'start') {
    commentary.textContent =
      'レース前半：スタートしました！各馬が一斉に飛び出しました。内枠から①「エンペラーワケア」が先頭に立ちました。';
  } else if (stage === 'middle') {
    commentary.textContent =
      'レース中盤：コーナーを回り、⑨「コスタノヴァ」と①「エンペラーワケア」の一騎打ちが続いています！';
  } else if (stage === 'end') {
    commentary.textContent =
      'レース終盤：最後の直線、⑮「ペプチドナイル」が怒涛の末脚で追い上げています！';
  } else if (stage === 'finish') {
    commentary.textContent = 'ゴール！勝者が確定しました！';
  }
}

// レースのアニメーション
function startRace() {
  let progress = 0;

  function moveHorses() {
    progress += 0.001; // 超スロー
    horses.forEach((horse, index) => {
      const angle = Math.PI * progress + (index * Math.PI) / 10; // 微調整
      const x = centerX + radiusX * Math.cos(angle);
      const y = centerY + radiusY * Math.sin(angle); // 楕円トラックを走る
      horse.style.left = `${x}px`;
      horse.style.top = `${y}px`;
    });

    if (progress < 0.33) {
      updateCommentary('start');
    } else if (progress < 0.66) {
      updateCommentary('middle');
    } else if (progress < 1) {
      updateCommentary('end');
    } else {
      updateCommentary('finish');
      return;
    }

    requestAnimationFrame(moveHorses);
  }

  moveHorses();
}

startButton.addEventListener('click', startRace);

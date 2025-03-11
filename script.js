const horses = document.querySelectorAll('.horse');
const commentary = document.getElementById('commentary');
const startButton = document.getElementById('start-race');

// 楕円トラックの中心と半径
const centerX = 400;
const centerY = 200;
const radiusX = 300;
const radiusY = 150;

// 初期配置（右上から横一列でスタート）
horses.forEach((horse, index) => {
  const startX = centerX + 50 * (index - 4.5); // 馬番号を横一列に配置
  const startY = centerY - radiusY - 30; // トラック右上
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
      'レース中盤：1コーナーから向正面に入り、⑨「コスタノヴァ」と①「エンペラーワケア」の一騎打ちが続いています！';
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
    progress += 0.002; // 超スロー
    horses.forEach((horse, index) => {
      const angle = Math.PI * 2 * (progress + index / 10); // 馬ごとに微妙なズレ
      const x = centerX + radiusX * Math.cos(angle);
      const y = centerY + radiusY * Math.sin(angle);
      horse.style.left = `${x}px`;
      horse.style.top = `${y}px`;
    });

    // 実況ステージを切り替え
    if (progress < 0.33) {
      updateCommentary('start');
    } else if (progress < 0.66) {
      updateCommentary('middle');
    } else if (progress < 1) {
      updateCommentary('end');
    } else {
      updateCommentary('finish');
      return; // アニメーション終了
    }

    requestAnimationFrame(moveHorses);
  }

  moveHorses();
}

startButton.addEventListener('click', startRace);

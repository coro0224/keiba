const horses = document.querySelectorAll('.horse');
const commentary = document.getElementById('commentary');
const startButton = document.getElementById('start-race');

// 半円トラックの中心と半径
const centerX = 300;
const centerY = 300; // 高さを考慮してスタート位置を調整
const radiusX = 300;
const radiusY = 200;

// 初期配置（左上「S」からスタート）
horses.forEach((horse, index) => {
  const startX = centerX - radiusX + index * 30; // 馬番号を横一列に配置
  const startY = centerY - radiusY; // トラックの左上
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
      const angle = Math.PI * progress + (index * Math.PI) / 12; // 各馬にわずかなズレを加える
      const x = centerX + radiusX * Math.cos(angle);
      const y = centerY - radiusY * Math.sin(angle); // 半円弧に沿って移動
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

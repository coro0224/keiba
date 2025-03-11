const horses = document.querySelectorAll('.horse');
const commentary = document.getElementById('commentary');
const startButton = document.getElementById('start-race');

// トラックの中心と半径（楕円）
const centerX = 400; // 中心X座標
const centerY = 200; // 中心Y座標
const radiusX = 300; // 横の半径
const radiusY = 150; // 縦の半径

// 初期配置（右上からスタート）
horses.forEach((horse, index) => {
  const startX = centerX + 50 * (index - 7.5); // 馬番号を横一列に並べる
  const startY = centerY - radiusY - 50; // トラックの右上位置
  horse.style.left = `${startX}px`;
  horse.style.top = `${startY}px`;
});

function updateCommentary(stage) {
  if (stage === "start") {
    commentary.textContent = "レース前半：スタートしました！各馬が一斉に飛び出しました。";
  } else if (stage === "middle") {
    commentary.textContent = "レース中盤：コーナーを回り、激しい先頭争いが続いています。";
  } else if (stage === "end") {
    commentary.textContent = "レース終盤：最後の直線、各馬が全力でゴールを目指しています！";
  } else if (stage === "finish") {
    commentary.textContent = "ゴール！勝者が確定しました。";
  }
}

function startRace() {
  let progress = 0;

  function moveHorses() {
    progress += 0.01;

    horses.forEach((horse, index) => {
      const angle = (Math.PI * 2 * progress) / 3 + (index * Math.PI) / 12; // 馬の動きに微妙なズレを加える
      const x = centerX + radiusX * Math.cos(angle);
      const y = centerY + radiusY * Math.sin(angle);
      horse.style.left = `${x}px`;
      horse.style.top = `${y}px`;
    });

    if (progress < 1) {
      if (progress < 0.33) {
        updateCommentary("start");
      } else if (progress < 0.66) {
        updateCommentary("middle");
      } else {
        updateCommentary("end");
      }
      requestAnimationFrame(moveHorses);
    } else {
      updateCommentary("finish");
    }
  }

  moveHorses();
}

startButton.addEventListener('click', startRace);

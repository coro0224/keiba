const horses = document.querySelectorAll(".horse");
const startButton = document.getElementById("start-animation");

// 馬の位置データ (1コーナー、2-3コーナー、ゴール位置)
const positions = {
  corner1: [10, 60, 110, 160, 210],
  corner2: [150, 200, 250, 300, 350],
  finalStretch: [300, 350, 400, 450, 500],
};

// アニメーション用関数
function animatePositions(corner, duration) {
  return new Promise((resolve) => {
    horses.forEach((horse, index) => {
      horse.style.transition = `transform ${duration}s linear`;
      horse.style.transform = `translateX(${corner[index]}px)`;
    });
    setTimeout(resolve, duration * 1000);
  });
}

// アニメーションの順次実行
async function startAnimation() {
  startButton.disabled = true;
  await animatePositions(positions.corner1, 3); // 1コーナーまで移動
  await animatePositions(positions.corner2, 3); // 2-3コーナーまで移動
  await animatePositions(positions.finalStretch, 3); // 最後の直線へ
  startButton.disabled = false;
}

// スタートボタンにイベントを設定
startButton.addEventListener("click", startAnimation);

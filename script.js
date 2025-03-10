const horses = document.querySelectorAll(".horse");
const startButton = document.getElementById("start-animation");

// 楕円のトラックの中心と半径を設定
const centerX = 300; // トラックの中心X座標
const centerY = 200; // トラックの中心Y座標
const radiusX = 250; // 楕円のX半径
const radiusY = 150; // 楕円のY半径

// 馬の数と初期位置
const horseCount = 18;
const angleStep = (2 * Math.PI) / horseCount;

// スタート時の馬の位置を設定
horses.forEach((horse, index) => {
  const angle = angleStep * index;
  const x = centerX + radiusX * Math.cos(angle);
  const y = centerY + radiusY * Math.sin(angle);
  horse.style.left = `${x}px`;
  horse.style.top = `${y}px`;
});

// アニメーション用関数
function animateHorses() {
  let angleOffset = 0;

  function updatePositions() {
    horses.forEach((horse, index) => {
      const angle = angleStep * index + angleOffset;
      const x = centerX + radiusX * Math.cos(angle);
      const y = centerY + radiusY * Math.sin(angle);
      horse.style.left = `${x}px`;
      horse.style.top = `${y}px`;
    });

    angleOffset -= 0.02; // 回転速度
    requestAnimationFrame(updatePositions);
  }

  updatePositions();
}

// スタートボタンにイベントを設定
startButton.addEventListener("click", animateHorses);

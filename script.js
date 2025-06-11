// スライダーの設定
const slider = document.querySelector('#image-slider .images');
let currentIndex = 0;

function slideImages() {
  currentIndex = (currentIndex + 1) % 5; // 画像が5枚でループ
  const offset = -currentIndex * 100; // 各画像の幅を計算
  slider.style.transform = `translateX(${offset}%)`;
}

// 10秒ごとに画像をスライド
setInterval(slideImages, 10000);

// メニューボタンの機能（後ほどページ遷移に対応可能）
document.querySelector('.menu-button').addEventListener('click', () => {
  alert('メニューボタンが押されました。ページ遷移機能は後ほど実装されます。');
});

// 必要に応じてページ遷移用のスクリプトを追加
document.querySelectorAll('.link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    alert('リンク先に遷移します（後で実装）。');
  });
});

// g1, g2, g3 回転アニメーションの設定
document.querySelectorAll('.g1, .g2, .g3').forEach(item => {
  item.style.animation = 'rotateY 5s linear infinite'; // Y軸回転アニメーションを適用
});


document.addEventListener("DOMContentLoaded", function () {
    const track = document.querySelector(".slider-track");
    const images = document.querySelectorAll(".slider-track img");

    let index = 0;
    const totalImages = images.length;
    const slideWidth = images[0].offsetWidth;

    function slide() {
        index++;
        if (index >= totalImages) {
            index = 0; // ループの動作を改善
        }
        track.style.transform = `translateX(-${index * slideWidth}px)`;
    }

    setInterval(slide, 3000); // 3秒ごとにスライド
});


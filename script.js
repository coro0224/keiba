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



document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("sliderTrack");
    const images = document.querySelectorAll(".note-image");
    const imageCount = images.length;

    // クローンを作って末尾に追加
    for (let i = 0; i < 2; i++) {
        const clone = images[i].cloneNode(true);
        track.appendChild(clone);
    }

    let index = 0;
    const moveNext = () => {
        index++;
        const imgWidth = images[0].offsetWidth + 10; // margin-right考慮
        track.style.transition = "transform 0.5s linear";
        track.style.transform = `translateX(-${imgWidth * index}px)`;

        if (index >= imageCount) {
            setTimeout(() => {
                track.style.transition = "none";
                track.style.transform = `translateX(0px)`;
                index = 0;
            }, 500); // transition時間に一致させる
        }
    };

    setInterval(moveNext, 3000); // 3秒ごとに切り替え
});

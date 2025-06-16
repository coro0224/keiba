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

    // 最初の2枚を複製して末尾に追加（ループ用）
    for (let i = 0; i < 2; i++) {
        const clone = images[i].cloneNode(true);
        track.appendChild(clone);
    }

    let index = 0;
    let slideWidth = images[0].offsetWidth + 10; // 画像幅＋マージン

    const moveNext = () => {
        index++;
        track.style.transition = "transform 0.5s linear";
        track.style.transform = `translateX(-${slideWidth * index}px)`;

        // 複製を含めた末尾に達した直後に戻す
        if (index === imageCount) {
            setTimeout(() => {
                track.style.transition = "none";
                track.style.transform = "translateX(0)";
                index = 0;
            }, 500); // transitionと同じ時間
        }
    };

    // 初回の画像ロードが終わったら幅を再取得（安全対策）
    window.addEventListener("load", () => {
        slideWidth = images[0].offsetWidth + 10;
        setInterval(moveNext, 3000);
    });
});

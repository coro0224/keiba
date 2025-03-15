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



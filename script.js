let currentIndex = 0;
const images = document.querySelectorAll('.slider-image');

function showNextImage() {
  images[currentIndex].classList.remove('active');
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].classList.add('active');
}

// 10秒ごとにスライド
setInterval(showNextImage, 10000);

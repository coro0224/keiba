const horses = document.querySelectorAll('.horse');
const startButton = document.getElementById('start-race');

// Racecourse dimensions
const centerX = 300; // Center X-coordinate of the track
const centerY = 200; // Center Y-coordinate of the track
const radiusX = 250; // Horizontal radius of the track
const radiusY = 150; // Vertical radius of the track

// Initialize horse positions
let angles = [];
horses.forEach((horse, index) => {
  const angle = (2 * Math.PI * index) / horses.length;
  angles.push(angle); // Store initial angles
  updateHorsePosition(horse, angle);
});

function updateHorsePosition(horse, angle) {
  const x = centerX + radiusX * Math.cos(angle);
  const y = centerY + radiusY * Math.sin(angle);
  horse.style.left = `${x}px`;
  horse.style.top = `${y}px`;
}

function startRace() {
  let progress = 0;

  function raceStep() {
    progress += 0.02; // Adjust speed
    horses.forEach((horse, index) => {
      angles[index] += 0.02; // Move each horse forward
      updateHorsePosition(horse, angles[index]);
    });

    // Stop race after a full lap
    if (progress < 2 * Math.PI) {
      requestAnimationFrame(raceStep);
    }
  }

  raceStep();
}

startButton.addEventListener('click', startRace);

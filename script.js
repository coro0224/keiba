// 各コーナーの馬の位置情報
const positions = {
  corner1: [15, 8, 12, 11, 10, 14, 9, 6, 13, 4, 5, 7, 3, 2, 1],
  corner2: [15, 8, 12, 11, 10, 14, 9, 6, 13, 4, 5, 7, 3, 2, 1],
  finalStretch: [15, 8, 12, 11, 10, 14, 9, 6, 13, 4, 5, 7, 3, 2, 1],
};

// 関数でデータを表示
function displayPositions(sectionId, data) {
  const section = document.getElementById(sectionId);
  data.forEach((position, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}: ${position}`;
    section.appendChild(li);
  });
}

// 各セクションにデータを挿入
displayPositions("corner-1", positions.corner1);
displayPositions("corner-2", positions.corner2);
displayPositions("final-stretch", positions.finalStretch);

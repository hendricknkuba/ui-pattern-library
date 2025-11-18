// -------------------------------
// Chart 6 JS File
// -------------------------------

console.log("chart6.js loaded");

const chart6Area = document.querySelector("#chart6 .chart-area");

if (chart6Area) {
  chart6Area.innerHTML = `
    <p style="font-size: 16px; color: #555; text-align:center;">
      Chart 6 ready for data
    </p>
  `;
} else {
  console.error("Chart 6 container not found!");
}

// -------------------------------
// Chart 7 JS File
// -------------------------------

console.log("chart7.js loaded");

const chart7Area = document.querySelector("#chart7 .chart-area");

if (chart7Area) {
  chart7Area.innerHTML = `
    <p style="font-size: 16px; color: #555; text-align:center;">
      Chart 7 ready for data
    </p>
  `;
} else {
  console.error("Chart 7 container not found!");
}

// -------------------------------
// Chart 5 JS File
// -------------------------------

console.log("chart5.js loaded");

const chart5Area = document.querySelector("#chart5 .chart-area");

if (chart5Area) {
  chart5Area.innerHTML = `
    <p style="font-size: 16px; color: #555; text-align:center;">
      Chart 5 ready for data
    </p>
  `;
} else {
  console.error("Chart 5 container not found!");
}

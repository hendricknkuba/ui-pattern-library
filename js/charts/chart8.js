// -------------------------------
// Chart 8 JS File
// -------------------------------

console.log("chart8.js loaded");

const chart8Area = document.querySelector("#chart8 .chart-area");

if (chart8Area) {
  chart8Area.innerHTML = `
    <p style="font-size: 16px; color: #555; text-align:center;">
      Chart 8 ready for data
    </p>
  `;
} else {
  console.error("Chart 8 container not found!");
}

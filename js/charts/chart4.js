// -------------------------------
// Chart 4 JS File
// -------------------------------

console.log("chart4.js loaded");

const chart4Area = document.querySelector("#chart4 .chart-area");

if (chart4Area) {
  chart4Area.innerHTML = `
    <p style="font-size: 16px; color: #555; text-align:center;">
      Chart 4 ready for data
    </p>
  `;
} else {
  console.error("Chart 4 container not found!");
}

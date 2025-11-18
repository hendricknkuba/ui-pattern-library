// -------------------------------
// Chart 2 JS File
// -------------------------------

console.log("chart2.js loaded");

const chart2Area = document.querySelector("#chart2 .chart-area");

if (chart2Area) {
  chart2Area.innerHTML = `
    <p style="font-size: 16px; color: #555; text-align:center;">
      Chart 2 ready for data
    </p>
  `;
} else {
  console.error("Chart 2 container not found!");
}

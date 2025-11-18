// -------------------------------
// Chart 3 JS File
// -------------------------------

console.log("chart3.js loaded");

const chart3Area = document.querySelector("#chart3 .chart-area");

if (chart3Area) {
  chart3Area.innerHTML = `
    <p style="font-size: 16px; color: #555; text-align:center;">
      Chart 3 ready for data
    </p>
  `;
} else {
  console.error("Chart 3 container not found!");
}

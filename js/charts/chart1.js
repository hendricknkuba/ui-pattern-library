// -------------------------------
// Chart 1 JS File
// -------------------------------

// Confirm the file loaded
console.log("chart1.js loaded");

// Find the chart-area div inside the #chart1 section
const chart1Area = document.querySelector("#chart1 .chart-area");

// Safety check (prevents errors if HTML is missing)
if (chart1Area) {
  // Temporary placeholder so you can see it's working
  chart1Area.innerHTML = `
    <p style="font-size: 16px; color: #555; text-align:center;">
      Chart 1 ready for data
    </p>
  `;
} else {
  console.error("Chart 1 container not found!");
}

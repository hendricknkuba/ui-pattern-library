// -------------------------------
// Chart 7 JS File
// -------------------------------

console.log("chart7.js loaded");

function chart7_categoryMostFollowers(youtubeData) {

  // Group by category and sum subscribers
  const categoryTotals = d3.rollup(
    youtubeData,
    v => d3.sum(v, d => d.subscribers),
    d => d.category
  );

  // Convert Map → Array
  const categoryArray = Array.from(categoryTotals, ([category, total]) => ({
    category,
    total
  }));

  // Find the category with the highest total subscribers
  const topCategory = categoryArray.reduce((max, current) =>
    current.total > max.total ? current : max
  );

  // Get container
  const chart7Area = document.querySelector("#chart7 .chart-area");

  if (!chart7Area) {
    console.error("Chart 7 container not found!");
    return;
  }

  // Clear old content
  chart7Area.innerHTML = "";

  // Build the metric card
  chart7Area.innerHTML = `
    <div style="
      background: white;
      padding: 26px;
      border-radius: 14px;
      text-align: center;
      border: 1px solid #eee;
      box-shadow: 0px 2px 10px rgba(0,0,0,0.08);
      max-width: 330px;
      margin: 0 auto;
    ">

      <p style="
        font-family: serif;
        font-size: 20px;
        color: #111;
        margin-bottom: 12px;
      ">
        Category with Most Followers
      </p>

      <p id="chart7-value" style="
        font-size: 44px;
        font-weight: bold;
        color: #004BFF;
        margin: 0;
        line-height: 1.1;
      ">0</p>

      <p style="
        font-size: 18px;
        color: #333;
        margin-top: 6px;
      ">
        ${topCategory.category}
      </p>
    </div>
  `;

  // Animate number when visible
  const valueElement = document.querySelector("#chart7-value");
  valueElement.setAttribute("data-value", topCategory.total);
  chart9_observer.observe(valueElement); // reuse existing intersection observer
}
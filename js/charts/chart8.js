// -------------------------------
// Chart 8 JS File
// -------------------------------

console.log("chart8.js loaded");

function chart8_countryWithMostYoutubers(youtubeData) {

  // Count how many creators exist in each country
  const countryCount = d3.rollup(
    youtubeData,
    v => v.length,
    d => d.country
  );

  // Convert Map → Array for easier processing
  const countryArray = Array.from(countryCount, ([country, count]) => ({
    country,
    count
  }));

  // Find the country with the highest count
  const topCountry = countryArray.reduce((max, current) =>
    current.count > max.count ? current : max
  );

  // Get chart container
  const chart8Area = document.querySelector("#chart8 .chart-area");

  if (!chart8Area) {
    console.error("Chart 8 container not found!");
    return;
  }

  // Clear previous content
  chart8Area.innerHTML = "";

  // Create single-value card UI
  chart8Area.innerHTML = `
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
        Country with Most YouTubers
      </p>

      <p id="chart8-value" style="
        font-size: 44px;
        font-weight: bold;
        color: #1B3B6F;
        margin: 0;
        line-height: 1.1;
      ">0</p>

      <p style="
        font-size: 18px;
        color: #333;
        margin-top: 6px;
      ">
        ${topCountry.country}
      </p>
    </div>
  `;

  // Animate number when visible
  const valueElement = document.querySelector("#chart8-value");
  valueElement.setAttribute("data-value", topCountry.count);
  chart9_observer.observe(valueElement); // reuse observer from Chart 9
}
// -------------------------------
// Chart 6 JS File
// -------------------------------

console.log("chart6.js loaded");

function chart6_categoryByCountry(youtubeData) {

const chart6Area = document.querySelector("#chart6 .chart-area");
const countryInput = document.querySelector("#chart6-country-input");
const titleElement = document.querySelector("#chart6-title");

if (!chart6Area || !countryInput) {
   console.error("Chart 6 container or input not found!");
   return;
}

// SVG setup 
const width = 500;
const height = 300;
const margin = { top: 30, right: 20, bottom: 40, left: 140 };

const svg = d3.select(chart6Area)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Function to update chart based on selected country
function updateChart(countryCode){

  // Update title dynamically
  titleElement.textContent = `Chart 6: Channels by Category in ${countryCode}`;

  // Filter dataset
  const filtered = youtubeData.filter(d => d.country === countryCode);

  // Group by category and count creators
    const grouped = d3.rollup(
      filtered,
      v => v.length,
      d => d.category
    );

    const data = Array.from(grouped, ([category, count]) => ({
      category,
      count
    }));

     // Sort by count descending
    data.sort((a, b) => b.count - a.count);

    // If no data, show message
    if (data.length === 0) {
      svg.selectAll("*").remove();
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .text("No data for this country");
      return;
    }

    // Clear SVG before drawing again
    svg.selectAll("*").remove();

    // Scales
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    // Draw bars
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", d => y(d.category))
      .attr("width", 0) // animation start
      .attr("height", y.bandwidth())
      .attr("fill", "#1B3B6F") // brand blue
      .transition()
      .duration(600)
      .attr("width", d => x(d.count) - margin.left);

    // Add labels
    svg
      .selectAll("text.count-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "count-label")
      .attr("x", d => x(d.count) + 5)
      .attr("y", d => y(d.category) + y.bandwidth() / 1.7)
      .text(d => d.count)
      .style("font-size", "12px")
      .style("fill", "#111");

    // Add Y axis labels
    svg
      .append("g")
      .attr("transform", `translate(${margin.left - 10},0)`)
      .call(d3.axisLeft(y));
  }

  // Default country = US
  updateChart("US");

  // Listen for input changes
  countryInput.addEventListener("input", e => {
    const value = e.target.value.trim().toUpperCase();
    if (value.length === 2) updateChart(value);
  });
}
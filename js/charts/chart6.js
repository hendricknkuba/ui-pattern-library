// -------------------------------
// Chart 6 JS File
// -------------------------------

console.log("chart6.js loaded");

function chart6_categoryByCountry(youtubeData) {

  const chart6Area = document.querySelector("#chart6 .chart-area");
  const countrySelect = document.querySelector("#chart6-country-select");
  const titleElement = document.querySelector("#chart6-title");

  if (!chart6Area || !countrySelect) {
    console.error("Chart 6 container or select not found!");
    return;
  }

  // Get unique countries from the dataset and populate dropdown dynamically
  const uniqueCountries = [...new Set(youtubeData.map(d => d.country))].sort();
  
  // Clear existing options
  countrySelect.innerHTML = '';
  
  // Add options for each country in the dataset
  uniqueCountries.forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });

  // SVG setup - responsive
  const containerWidth = chart6Area.offsetWidth;
  const isMobile = window.innerWidth <= 768;
  const width = isMobile ? Math.min(containerWidth, 500) : 500;
  const height = 300;
  const margin = { top: 30, right: 20, bottom: 40, left: isMobile ? 100 : 140 };

  const svg = d3.select(chart6Area)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // Function to update chart based on selected country
  function updateChart(countryCode) {

    // Update title dynamically
    // titleElement.textContent = `Chart 6: Channels by Category in ${countryCode}`;

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
        .style("font-family", "'Merriweather', serif")
        .style("fill", "#666")
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

  // Default country = first in list (or US if available)
  const defaultCountry = uniqueCountries.includes("US") ? "US" : uniqueCountries[0];
  countrySelect.value = defaultCountry;
  updateChart(defaultCountry);

  // Listen for dropdown changes
  countrySelect.addEventListener("change", e => {
    updateChart(e.target.value);
  });
}
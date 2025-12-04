// -------------------------------
// Chart 3: YouTubers per Country (Bar Chart)
// -------------------------------

console.log("chart3.js loaded");

const chart3Area = document.querySelector("#chart3 .chart-area");

if (!chart3Area) {
  console.error("Chart 3 container not found!");
} else {
  d3.csv("data/top_100_youtubers.csv").then(data => {
    
    // Count YouTubers per country
    const countryCounts = d3.rollup(
      data,
      v => v.length,
      d => d.Country
    );
    
    // Convert to array and sort by count
    const chartData = Array.from(countryCounts, ([country, count]) => ({
      country: country,
      count: count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 countries
    
    // Chart dimensions - responsive
    const containerWidth = chart3Area.offsetWidth;
    const isMobile = window.innerWidth <= 768;
    const margin = {top: 20, right: 20, bottom: 60, left: 50};
    const width = (isMobile ? Math.min(containerWidth - 40, 500) : 500) - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(chart3Area)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Scales
    const xScale = d3.scaleBand()
      .domain(chartData.map(d => d.country))
      .range([0, width])
      .padding(0.2);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.count) * 1.1])
      .range([height, 0]);
    
    // Color gradient
    const colorScale = d3.scaleLinear()
      .domain([0, chartData.length - 1])
      .range(["#004BFF", "#FF0009"]);
    
    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .style("font-family", "Merriweather, serif")
      .style("font-size", "10px")
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
    
    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(yScale).ticks(5))
      .style("font-family", "Merriweather, serif")
      .style("font-size", "10px");
    
    // Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -35)
      .attr("text-anchor", "middle")
      .style("font-family", "Merriweather, serif")
      .style("font-size", "12px")
      .style("fill", "#1A1A1A")
      .text("Number of YouTubers");
    
    // Add bars
    svg.selectAll("rect")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.country))
      .attr("y", height)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", (d, i) => colorScale(i))
      .attr("stroke", "#1A1A1A")
      .attr("stroke-width", 1)
      .transition()
      .duration(800)
      .attr("y", d => yScale(d.count))
      .attr("height", d => height - yScale(d.count));
    
    // Add value labels on bars
    svg.selectAll(".label")
      .data(chartData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => xScale(d.country) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.count) - 5)
      .attr("text-anchor", "middle")
      .style("font-family", "Merriweather, serif")
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .style("fill", "#1A1A1A")
      .text(d => d.count)
      .style("opacity", 0)
      .transition()
      .duration(800)
      .delay(400)
      .style("opacity", 1);
    
  }).catch(error => {
    console.error("Error loading data for Chart 3:", error);
    chart3Area.innerHTML = `<p style="color: #FF0009;">Error loading data</p>`;
  });
}

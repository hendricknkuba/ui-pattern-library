// -------------------------------
// Chart 2: Likes vs Subscribers (Scatter Plot)
// -------------------------------

console.log("chart2.js loaded");

const chart2Area = document.querySelector("#chart2 .chart-area");

if (!chart2Area) {
  console.error("Chart 2 container not found!");
} else {
  d3.csv("data/top_100_youtubers.csv").then(data => {
    
    // Process data - convert strings to numbers
    const chartData = data
      .filter(d => d.followers && d.Likes)
      .map(d => ({
        channel: d.ChannelName,
        subscribers: +d.followers / 1000000, // Convert to millions
        likes: +d.Likes / 1000000, // Convert to millions
        category: d.Category
      }))
      .filter(d => d.subscribers > 0 && d.likes > 0)
      .slice(0, 30); // Top 30 for clarity
    
    // Chart dimensions
    const margin = {top: 20, right: 20, bottom: 50, left: 60};
    const width = 500 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(chart2Area)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.subscribers) * 1.1])
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.likes) * 1.1])
      .range([height, 0]);
    
    // Color scale
    const colorScale = d3.scaleOrdinal()
      .domain([...new Set(chartData.map(d => d.category))])
      .range(["#FF0009", "#004BFF", "#00FF85", "#7B00C8", "#2A4FFF"]);
    
    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .style("font-family", "Merriweather, serif")
      .style("font-size", "10px");
    
    // X axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .style("font-family", "Merriweather, serif")
      .style("font-size", "12px")
      .style("fill", "#1A1A1A")
      .text("Subscribers (Millions)");
    
    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(yScale))
      .style("font-family", "Merriweather, serif")
      .style("font-size", "10px");
    
    // Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -45)
      .attr("text-anchor", "middle")
      .style("font-family", "Merriweather, serif")
      .style("font-size", "12px")
      .style("fill", "#1A1A1A")
      .text("Likes (Millions)");
    
    // Add dots with tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "2px solid #FF0009")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("font-family", "Inter, sans-serif")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);
    
    svg.selectAll("circle")
      .data(chartData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.subscribers))
      .attr("cy", d => yScale(d.likes))
      .attr("r", 5)
      .attr("fill", d => colorScale(d.category))
      .attr("opacity", 0.7)
      .attr("stroke", "#1A1A1A")
      .attr("stroke-width", 1)
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 8)
          .attr("opacity", 1);
        
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        
        tooltip.html(`
          <strong>${d.channel}</strong><br/>
          Subscribers: ${d.subscribers.toFixed(1)}M<br/>
          Likes: ${d.likes.toFixed(1)}M
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 5)
          .attr("opacity", 0.7);
        
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
    
  }).catch(error => {
    console.error("Error loading data for Chart 2:", error);
    chart2Area.innerHTML = `<p style="color: #FF0009;">Error loading data</p>`;
  });
}

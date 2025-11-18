// -------------------------------
// Chart 4: Top 5 Channels - Average Views by Year (Line Chart)
// -------------------------------

console.log("chart4.js loaded");

const chart4Area = document.querySelector("#chart4 .chart-area");

if (!chart4Area) {
  console.error("Chart 4 container not found!");
} else {
  d3.csv("data/avg_view_every_year.csv").then(data => {
    
    // Process data - convert to long format
    const channels = ["T-Series", "ABCkidTV - Nursery Rhymes", "SET India", "PewDiePie", "MrBeast"];
    const colors = ["#FF0009", "#004BFF", "#00FF85", "#7B00C8", "#2A4FFF"];
    
    const chartData = data.map(d => ({
      year: +d.Year,
      values: channels.map(channel => ({
        channel: channel,
        views: +d[channel]
      }))
    }));
    
    // Chart dimensions
    const margin = {top: 20, right: 120, bottom: 50, left: 70};
    const width = 600 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(chart4Area)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(chartData, d => d.year))
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d3.max(d.values, v => v.views)) * 1.1])
      .range([height, 0]);
    
    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(6))
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
      .text("Year");
    
    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(yScale).tickFormat(d => (d / 1000000).toFixed(0) + "M"))
      .style("font-family", "Merriweather, serif")
      .style("font-size", "10px");
    
    // Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .style("font-family", "Merriweather, serif")
      .style("font-size", "12px")
      .style("fill", "#1A1A1A")
      .text("Average Views");
    
    // Line generator
    const line = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.views))
      .curve(d3.curveMonotoneX);
    
    // Draw lines for each channel
    channels.forEach((channel, i) => {
      const lineData = chartData.map(d => ({
        year: d.year,
        views: d.values.find(v => v.channel === channel).views
      }));
      
      // Draw line
      svg.append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", colors[i])
        .attr("stroke-width", 2.5)
        .attr("d", line)
        .attr("stroke-dasharray", function() {
          const length = this.getTotalLength();
          return length + " " + length;
        })
        .attr("stroke-dashoffset", function() {
          return this.getTotalLength();
        })
        .transition()
        .duration(1500)
        .attr("stroke-dashoffset", 0);
      
      // Add dots
      svg.selectAll(`.dot-${i}`)
        .data(lineData)
        .enter()
        .append("circle")
        .attr("class", `dot-${i}`)
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.views))
        .attr("r", 4)
        .attr("fill", colors[i])
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .style("opacity", 0)
        .transition()
        .duration(800)
        .delay((d, j) => 1500 + j * 100)
        .style("opacity", 1);
    });
    
    // Add legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width + 10}, 20)`);
    
    channels.forEach((channel, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 25})`);
      
      legendRow.append("line")
        .attr("x1", 0)
        .attr("x2", 20)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke", colors[i])
        .attr("stroke-width", 2.5);
      
      legendRow.append("text")
        .attr("x", 25)
        .attr("y", 4)
        .style("font-family", "Merriweather, serif")
        .style("font-size", "9px")
        .style("fill", "#1A1A1A")
        .text(channel.length > 15 ? channel.substring(0, 15) + "..." : channel);
    });
    
  }).catch(error => {
    console.error("Error loading data for Chart 4:", error);
    chart4Area.innerHTML = `<p style="color: #FF0009;">Error loading data</p>`;
  });
}

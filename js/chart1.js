// -------------------------------
// Chart 1: Proportion of Categories (Pie Chart)
// -------------------------------

console.log("chart1.js loaded");

const chart1Area = document.querySelector("#chart1 .chart-area");

if (!chart1Area) {
  console.error("Chart 1 container not found!");
} else {
  // Load the data
  d3.csv("data/top_100_youtubers.csv").then(data => {
    
    // Count categories
    const categoryCounts = d3.rollup(
      data,
      v => v.length,
      d => d.Category
    );
    
    // Convert to array format for D3
    const chartData = Array.from(categoryCounts, ([category, count]) => ({
      category: category === "None" ? "Other" : category,
      count: count
    })).sort((a, b) => b.count - a.count);
    
    // Calculate total for percentage
    const total = d3.sum(chartData, d => d.count);
    
    // Chart dimensions
    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 100;
    
    // Create SVG
    const svg = d3.select(chart1Area)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2 - 20})`);
    
    // Color scale using brand colors
    const color = d3.scaleOrdinal()
      .domain(chartData.map(d => d.category))
      .range(["#FF0009", "#004BFF", "#00FF85", "#7B00C8", "#2A4FFF", "#FF6B9D"]);
    
    // Pie generator
    const pie = d3.pie()
      .value(d => d.count)
      .sort(null);
    
    // Arc generator
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);
    
    const arcHover = d3.arc()
      .innerRadius(0)
      .outerRadius(radius + 15);
    
    // Create tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "chart1-tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "2px solid #FF0009")
      .style("border-radius", "8px")
      .style("padding", "12px")
      .style("font-family", "Inter, sans-serif")
      .style("font-size", "13px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("box-shadow", "0 4px 6px rgba(0,0,0,0.1)");
    
    // Create pie slices
    const arcs = svg.selectAll(".arc")
      .data(pie(chartData))
      .enter()
      .append("g")
      .attr("class", "arc");
    
    const paths = arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.category))
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .style("cursor", "pointer")
      .each(function(d) { 
        // Store the original arc data
        this._current = d; 
      })
      .on("mouseover", function(event, d) {
        const percentage = ((d.data.count / total) * 100).toFixed(1);
        
        // Dim other slices
        paths.filter(function(data) { return data !== d; })
          .transition()
          .duration(300)
          .style("opacity", 0.5);
        
        // Show tooltip
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.95);
        
        tooltip.html(`
          <div style="border-bottom: 2px solid ${color(d.data.category)}; padding-bottom: 6px; margin-bottom: 6px;">
            <strong style="color: ${color(d.data.category)}; font-size: 14px;">${d.data.category}</strong>
          </div>
          <div><strong>Count:</strong> ${d.data.count} channels</div>
          <div><strong>Percentage:</strong> ${percentage}%</div>
        `)
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 15) + "px");
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 15) + "px");
      })
      .on("mouseout", function(event, d) {
        // Restore opacity for all slices
        paths
          .transition()
          .duration(300)
          .style("opacity", 1);
        
        // Hide tooltip
        tooltip.transition()
          .duration(300)
          .style("opacity", 0);
      });
    
    // Add percentage labels on slices
    arcs.append("text")
      .attr("transform", d => {
        const [x, y] = arc.centroid(d);
        return `translate(${x}, ${y})`;
      })
      .attr("text-anchor", "middle")
      .style("font-family", "Merriweather, serif")
      .style("font-size", "12px")
      .style("fill", "white")
      .style("font-weight", "bold")
      .style("pointer-events", "none")
      .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.5)")
      .text(d => {
        const percentage = ((d.data.count / total) * 100);
        return percentage > 5 ? percentage.toFixed(0) + "%" : "";
      });
    
    // Add legend below
    const legend = svg.append("g")
      .attr("transform", `translate(${-width/2 + 40}, ${radius + 50})`);
    
    const itemsPerRow = 3;
    chartData.forEach((d, i) => {
      const row = Math.floor(i / itemsPerRow);
      const col = i % itemsPerRow;
      
      const legendRow = legend.append("g")
        .attr("transform", `translate(${col * 140}, ${row * 22})`)
        .style("cursor", "pointer")
        .on("mouseover", function() {
          // Highlight corresponding slice
          arcs.selectAll("path")
            .filter(pieData => pieData.data.category === d.category)
            .transition()
            .duration(200)
            .attr("d", arcHover);
        })
        .on("mouseout", function() {
          arcs.selectAll("path")
            .transition()
            .duration(200)
            .attr("d", arc);
        });
      
      legendRow.append("rect")
        .attr("width", 14)
        .attr("height", 14)
        .attr("fill", color(d.category))
        .attr("stroke", "#1A1A1A")
        .attr("stroke-width", 1);
      
      legendRow.append("text")
        .attr("x", 20)
        .attr("y", 11)
        .style("font-family", "Merriweather, serif")
        .style("font-size", "11px")
        .style("fill", "#1A1A1A")
        .text(d.category);
    });
    
  }).catch(error => {
    console.error("Error loading data for Chart 1:", error);
    chart1Area.innerHTML = `<p style="color: #FF0009;">Error loading data</p>`;
  });
}

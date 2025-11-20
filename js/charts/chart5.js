// -------------------------------
// Chart 5: Quarterly Income - Horizontal Grouped Bar Chart
// -------------------------------

console.log("chart5.js loaded");

const chart5Area = document.querySelector("#chart5 .chart-area");

if (!chart5Area) {
  console.error("Chart 5 container not found!");
} else {
  d3.csv("data/top_100_youtubers.csv").then(data => {
    
    // Get top 8 channels by total income
    const chartData = data
      .map(d => ({
        channel: d.ChannelName,
        q1: +d["Income q1"],
        q2: +d["Income q2"],
        q3: +d["Income q3"],
        q4: +d["Income q4"],
        total: +d["Income q1"] + +d["Income q2"] + +d["Income q3"] + +d["Income q4"]
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
    
    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    const colors = ["#FF0009", "#004BFF", "#00FF85", "#7B00C8"];
    
    // Chart dimensions - responsive
    const containerWidth = chart5Area.offsetWidth;
    const isMobile = window.innerWidth <= 768;
    const margin = {top: 20, right: isMobile ? 60 : 80, bottom: 60, left: isMobile ? 120 : 150};
    const width = (isMobile ? Math.min(containerWidth - 40, 700) : 650) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(chart5Area)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Scales
    const yScale = d3.scaleBand()
      .domain(chartData.map(d => d.channel))
      .range([0, height])
      .padding(0.2);
    
    const ySubScale = d3.scaleBand()
      .domain(quarters)
      .range([0, yScale.bandwidth()])
      .padding(0.05);
    
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => Math.max(d.q1, d.q2, d.q3, d.q4)) * 1.1])
      .range([0, width]);
    
    // Add Y axis (channels)
    svg.append("g")
      .call(d3.axisLeft(yScale))
      .style("font-family", "Merriweather, serif")
      .style("font-size", "10px")
      .selectAll("text")
      .text(d => d.length > 20 ? d.substring(0, 20) + "..." : d);
    
    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d => "$" + (d / 1000).toFixed(0) + "K"))
      .style("font-family", "Merriweather, serif")
      .style("font-size", "10px");
    
    // X axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 45)
      .attr("text-anchor", "middle")
      .style("font-family", "Merriweather, serif")
      .style("font-size", "12px")
      .style("fill", "#1A1A1A")
      .text("Quarterly Income ($)");
    
    // Add bars for each quarter
    const channelGroups = svg.selectAll(".channel-group")
      .data(chartData)
      .enter()
      .append("g")
      .attr("class", "channel-group")
      .attr("transform", d => `translate(0, ${yScale(d.channel)})`);
    
    // Q1 bars
    channelGroups.selectAll(".bar-q1")
      .data(d => [{channel: d.channel, value: d.q1, quarter: "Q1"}])
      .enter()
      .append("rect")
      .attr("class", "bar-q1")
      .attr("x", 0)
      .attr("y", ySubScale("Q1"))
      .attr("width", 0)
      .attr("height", ySubScale.bandwidth())
      .attr("fill", colors[0])
      .attr("stroke", "#1A1A1A")
      .attr("stroke-width", 0.5)
      .transition()
      .duration(800)
      .delay(100)
      .attr("width", d => xScale(d.value));
    
    // Q2 bars
    channelGroups.selectAll(".bar-q2")
      .data(d => [{channel: d.channel, value: d.q2, quarter: "Q2"}])
      .enter()
      .append("rect")
      .attr("class", "bar-q2")
      .attr("x", 0)
      .attr("y", ySubScale("Q2"))
      .attr("width", 0)
      .attr("height", ySubScale.bandwidth())
      .attr("fill", colors[1])
      .attr("stroke", "#1A1A1A")
      .attr("stroke-width", 0.5)
      .transition()
      .duration(800)
      .delay(200)
      .attr("width", d => xScale(d.value));
    
    // Q3 bars
    channelGroups.selectAll(".bar-q3")
      .data(d => [{channel: d.channel, value: d.q3, quarter: "Q3"}])
      .enter()
      .append("rect")
      .attr("class", "bar-q3")
      .attr("x", 0)
      .attr("y", ySubScale("Q3"))
      .attr("width", 0)
      .attr("height", ySubScale.bandwidth())
      .attr("fill", colors[2])
      .attr("stroke", "#1A1A1A")
      .attr("stroke-width", 0.5)
      .transition()
      .duration(800)
      .delay(300)
      .attr("width", d => xScale(d.value));
    
    // Q4 bars
    channelGroups.selectAll(".bar-q4")
      .data(d => [{channel: d.channel, value: d.q4, quarter: "Q4"}])
      .enter()
      .append("rect")
      .attr("class", "bar-q4")
      .attr("x", 0)
      .attr("y", ySubScale("Q4"))
      .attr("width", 0)
      .attr("height", ySubScale.bandwidth())
      .attr("fill", colors[3])
      .attr("stroke", "#1A1A1A")
      .attr("stroke-width", 0.5)
      .transition()
      .duration(800)
      .delay(400)
      .attr("width", d => xScale(d.value));
    
    // Add legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width + 10}, 0)`);
    
    quarters.forEach((quarter, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 25})`);
      
      legendRow.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", colors[i])
        .attr("stroke", "#1A1A1A")
        .attr("stroke-width", 0.5);
      
      legendRow.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .style("font-family", "Merriweather, serif")
        .style("font-size", "11px")
        .style("fill", "#1A1A1A")
        .text(quarter);
    });
    
  }).catch(error => {
    console.error("Error loading data for Chart 5:", error);
    chart5Area.innerHTML = `<p style="color: #FF0009;">Error loading data</p>`;
  });
}

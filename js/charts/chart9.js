// Chart 9 – Top Subscribed Channel (static highlight version)
// File: js/charts/chart9.js

console.log("chart9.js loaded");

// -top channel-
const topChannelName = "T-Series";
const topSubscribers = 220_000_000; // 220M
const averageSubscribers = 75_000_000; // approximate average

// ----- Build the visualization -----
const chart9Area = document.querySelector("#chart9 .chart-area");

if (!chart9Area) {
  console.error("Chart 9 container not found!");
} else {
  // Clear any previous error / content
  chart9Area.innerHTML = "";

  // Create root container
  const root = d3.select(chart9Area)
    .append("div")
    .style("display", "flex")
    .style("gap", "24px")
    .style("align-items", "center")
    .style("flex-wrap", "wrap");

  const fmt = d3.format(",");

  // ============ LEFT: CALLOUT CARD ============
  const card = root.append("div")
    .style("padding", "16px 18px")
    .style("border-radius", "12px")
    .style("background", "#f8f8f8")
    .style("border", "1px solid #e0e0e0")
    .style("min-width", "260px")
    .style("box-shadow", "0 2px 6px rgba(0,0,0,0.06)");

  card.append("div")
    .style("font-size", "13px")
    .style("text-transform", "uppercase")
    .style("letter-spacing", "0.08em")
    .style("color", "#999")
    .style("margin-bottom", "4px")
    .text("Top Subscribed Channel");

  card.append("div")
    .style("font-size", "20px")
    .style("font-weight", "700")
    .style("margin-bottom", "6px")
    .style("color", "#1A1A1A")
    .text(topChannelName);

  card.append("div")
    .style("font-size", "14px")
    .style("margin-bottom", "4px")
    .html(`<strong>${fmt(topSubscribers)}</strong> subscribers`);

  card.append("div")
    .style("font-size", "13px")
    .style("color", "#555")
    .text("Country: IN");

  // ============ RIGHT: MINI COMPARISON BAR CHART ============
  const margin = { top: 20, right: 20, bottom: 20, left: 120 };
  const width = 360 - margin.left - margin.right;
  const height = 120 - margin.top - margin.bottom;

  const svg = root.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const barData = [
    { label: "Average Channel", value: averageSubscribers },
    { label: topChannelName, value: topSubscribers }
  ];

  const y = d3.scaleBand()
    .domain(barData.map(d => d.label))
    .range([0, height])
    .padding(0.35);

  const x = d3.scaleLinear()
    .domain([0, d3.max(barData, d => d.value)])
    .nice()
    .range([0, width]);

  svg.selectAll("rect")
    .data(barData)
    .enter()
    .append("rect")
    .attr("y", d => y(d.label))
    .attr("height", y.bandwidth())
    .attr("x", 0)
    .attr("width", d => x(d.value))
    .attr("fill", d =>
      d.label === topChannelName
        ? "#FF0009"   
        : "#004BFF"   
    );

  // Y axis labels
  svg.append("g")
    .call(d3.axisLeft(y).tickSize(0))
    .selectAll("text")
    .style("font-size", "11px")
    .style("fill", "#1A1A1A");

  // Value labels
  svg.selectAll(".value-label")
    .data(barData)
    .enter()
    .append("text")
    .attr("class", "value-label")
    .attr("x", d => x(d.value) + 6)
    .attr("y", d => y(d.label) + y.bandwidth() / 2 + 4)
    .style("font-size", "11px")
    .style("fill", "#1A1A1A")
    .text(d => fmt(Math.round(d.value)));
}

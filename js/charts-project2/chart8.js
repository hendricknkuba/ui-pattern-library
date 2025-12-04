// -------------------------------
// Chart 8: Country with the Most YouTubers (Top 10)
// -------------------------------

console.log("chart8.js loaded");

const chart8Area = document.querySelector("#chart8 .chart-area");

if (!chart8Area) {
  console.error("Chart 8 container not found!");
} else {
  d3.csv("data/top_100_youtubers.csv").then(data => {
    // Ensure Country field exists
    data.forEach(d => {
      d.Country = d.Country || "Unknown";
    });

    // Count creators per country
    const counts = d3.rollup(
      data,
      v => v.length,
      d => d.Country
    );

    let countryData = Array.from(counts, ([Country, Count]) => ({ Country, Count }));

    // Sort descending by count
    countryData.sort((a, b) => d3.descending(a.Count, b.Count));

    const topCountry = countryData[0];

    // ----- Responsive dimensions -----
    const containerWidth = chart8Area.offsetWidth || 650;
    const isMobile = window.innerWidth <= 768;

    const margin = {
      top: 70,
      right: isMobile ? 32 : 70,
      bottom: 90,
      left: 70
    };

    const innerWidth = Math.min(containerWidth - 10, 720);
    const width = innerWidth - margin.left - margin.right;
    const height = 260 - margin.top - margin.bottom;

    // ----- SVG -----
    const svg = d3.select(chart8Area)
      .html("")
      .append("svg")
      .attr("width", innerWidth)
      .attr("height", height + margin.top + margin.bottom)
      .attr("viewBox", `0 0 ${innerWidth} ${height + margin.top + margin.bottom}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // ----- Scales -----
    const x = d3.scaleBand()
      .domain(countryData.map(d => d.Country))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(countryData, d => d.Count) * 1.1])
      .nice()
      .range([height, 0]);

    // ----- Bars -----
    svg.selectAll("rect")
      .data(countryData)
      .enter()
      .append("rect")
      .attr("x", d => x(d.Country))
      .attr("y", d => y(d.Count))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.Count))
      .attr("fill", d =>
        d.Country === topCountry.Country ? "#FF0009" : "#004BFF"
      )
      .attr("stroke", d =>
        d.Country === topCountry.Country ? "#1A1A1A" : "none"
      )
      .attr("stroke-width", 1.2);

    // ----- X Axis -----
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "10px")
      .attr("dx", "-0.4em")
      .attr("dy", "0.4em");

    // ----- X Axis Label -----
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 60)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#1A1A1A")
      .text("Country");

    // ----- Y Axis -----
    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "10px");

    // ----- Y Axis Label -----
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#1A1A1A")
      .text("Number of YouTubers");

    // ----- Title -----
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "700")
      .style("fill", "#1A1A1A")
      .text("Country with the Most YouTubers (Top 10)");

    // ----- FIXED TOP BAR LABEL (no overlap) -----
    svg.append("text")
      .attr("x", x(topCountry.Country) + x.bandwidth() / 2 + 12)  // shift right
      .attr("y", y(topCountry.Count) - 16)                        // move higher
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "700")
      .style("fill", "#1A1A1A")
      .text(`${topCountry.Country} (${topCountry.Count})`);

  }).catch(error => {
    console.error("Error loading data for Chart 8:", error);
    chart8Area.innerHTML = `
      <p style="color: #FF0009; text-align:center; margin-top:24px;">
        Error loading data for Chart 8
      </p>`;
  });
}


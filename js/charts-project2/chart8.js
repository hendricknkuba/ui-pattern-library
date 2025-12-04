// Chart 8 – Country with the Most YouTubers in the Top 100
// File: js/charts-project2/chart8.js

d3.csv("data/top_100_youtubers.csv").then(data => {

    // Convert subscribers to number (if needed) 
    data.forEach(d => {
        d.Country = d.Country || "Unknown";
    });

    // Count per country
    const countryCounts = d3.rollup(
        data,
        v => v.length,
        d => d.Country
    );

    // Convert map → array
    let countryData = Array.from(countryCounts, ([Country, Count]) => ({ Country, Count }));

    // Sort descending
    countryData.sort((a, b) => d3.descending(a.Count, b.Count));

    // Identify top country
    const topCountry = countryData[0];

    // Chart dimensions
    const margin = { top: 40, right: 20, bottom: 120, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    // Create SVG inside #chart8
    const svg = d3.select("#chart8")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale (countries)
    const x = d3.scaleBand()
        .domain(countryData.map(d => d.Country))
        .range([0, width])
        .padding(0.2);

    // Y scale (counts)
    const y = d3.scaleLinear()
        .domain([0, d3.max(countryData, d => d.Count)])
        .range([height, 0])
        .nice();

    // Bars
    svg.selectAll(".bar")
        .data(countryData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.Country))
        .attr("y", d => y(d.Count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.Count))
        .attr("fill", d =>
            d.Country === topCountry.Country ? "#ff7f0e" : "#1f77b4"
        )
        .attr("stroke", d =>
            d.Country === topCountry.Country ? "black" : "none"
        )
        .attr("stroke-width", 1.2);

    // X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-60)")
        .style("text-anchor", "end")
        .style("font-size", "10px");

    // Y axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Chart 8: Country With the Most YouTubers in Top 100");

    // Label top country above bar
    svg.append("text")
        .attr("x", x(topCountry.Country) + x.bandwidth() / 2)
        .attr("y", y(topCountry.Count) - 8)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(`${topCountry.Country} (${topCountry.Count})`);

});


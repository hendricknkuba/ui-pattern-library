// Chart 9 – Channel with the Most Subscribers
// File: js/charts-project2/chart9.js

d3.csv("data/top_100_youtubers.csv").then(data => {

    // Ensure subscribers are numbers
    data.forEach(d => {
        d.Subscribers = +String(d.Subscribers).replace(/,/g, "");
        d.ChannelName = d.ChannelName || "Unknown";
        d.Country = d.Country || "Unknown";
    });

    // Find top channel
    const topChannel = data.reduce((max, d) =>
        d.Subscribers > max.Subscribers ? d : max, data[0]
    );

    // Average subscribers (for comparison bar)
    const avgSubscribers = d3.mean(data, d => d.Subscribers);

    // Format numbers with commas
    const fmt = d3.format(",");

    // Create container inside #chart9
    const container = d3.select("#chart9")
        .append("div")
        .style("display", "flex")
        .style("gap", "30px")
        .style("align-items", "center");

    // --- LEFT SIDE: Highlight Card ---
    const card = container.append("div")
        .style("padding", "12px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "8px")
        .style("width", "260px")
        .style("background", "#f8f8f8");

    card.append("div")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .style("margin-bottom", "6px")
        .text("Top YouTube Channel (Subscribers)");

    card.append("div")
        .style("font-size", "16px")
        .style("font-weight", "700")
        .style("margin-bottom", "4px")
        .text(topChannel.ChannelName);

    card.append("div")
        .style("font-size", "14px")
        .html(`
            Subscribers: <strong>${fmt(topChannel.Subscribers)}</strong><br>
            Country: <strong>${topChannel.Country}</strong>
        `);

    // --- RIGHT SIDE: Mini Comparison Chart ---
    const margin = { top: 20, right: 20, bottom: 20, left: 110 };
    const width = 350 - margin.left - margin.right;
    const height = 120 - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Data for mini chart
    const barData = [
        { label: "Average Channel", value: avgSubscribers },
        { label: topChannel.ChannelName, value: topChannel.Subscribers }
    ];

    // Scales
    const y = d3.scaleBand()
        .domain(barData.map(d => d.label))
        .range([0, height])
        .padding(0.35);

    const x = d3.scaleLinear()
        .domain([0, d3.max(barData, d => d.value)])
        .nice()
        .range([0, width]);

    // Bars
    svg.selectAll(".mini-bar")
        .data(barData)
        .enter()
        .append("rect")
        .attr("class", "mini-bar")
        .attr("y", d => y(d.label))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", d => x(d.value))
        .attr("fill", d =>
            d.label === topChannel.ChannelName ? "#ff7f0e" : "#999"
        );

    // Y labels
    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0))
        .selectAll("text")
        .style("font-size", "11px");

    // Value labels
    svg.selectAll(".mini-label")
        .data(barData)
        .enter()
        .append("text")
        .attr("class", "mini-label")
        .attr("x", d => x(d.value) + 5)
        .attr("y", d => y(d.label) + y.bandwidth() / 2 + 4)
        .style("font-size", "11px")
        .text(d => fmt(Math.round(d.value)));

});


d3.csv("top_100_youtubers.csv").then(data => {
    console.log("CSV loaded!", data);

    // Convert numeric fields
    data.forEach(d => {
        d.subscribers = +d.followers; // use followers column
        d.likes = +d.Likes;           // use Likes column
    });

    // Chart size
    const w = 900;
    const h = 500;
    const margin = { top: 40, right: 40, bottom: 60, left: 80 };

    // Create SVG
    const svg = d3.select("#chart2")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // X and Y scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.subscribers)])
        .nice()
        .range([margin.left, w - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.likes)])
        .nice()
        .range([h - margin.bottom, margin.top]);

    // Draw scatter dots
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.subscribers))
        .attr("cy", d => y(d.likes))
        .attr("r", 5)
        .attr("fill", "#d98e30")
        .attr("opacity", 0.7);

    // X axis
    svg.append("g")
        .attr("transform", `translate(0,${h - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.format(".2s")));

    // X label
    svg.append("text")
        .attr("x", w / 2)
        .attr("y", h - 15)
        .attr("text-anchor", "middle")
        .text("Subscribers (Followers)");

    // Y axis
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickFormat(d3.format(".2s")));

    // Y label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -h / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .text("Likes");

    // Title
    svg.append("text")
        .attr("x", w / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Likes vs Subscribers");

});

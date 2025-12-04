d3.csv("/data/top_100_youtubers.csv").then(data => {

    // Convert numeric values
    data.forEach(d => {
        d.subscribers = +d.followers; 
        d.likes = +d.Likes; 
    });

    // Get chart container
    const container = d3.select("#chart2 .chart-area");
    const w = container.node().clientWidth;
    const h = 350;
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };

    // Create responsive SVG
    const svg = container.append("svg")
        .attr("width", w)
        .attr("height", h);

    // Scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.subscribers)])
        .nice()
        .range([margin.left, w - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.likes)])
        .nice()
        .range([h - margin.bottom, margin.top]);

    // Scatter points
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.subscribers))
        .attr("cy", d => y(d.likes))
        .attr("r", 4)
        .attr("fill", "#d98e30")
        .attr("opacity", 0.7);

    // X Axis
    svg.append("g")
        .attr("transform", `translate(0, ${h - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.format(".2s")));

    // Y Axis
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickFormat(d3.format(".2s")));

});
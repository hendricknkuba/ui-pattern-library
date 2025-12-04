// Chart 7 – Category With The Most Followers
d3.csv("data/top_100_youtubers.csv").then(data => {

    console.log("Chart7 CSV loaded:", data);

    // Convert values to numbers
    data.forEach(d => {
        d.followers = +d.followers;
    });

    // Sum of followers by category
    const categoryData = d3.rollups(
        data,
        v => d3.sum(v, d => d.followers),
        d => d.Category
    );

    // Sort descending: highest → lowest
    categoryData.sort((a, b) => b[1] - a[1]);

    const categories = categoryData.map(d => d[0]);
    const totals = categoryData.map(d => d[1]);
    const topCategory = categoryData[0][0];

    // Dimensions inside dashboard card
    const container = d3.select("#chart7 .chart-area");
    const w = 420;
    const h = 330;
    const margin = { top: 30, right: 20, bottom: 45, left: 130 };

    // Clear previous chart (important on rerender)
    container.selectAll("*").remove();

    // Create SVG
    const svg = container
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // Scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(totals)])
        .range([margin.left, w - margin.right]);

    const y = d3.scaleBand()
        .domain(categories)
        .range([margin.top, h - margin.bottom])
        .padding(0.35);

    // Bars
    svg.selectAll("rect")
        .data(categoryData)
        .enter()
        .append("rect")
        .attr("x", margin.left)
        .attr("y", d => y(d[0]))
        .attr("width", d => x(d[1]) - margin.left)
        .attr("height", y.bandwidth())
        .attr("fill", d => d[0] === topCategory ? "#00E676" : "#D9D9D9");

    // Y Axis
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "12px")
        .style("fill", "#444");

    // X Axis (clean version)
    svg.append("g")
        .attr("transform", `translate(0, ${h - margin.bottom})`)
        .call(
            d3.axisBottom(x)
                .ticks(4)                   // fewer ticks to avoid overlap
                .tickFormat(d3.format(".2s")) // 20M, 200M, 1B, 2B
                .tickSizeOuter(0)
        )
        .selectAll("text")
        .style("font-size", "11px")
        .style("fill", "#555");

});

d3.csv("top_100_youtubers.csv").then(data => {

    // Convert followers to number
    data.forEach(d => d.followers = +d.followers);

    // Group by category and sum followers
    const categoryData = d3.rollups(
        data,
        v => d3.sum(v, d => d.followers),
        d => d.Category
    );

    // Sort categories (highest first)
    categoryData.sort((a, b) => b[1] - a[1]);

    // Prepare labels and values
    const categories = categoryData.map(d => d[0]);
    const totals = categoryData.map(d => d[1]);

    // Category with the most followers
    const topCategory = categoryData[0][0];

    // Chart size
    const w = 900, h = 500;
    const margin = { top: 40, right: 40, bottom: 60, left: 150 };

    // Create SVG
    const svg = d3.select("#chart7")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // X and Y scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(totals)])
        .range([margin.left, w - margin.right]);

    const y = d3.scaleBand()
        .domain(categories)
        .range([margin.top, h - margin.bottom])
        .padding(0.3);

    // Draw bars
    svg.selectAll("rect")
        .data(categoryData)
        .enter()
        .append("rect")
        .attr("x", margin.left)
        .attr("y", d => y(d[0]))
        .attr("width", d => x(d[1]) - margin.left)
        .attr("height", y.bandwidth())
        .attr("fill", d => d[0] === topCategory ? "#d98e30" : "#c7c7c7");

    // X axis
    svg.append("g")
        .attr("transform", `translate(0, ${h - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.format(".2s")));

    // Y axis
    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

    // Title
    svg.append("text")
        .attr("x", w / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Category With The Most Followers");

});

// js/charts/chart4.js
document.addEventListener('DOMContentLoaded', function() {
  const chart4Data = [
    {
      channel: "PewDiePie",
      values: [
        {year: 2018, avg_views: 3.2},
        {year: 2019, avg_views: 2.8},
        {year: 2020, avg_views: 2.5},
        {year: 2021, avg_views: 1.9},
        {year: 2022, avg_views: 1.7},
        {year: 2023, avg_views: 1.5}
      ]
    },
    {
      channel: "T-Series",
      values: [
        {year: 2018, avg_views: 2.1},
        {year: 2019, avg_views: 2.5},
        {year: 2020, avg_views: 3.1},
        {year: 2021, avg_views: 3.4},
        {year: 2022, avg_views: 3.6},
        {year: 2023, avg_views: 3.8}
      ]
    },
    {
      channel: "MrBeast",
      values: [
        {year: 2018, avg_views: 0.8},
        {year: 2019, avg_views: 1.5},
        {year: 2020, avg_views: 2.3},
        {year: 2021, avg_views: 3.0},
        {year: 2022, avg_views: 4.2},
        {year: 2023, avg_views: 5.1}
      ]
    },
    {
      channel: "Cocomelon",
      values: [
        {year: 2018, avg_views: 1.2},
        {year: 2019, avg_views: 1.8},
        {year: 2020, avg_views: 2.4},
        {year: 2021, avg_views: 2.7},
        {year: 2022, avg_views: 2.9},
        {year: 2023, avg_views: 3.1}
      ]
    },
    {
      channel: "SET India",
      values: [
        {year: 2018, avg_views: 1.5},
        {year: 2019, avg_views: 1.7},
        {year: 2020, avg_views: 2.0},
        {year: 2021, avg_views: 2.2},
        {year: 2022, avg_views: 2.4},
        {year: 2023, avg_views: 2.5}
      ]
    }
  ];

  const container = d3.select('#chart4 .chart-area');
  container.html(''); // Clear loading text

  const width = container.node().getBoundingClientRect().width;
  const height = 400;
  const margin = {top: 40, right: 120, bottom: 60, left: 70};

  const svg = container.append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Prepare data
  const allYears = [2018, 2019, 2020, 2021, 2022, 2023];
  
  // Color scale
  const colorScale = d3.scaleOrdinal()
    .domain(chart4Data.map(d => d.channel))
    .range(['#FF0009', '#004BFF', '#00FF85', '#FF6B9D', '#FFAA00']);

  // Scales
  const xScale = d3.scaleBand()
    .domain(allYears)
    .range([0, chartWidth])
    .padding(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(chart4Data, d => d3.max(d.values, v => v.avg_views)) * 1.1])
    .range([chartHeight, 0]);

  // X-axis
  svg.append('g')
    .attr('transform', `translate(0,${chartHeight})`)
    .call(d3.axisBottom(xScale).tickFormat(d => d))
    .selectAll('text')
    .style('font-family', 'Inter, sans-serif')
    .style('font-size', '12px')
    .style('fill', '#CCCCCC');

  // Y-axis
  svg.append('g')
    .call(d3.axisLeft(yScale).tickFormat(d => d3.format('.1f')(d) + 'M'))
    .selectAll('text')
    .style('font-family', 'Inter, sans-serif')
    .style('font-size', '12px')
    .style('fill', '#CCCCCC');

  // Y-axis label
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left + 15)
    .attr('x', -chartHeight / 2)
    .attr('text-anchor', 'middle')
    .style('fill', '#CCCCCC')
    .style('font-family', 'Inter, sans-serif')
    .style('font-size', '14px')
    .text('Average Views (Millions)');

  // X-axis label
  svg.append('text')
    .attr('x', chartWidth / 2)
    .attr('y', chartHeight + margin.bottom - 10)
    .attr('text-anchor', 'middle')
    .style('fill', '#CCCCCC')
    .style('font-family', 'Inter, sans-serif')
    .style('font-size', '14px')
    .text('Year');

  // Line generator
  const line = d3.line()
    .x(d => xScale(d.year) + xScale.bandwidth() / 2)
    .y(d => yScale(d.avg_views));

  // Draw lines
  chart4Data.forEach(channelData => {
    svg.append('path')
      .datum(channelData.values)
      .attr('fill', 'none')
      .attr('stroke', colorScale(channelData.channel))
      .attr('stroke-width', 3)
      .attr('d', line);

    // Add dots
    svg.selectAll(`.dot-${channelData.channel.replace(/\s+/g, '-')}`)
      .data(channelData.values)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.year) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.avg_views))
      .attr('r', 5)
      .attr('fill', colorScale(channelData.channel))
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)
      .append('title')
      .text(d => `${channelData.channel}: ${d.avg_views.toFixed(1)}M views in ${d.year}`);
  });

  // Legend
  const legend = svg.append('g')
    .attr('transform', `translate(${chartWidth + 20}, 0)`);

  chart4Data.forEach((d, i) => {
    const legendItem = legend.append('g')
      .attr('transform', `translate(0, ${i * 25})`);

    legendItem.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', colorScale(d.channel))
      .attr('rx', 3);

    legendItem.append('text')
      .attr('x', 22)
      .attr('y', 12)
      .style('fill', '#CCCCCC')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '12px')
      .text(d.channel);
  });

  // Chart title
  svg.append('text')
    .attr('x', chartWidth / 2)
    .attr('y', -15)
    .attr('text-anchor', 'middle')
    .style('fill', '#FFFFFF')
    .style('font-family', 'Inter, sans-serif')
    .style('font-size', '16px')
    .style('font-weight', '600')
    .text('Top 5 Channels - Average Views Trend (2018-2023)');

  // Add chart description
  const description = `Shows average views (in millions) for the top 5 YouTube channels over 6 years.
                      MrBeast shows significant growth, while PewDiePie shows gradual decline.
                      All channels maintain multi-million view averages.`;

  svg.append('text')
    .attr('x', 0)
    .attr('y', chartHeight + 45)
    .style('fill', '#999999')
    .style('font-family', 'Inter, sans-serif')
    .style('font-size', '11px')
    .style('font-style', 'italic')
    .text(description);

  // Responsive behavior
  window.addEventListener('resize', function() {
    // In a real implementation, you'd want to redraw the chart on resize
    console.log('Chart4: Consider implementing responsive redraw');
  });
});
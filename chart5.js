// js/charts/chart5.js
document.addEventListener('DOMContentLoaded', function() {
  const chart5Data = [
    {
      channel: "MrBeast",
      quarters: [
        {quarter: "Q1 2023", income: 18.5},
        {quarter: "Q2 2023", income: 22.1},
        {quarter: "Q3 2023", income: 25.7},
        {quarter: "Q4 2023", income: 30.2}
      ]
    },
    {
      channel: "PewDiePie",
      quarters: [
        {quarter: "Q1 2023", income: 8.2},
        {quarter: "Q2 2023", income: 7.9},
        {quarter: "Q3 2023", income: 8.5},
        {quarter: "Q4 2023", income: 9.1}
      ]
    },
    {
      channel: "T-Series",
      quarters: [
        {quarter: "Q1 2023", income: 12.4},
        {quarter: "Q2 2023", income: 13.1},
        {quarter: "Q3 2023", income: 14.0},
        {quarter: "Q4 2023", income: 15.2}
      ]
    },
    {
      channel: "Cocomelon",
      quarters: [
        {quarter: "Q1 2023", income: 10.8},
        {quarter: "Q2 2023", income: 11.5},
        {quarter: "Q3 2023", income: 12.3},
        {quarter: "Q4 2023", income: 13.0}
      ]
    },
    {
      channel: "SET India",
      quarters: [
        {quarter: "Q1 2023", income: 9.7},
        {quarter: "Q2 2023", income: 10.2},
        {quarter: "Q3 2023", income: 10.8},
        {quarter: "Q4 2023", income: 11.5}
      ]
    }
  ];

  const container = d3.select('#chart5 .chart-area');
  container.html(''); // Clear loading text

  const width = container.node().getBoundingClientRect().width;
  const height = 500; // Taller for horizontal bars
  const margin = {top: 40, right: 100, bottom: 100, left: 180};

  const svg = container.append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Prepare data in a format suitable for grouped horizontal bars
  const quarters = ["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023"];
  const channels = chart5Data.map(d => d.channel);
  
  // Color scale for quarters
  const quarterColors = d3.scaleOrdinal()
    .domain(quarters)
    .range(['#004BFF', '#00FF85', '#FFAA00', '#FF0009']);

  // Scales
  const y0 = d3.scaleBand()
    .domain(channels)
    .range([0, chartHeight])
    .padding(0.2);

  const y1 = d3.scaleBand()
    .domain(quarters)
    .range([0, y0.bandwidth()])
    .padding(0.05);

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(chart5Data, d => d3.max(d.quarters, q => q.income)) * 1.1])
    .range([0, chartWidth]);

  // X-axis
  svg.append('g')
    .call(d3.axisTop(xScale).tickFormat(d => '$' + d3.format('.1f')(d) + 'M'))
    .selectAll('text')
    .style('font-family', 'Inter, sans-serif')
    .style('font-size', '12px')
    .style('fill', '#CCCCCC');

  // Y-axis (channel names)
  svg.append('g')
    .call(d3.axisLeft(y0))
    .selectAll('text')
    .style('font-family', 'Inter, sans-serif')
    .style('font-size', '12px')
    .style('fill', '#CCCCCC');

  // Draw bars
  chart5Data.forEach(channel => {
    const channelGroup = svg.append('g')
      .attr('transform', `translate(0, ${y0(channel.channel)})`);

    channel.quarters.forEach(quarter => {
      channelGroup.append('rect')
        .attr('x', 0)
        .attr('y', y1(quarter.quarter))
        .attr('width', xScale(quarter.income))
        .attr('height', y1.bandwidth())
        .attr('fill', quarterColors(quarter.quarter))
        .attr('rx', 3)
        .append('title')
        .text(`${channel.channel} - ${quarter.quarter}: $${quarter.income.toFixed(1)}M`);

      // Add value labels inside bars if there's enough space
      if (xScale(quarter.income) > 40) {
        channelGroup.append('text')
          .attr('x', xScale(quarter.income) - 5)
          .attr('y', y1(quarter.quarter) + y1.bandwidth() / 2)
          .attr('dy', '0.35em')
          .attr('text-anchor', 'end')
          .style('fill', '#FFFFFF')
          .style('font-family', 'Inter, sans-serif')
          .style('font-size', '11px')
          .style('font-weight', '600')
          .text(`$${quarter.income.toFixed(1)}M`);
      }
    });
  });

  // X-axis label
  svg.append('text')
    .attr('x', chartWidth / 2)
    .attr('y', -margin.top + 20)
    .attr('text-anchor', 'middle')
    .style('fill', '#CCCCCC')
    .style('font-family', 'Inter, sans-serif')
    .style('font-size', '14px')
    .text('Quarterly Income (Millions USD)');

  // Legend
  const legend = svg.append('g')
    .attr('transform', `translate(${chartWidth + 20}, 0)`);

  quarters.forEach((quarter, i) => {
    const legendItem = legend.append('g')
      .attr('transform', `translate(0, ${i * 25})`);

    legendItem.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', quarterColors(quarter))
      .attr('rx', 3);

    legendItem.append('text')
      .attr('x', 22)
      .attr('y', 12)
      .style('fill', '#CCCCCC')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '12px')
      .text(quarter);
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
    .text('Quarterly Income Analysis - Top 5 Channels (2023)');

  // Add assumptions documentation
  const assumptions = `Assumptions: 1) Income includes ad revenue, sponsorships, and merchandise. 
                      2) Data is estimated based on public reports and industry averages.
                      3) Q4 typically shows highest revenue due to holiday season.
                      4) All values in millions of USD.`;

  svg.append('text')
    .attr('x', 0)
    .attr('y', chartHeight + 30)
    .style('fill', '#999999')
    .style('font-family', 'Inter, sans-serif')
    .style('font-size', '11px')
    .style('font-style', 'italic')
    .text(assumptions);

  // Responsive behavior
  window.addEventListener('resize', function() {
    // In a real implementation, you'd want to redraw the chart on resize
    console.log('Chart5: Consider implementing responsive redraw');
  });
});
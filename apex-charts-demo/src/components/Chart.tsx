import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const MixedChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    const data = [
      { month: 'Jan', revenue: 30, profit: 10, minRange: 10, maxRange: 20, bubbleX: 'Apr', bubbleY: 40, bubbleSize: 15, curve1: 25, curve2: 15 },
      { month: 'Feb', revenue: 40, profit: 20, minRange: 15, maxRange: 25, bubbleX: 'May', bubbleY: 50, bubbleSize: 20, curve1: 30, curve2: 20 },
      { month: 'Mar', revenue: 25, profit: 10, minRange: 20, maxRange: 30, bubbleX: 'Jun', bubbleY: 60, bubbleSize: 25, curve1: 35, curve2: 25 },
      // Add more data points as needed
    ];

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.month))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.revenue, d.profit))])
      .nice()
      .range([height, 0]);

    // Create line generator for dashed line
    const line = d3.line()
      .x(d => xScale(d.month) + xScale.bandwidth() / 2)
      .y(d => yScale(d.revenue))
      .defined(d => !isNaN(d.revenue))
      .curve(d3.curveLinear);

    // Create curved lines
    const curveLine1 = d3.line()
      .x(d => xScale(d.month) + xScale.bandwidth() / 2)
      .y(d => yScale(d.curve1))
      .defined(d => !isNaN(d.curve1))
      .curve(d3.curveCardinal); // Adjust the curve type as needed

    const curveLine2 = d3.line()
      .x(d => xScale(d.month) + xScale.bandwidth() / 2)
      .y(d => yScale(d.curve2))
      .defined(d => !isNaN(d.curve2))
      .curve(d3.curveCardinal); // Adjust the curve type as needed

    // Create range area
    const area = d3.area()
      .x(d => xScale(d.month))
      .y0(d => yScale(d.minRange))
      .y1(d => yScale(d.maxRange))
      .defined(d => !isNaN(d.minRange) && !isNaN(d.maxRange));

    // Create bubbles
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.bubbleX) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.bubbleY))
      .attr('r', d => d.bubbleSize)
      .style('fill', 'rgba(255, 0, 0, 0.5)');

    // Append dashed line path
    svg.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line)
      .style('stroke', 'blue')
      .style('stroke-dasharray', '5,5')
      .style('fill', 'none');

    // Append curved lines
    svg.append('path')
      .datum(data)
      .attr('class', 'curve-line-1')
      .attr('d', curveLine1)
      .style('stroke', 'green')
      .style('fill', 'none');

    svg.append('path')
      .datum(data)
      .attr('class', 'curve-line-2')
      .attr('d', curveLine2)
      .style('stroke', 'orange')
      .style('fill', 'none');

    // Append range area path
    svg.append('path')
      .datum(data)
      .attr('class', 'area')
      .attr('d', area)
      .style('fill', 'rgba(0, 128, 0, 0.3)');

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);
  }, []);

  return (
    <div>
      <h1>Mixed Chart Example (D3.js)</h1>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default MixedChart;

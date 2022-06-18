// Define Drawer Function
const drawScatter = async () => {
  // 1. Access Data
  const data = await d3.json('../data/my_weather_data.json')
  // ## Data Parsers
  const xAccessor = (d) => d.dewPoint
  const yAccessor = (d) => d.humidity
  const colorAccessor = (d) => d.cloudCover

  // 2. Create Chart Dimensions
  // ## Get The Min Between Width And Height
  const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9])

  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // 3. Draw Canvas
  const wrapper = d3
    .select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)

  const bounds = wrapper
    .append('g')
    .style(
      'transform',
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    )

  // 4. Create Scales

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const colorScale = d3
    .scaleLinear()
    .domain(d3.extent(data, colorAccessor))
    .range(['skyblue', 'darkslategrey'])

  // 5. Draw Data

  const dots = bounds
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => xScale(xAccessor(d)))
    .attr('cy', (d) => yScale(yAccessor(d)))
    .attr('r', 4)
    .attr('fill', (d) => colorScale(colorAccessor(d)))
    .attr('tabindex', '0')

  // 6. Draw Peripherals

  const xAxisGenerator = d3.axisBottom().scale(xScale)

  const xAxis = bounds
    .append('g')
    .call(xAxisGenerator)
    .style('transform', `translateY(${dimensions.boundedHeight}px)`)

  const xAxisLabel = xAxis
    .append('text')
    .attr('x', dimensions.boundedWidth / 2)
    .attr('y', dimensions.margin.bottom - 15)
    .attr('fill', 'white')
    .style('font-size', '1rem')
    .html('Dew point (&deg;F)')

  const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4)

  const yAxis = bounds.append('g').call(yAxisGenerator)

  const yAxisLabel = yAxis
    .append('text')
    .attr('x', -dimensions.boundedHeight / 2)
    .attr('y', -dimensions.margin.left + 15)
    .attr('fill', 'white')
    .style('font-size', '1rem')
    .text('Relative humidity')
    .style('transform', 'rotate(-90deg)')
    .style('text-anchor', 'middle')
}

drawScatter()

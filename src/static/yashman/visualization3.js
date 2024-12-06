const margin = { top: 70, right: 30, bottom: 150, left: 80 };
const width = 1000 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3
  .select("#bubble-chart-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Create a dropdown for filtering by year
const dropdown = d3
  .select("#filter-container")
  .append("select")
  .attr("id", "year-filter")
  .style("margin-bottom", "20px");

// Load data
d3.csv("yashman/most_streamed.csv").then((data) => {
  const allData = [];
  data.forEach((d) => {
    const year = +d.released_year;
    const streams = +d.streams;
    const artists = d["artist(s)_name"]
      ? d["artist(s)_name"].split(",").map((a) => a.trim())
      : [];

    artists.forEach((artist) => {
      allData.push({
        track_name: d.track_name ? d.track_name.trim() : "",
        artist: artist,
        released_year: year,
        streams: streams
      });
    });
  });

  const years = Array.from(new Set(allData.map((d) => d.released_year))).sort(
    (a, b) => a - b
  );

  dropdown
    .selectAll("option")
    .data(years)
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .text((d) => d);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background", "#f9f9f9")
    .style("padding", "10px")
    .style("border", "1px solid #ddd")
    .style("border-radius", "4px")
    .style("pointer-events", "none");

  const subtitle = svg
    .append("text")
    .attr("class", "subtitle")
    .attr("x", width / 2)
    .attr("y", -25)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "600")
    .text("Most Streamed Artists in the Selected Year");

  const legendGroup = svg.append("g").attr("class", "legend-group");

  legendGroup
    .append("text")
    .attr("x", width - 200)
    .attr("y", -10)
    .attr("text-anchor", "start")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text("Legend:");

  legendGroup
    .append("circle")
    .attr("cx", width - 180)
    .attr("cy", 10)
    .attr("r", 10)
    .style("fill", d3.interpolateWarm(0.8))
    .style("opacity", 0.8);

  legendGroup
    .append("text")
    .attr("x", width - 160)
    .attr("y", 15)
    .attr("text-anchor", "start")
    .style("font-size", "12px")
    .text("Bubble size & color = Streams");

  const updateChart = (selectedYear) => {
    let yearData = allData.filter((d) => d.released_year === selectedYear);

    if (yearData.length === 0) {
      console.warn(`No data available for Year ${selectedYear}`);
      svg.selectAll("*:not(.subtitle):not(.legend-group)").remove();
      subtitle.text("No Data Available");
      return;
    }

    yearData.sort((a, b) => d3.descending(a.streams, b.streams));

    const MAX_BUBBLES = 25;
    yearData = yearData.slice(0, MAX_BUBBLES);

    const xScale = d3
      .scalePoint()
      .domain(yearData.map((d) => d.artist))
      .range([0, width])
      .padding(0.5);

    const maxStreams = d3.max(yearData, (d) => d.streams);
    const rScale = d3.scaleSqrt().domain([0, maxStreams]).range([5, 50]);

    const colorScale = d3
      .scaleSequential(d3.interpolateWarm)
      .domain([0, maxStreams]);

    const simulation = d3
      .forceSimulation(yearData)
      .force("x", d3.forceX((d) => xScale(d.artist)).strength(1))
      .force("y", d3.forceY(height / 2).strength(0.1))
      .force("collide", d3.forceCollide((d) => rScale(d.streams) + 2))
      .stop();

    for (let i = 0; i < 300; i++) simulation.tick();

    svg.selectAll(".bubble").remove();
    svg.selectAll(".x-axis").remove();
    svg.selectAll(".top-annotation").remove();

    const bubbles = svg.selectAll(".bubble").data(yearData, (d) => d.artist);
    const topArtistData = yearData[0];
    const bubblesEnter = bubbles.enter().append("circle").attr("class", "bubble");

    bubblesEnter
      .merge(bubbles)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => rScale(d.streams))
      .style("fill", (d) => colorScale(d.streams))
      .style("opacity", 0.8)
      .style("stroke", (d) => (d.artist === topArtistData.artist ? "#333" : "none"))
      .style("stroke-width", (d) => (d.artist === topArtistData.artist ? 2 : 0))
      .on("mousemove", (event, d) => {
        tooltip
          .html(
            `<strong>${d.artist}</strong><br>
             Total Streams: ${d.streams.toLocaleString()}<br>
             Most Popular Track: ${d.track_name}`
          )
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY - 28 + "px")
          .style("opacity", 1);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(1000)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);

    const xAxis = svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - 20})`)
      .call(d3.axisBottom(xScale));

    xAxis
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "10px");

    subtitle.text(`Top ${MAX_BUBBLES} Artists in ${selectedYear} by Streams`);

    svg
      .append("text")
      .attr("class", "top-annotation")
      .attr("x", topArtistData.x)
      .attr("y", topArtistData.y - rScale(topArtistData.streams) - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", "#333")
      .text(`Most Streamed: ${topArtistData.artist}`);
  };

  updateChart(years[0]);
  dropdown.on("change", () => {
    const selectedYear = +dropdown.property("value");
    updateChart(selectedYear);
  });
});

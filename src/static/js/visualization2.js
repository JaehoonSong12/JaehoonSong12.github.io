document.addEventListener('DOMContentLoaded', function() {
    const margin2 = {top: 40, right: 40, bottom: 50, left: 60},
          width2 = 800 - margin2.left - margin2.right,
          height2 = 500 - margin2.top - margin2.bottom;
  
    const svg2 = d3.select("#vis2-container")
      .append("svg")
        .attr("width", width2 + margin2.left + margin2.right)
        .attr("height", height2 + margin2.top + margin2.bottom)
      .append("g")
        .attr("transform", `translate(${margin2.left}, ${margin2.top})`);
  
    d3.csv("data/top_10000.csv").then(data => {
      data.forEach(d => {
        d.Danceability = +d.Danceability;
        d.Energy = +d.Energy;
        d.Popularity = +d.Popularity;
      });
  
      data = data.filter(d => !isNaN(d.Danceability) && !isNaN(d.Energy));
  
      const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Danceability))
        .nice()
        .range([0, width2]);
  
      const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Energy))
        .nice()
        .range([height2, 0]);
  
      const colorScale = d3.scaleSequential(d3.interpolateYlGnBu)
        .domain([0, 100]);
  
      // X Axis
      svg2.append("g")
        .attr("transform", `translate(0, ${height2})`)
        .call(d3.axisBottom(xScale));
  
      svg2.append("text")
        .attr("x", width2/2)
        .attr("y", height2 + margin2.bottom - 5)
        .attr("text-anchor", "middle")
        .text("Danceability");
  
      // Y Axis
      svg2.append("g")
        .call(d3.axisLeft(yScale));
  
      svg2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height2/2)
        .attr("y", -margin2.left + 20)
        .attr("text-anchor", "middle")
        .text("Energy");
  
      // Tooltip
      const tooltip2 = d3.select("#vis2-container")
        .append("div")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("padding", "5px 10px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "5px")
        .style("font-size", "12px")
        .style("opacity", 0);
  
      // Circles
      svg2.selectAll("circle")
        .data(data)
        .join("circle")
          .attr("cx", d => xScale(d.Danceability))
          .attr("cy", d => yScale(d.Energy))
          .attr("r", 2.5)
          .attr("fill", d => colorScale(d.Popularity))
          .attr("opacity", 0.7)
        .on("mouseover", (event, d) => {
          tooltip2.style("opacity", 1)
            .html(`<strong>${d["Track Name"]}</strong><br>Popularity: ${d.Popularity}<br>Danceability: ${d.Danceability}<br>Energy: ${d.Energy}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
        })
        .on("mousemove", event => {
          tooltip2
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseleave", () => tooltip2.style("opacity", 0));
  
      // Title
      svg2.append("text")
        .attr("x", width2/2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("Danceability vs. Energy Colored by Popularity");
  
      const defs = svg2.append("defs");
      const linearGradient = defs.append("linearGradient")
        .attr("id", "legend-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%");
  
      linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colorScale(0));
      linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorScale(100));
  
    }).catch(err => {
      console.error("Error loading top_10000.csv:", err);
    });
  });
  
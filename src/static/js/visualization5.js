const style = document.createElement('style');
style.innerHTML = `
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f9f9f9;
  }
  h1 {
    margin: 20px;
    font-size: 24px;
    color: #333;
  }
  .tooltip {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
  .axis text {
    font-size: 12px;
    fill: #555;
  }
  .axis path,
  .axis line {
    stroke: #ccc;
  }
  .legend {
    font-size: 12px;
    cursor: pointer;
  }
  .legend rect {
    stroke-width: 1;
    stroke: #ccc;
  }
`;
document.head.appendChild(style);

// Dimensions and margins
const margin5 = { top: 40, right: 150, bottom: 80, left: 60 };
const width5 = 900 - margin5.left - margin5.right;
const height5 = 500 - margin5.top - margin5.bottom;

// Create SVG canvas
const svgVis5 = d3
  .select("#vis5-container")
  .append("svg")
  .attr("width", width5 + margin5.left + margin5.right)
  .attr("height", height5 + margin5.top + margin5.bottom)
  .append("g")
  .attr("transform", `translate(${margin5.left},${margin5.top})`);

// Tooltip
const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("position", "absolute")
  .style("background", "#ffffff")
  .style("border", "1px solid #ccc")
  .style("padding", "10px")
  .style("border-radius", "5px")
  .style("box-shadow", "0px 0px 5px rgba(0,0,0,0.2)");

// Load and process data
d3.csv("data/spotify_user_research_cleaned_file.csv").then((data) => {
  // Group by genre and age
  const genres = Array.from(new Set(data.map((d) => d.fav_music_genre)));
  const ageGroups = Array.from(new Set(data.map((d) => d.Age))).reverse();

  // Calculate total counts for each genre and percentage breakdowns for each age group
  const genreData = genres.map((genre) => {
    const total = data.filter((d) => d.fav_music_genre === genre).length;
    const percentages = ageGroups.map((age) => {
      const count = data.filter(
        (d) => d.fav_music_genre === genre && d.Age === age
      ).length;
      return { age, percentage: (count / total) * 100 || 0, count };
    });
    return { genre, percentages, total };
  });

  // Set scales
  const xScale = d3
    .scaleBand()
    .domain(genres)
    .range([0, width5])
    .padding(0.2);

  const yScale = d3.scaleLinear().domain([0, d3.max(genreData, (d) => d.total)]).range([height5, 0]);

  const colorScale = d3
    .scaleOrdinal()
    .domain(ageGroups)
    .range(d3.schemeSet2);

  // Add horizontal grid lines
  svgVis5
    .append("g")
    .selectAll("line")
    .data(yScale.ticks(5))
    .join("line")
    .attr("x1", 0)
    .attr("x2", width5)
    .attr("y1", (d) => yScale(d))
    .attr("y2", (d) => yScale(d))
    .attr("stroke", "#e0e0e0")
    .attr("stroke-dasharray", "2,2");

  // Draw axes
  const xAxis = svgVis5
    .append("g")
    .attr("transform", `translate(0,${height5})`)
    .call(d3.axisBottom(xScale).tickSizeOuter(0).tickSizeInner(0));

  xAxis
    .selectAll("path")
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  xAxis
    .selectAll("text")
    .attr("transform", "rotate(-30)")
    .style("text-anchor", "end")
    .style("font-size", "12px");

  svgVis5.append("g").call(d3.axisLeft(yScale).ticks(5));

  // Draw stacked bars
  const bars = svgVis5
    .selectAll(".bar-group")
    .data(genreData)
    .join("g")
    .attr("transform", (d) => `translate(${xScale(d.genre)},0)`);

  bars
    .selectAll("rect")
    .data((d) =>
      d.percentages.map((p, i) => ({
        age: p.age,
        percentage: p.percentage,
        genre: d.genre,
        count: p.count,
        previous: d.percentages.slice(0, i).reduce((sum, x) => sum + x.count, 0),
      }))
    )
    .join("rect")
    .attr("class", (d) => `bar age-${d.age.replace(/~/g, "-")}`)
    .attr("x", 0)
    .attr("y", (d) => yScale(d.previous + d.count)) // Adjust position for stacking
    .attr("width", xScale.bandwidth() - 5)
    .attr("height", (d) => height5 - yScale(d.count)) // Adjust height based on count
    .attr("fill", (d) => colorScale(d.age))
    .style("stroke", "white")
    .style("stroke-width", 1.5)
    .on("mouseover", (event, d) => {
      tooltip
        .html(`
          <div style="font-weight: bold; margin-bottom: 8px;">${d.genre}</div>
          <div>Age Group: <strong>${d.age}</strong></div>
          <div>Count: <strong>${d.count}</strong></div>
          <div>Percentage: <strong>${d.percentage.toFixed(1)}%</strong></div>
        `)
        .style("opacity", 1)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 20}px`);
    })
    .on("mousemove", (event) => {
      tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY - 20}px`);
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });

  // Add legend
  const legend = svgVis5
    .selectAll(".legend")
    .data(ageGroups)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (_, i) => `translate(${width5 + 20},${i * 20})`);

  legend
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", (d) => colorScale(d));

  legend
    .append("text")
    .attr("x", 18)
    .attr("y", 10)
    .text((d) => d)
    .style("fill", "#333")
    .style("font-size", "12px");

  // Add x-axis label
  svgVis5
    .append("text")
    .attr("x", width5 / 2) // Center horizontally
    .attr("y", height5 + margin5.bottom - 20) // Position below x-axis
    .attr("text-anchor", "middle") // Align text to the center
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text("Music Genres");

  // Add y-axis label
  svgVis5
    .append("text")
    .attr("transform", "rotate(-90)") // Rotate text for y-axis
    .attr("x", -height5 / 2) // Center vertically
    .attr("y", -margin5.left + 20) // Position to the left of y-axis
    .attr("text-anchor", "middle") // Align text to the center
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text("Total Respondents");
});

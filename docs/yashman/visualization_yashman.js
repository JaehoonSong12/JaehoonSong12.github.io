document.addEventListener('DOMContentLoaded', function() {
    const margin = { top: 60, right: 60, bottom: 60, left: 120 },
          width = 800 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;
  
    const svg = d3.select("#yashman-vis-container")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    d3.csv("yashman/songs_normalize.csv").then(data => {
      data.forEach(d => {
        d.year = +d.year;
        d.popularity = +d.popularity;
        d.genre = d.genre.split(",")[0].trim();
      });

      data = data.filter(d => d.genre !== "set()");
  
      const filteredData = data.filter(d => d.year >= 1990 && d.year <= 2020);
  
      const genreYearMap = d3.rollups(
        filteredData,
        v => d3.mean(v, d => d.popularity),
        d => d.genre,
        d => d.year
      );
  
      let flatData = [];
      genreYearMap.forEach(([genre, values]) => {
        values.forEach(([year, avgPop]) => {
          flatData.push({ genre, year, avg_popularity: avgPop });
        });
      });
  
      const genreCounts = d3.rollups(filteredData, v => v.length, d => d.genre)
        .sort((a,b) => d3.descending(a[1], b[1]));
      const topGenres = genreCounts.slice(0, 10).map(d => d[0]);
  
      flatData = flatData.filter(d => topGenres.includes(d.genre));
  
      const years = [...new Set(flatData.map(d => d.year))].sort(d3.ascending);
      const genres = [...new Set(flatData.map(d => d.genre))];
  
      const x = d3.scaleBand()
        .domain(years)
        .range([0, width])
        .padding(0.05);
  
      const y = d3.scaleBand()
        .domain(genres)
        .range([0, height])
        .padding(0.05);
  
      const maxPop = d3.max(flatData, d => d.avg_popularity) || 0;
      const color = d3.scaleSequential()
        .interpolator(d3.interpolateBlues)
        .domain([0, maxPop]);
  
      // X Axis
      const xAxisGroup = svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickValues(x.domain().filter((d,i) => !(i%2))));
      xAxisGroup.selectAll("text").attr("fill", "#333");
      xAxisGroup.selectAll("line, path").attr("stroke", "#333");
  
      // Y Axis
      const yAxisGroup = svg.append("g")
        .call(d3.axisLeft(y));
      yAxisGroup.selectAll("text").attr("fill", "#333");
      yAxisGroup.selectAll("line, path").attr("stroke", "#333");
  
      // Axis labels
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "#333")
        .text("Year");
  
      svg.append("text")
        .attr("x", -margin.left + 20)
        .attr("y", -20)
        .attr("text-anchor", "start")
        .attr("fill", "#333")
        .style("font-size", "16px")
        .text("Genre Popularity Over Time");
  
      svg.append("text")
        .attr("transform", `translate(-60, ${height/2}) rotate(-90)`)
        .attr("text-anchor", "middle")
        .attr("fill", "#333")
        .text("Genre");
  
      // Tooltip
      const tooltip = d3.select("#yashman-vis-container")
        .append("div")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("padding", "5px 10px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "5px")
        .style("font-size", "12px")
        .style("opacity", 0);
  
      svg.selectAll("rect")
        .data(flatData)
        .join("rect")
          .attr("x", d => x(d.year))
          .attr("y", d => y(d.genre))
          .attr("width", x.bandwidth())
          .attr("height", y.bandwidth())
          .attr("fill", d => color(d.avg_popularity))
        .on("mouseover", (event, d) => {
          tooltip.style("opacity", 1)
            .html(`<strong>${d.genre}</strong><br>Year: ${d.year}<br>Avg Popularity: ${d.avg_popularity.toFixed(2)}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
        })
        .on("mousemove", event => {
          tooltip.style("left", (event.pageX + 10) + "px")
                 .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseleave", () => tooltip.style("opacity", 0));
  
      // Legend
      const legendWidth = 200;
      const legendHeight = 10;
      const legendX = d3.scaleLinear()
        .domain([0, maxPop])
        .range([0, legendWidth]);
  
      const legend = svg.append("g")
        .attr("transform", `translate(${width - legendWidth - 20}, ${-margin.top/2})`);
  
      const defs = svg.append("defs");
      const linearGradient = defs.append("linearGradient")
        .attr("id", "legend-gradient");
      linearGradient
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%");
      linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", color(0));
      linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color(maxPop));
  
      legend.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#legend-gradient)");
  
      legend.append("g")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(d3.axisBottom(legendX).ticks(5).tickFormat(d3.format(".0f")))
        .selectAll("text").attr("fill", "#333");
      legend.selectAll("line, path").attr("stroke", "#333");
  
      legend.append("text")
        .attr("x", legendWidth/2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("fill", "#333")
        .text("Popularity Scale");
    }).catch(err => {
      console.error("Error loading CSV data: ", err);
    });
  });
  
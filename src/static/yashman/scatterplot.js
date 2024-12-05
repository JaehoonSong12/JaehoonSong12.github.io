d3.csv("songs_normalize.csv").then(function(data) {
    data.forEach(function(d) {
        d.popularity = +d.popularity;
        d.energy = +d.energy;
    });

    const margin = { top: 50, right: 30, bottom: 50, left: 50 };
    const width = document.getElementById("scatterplot").offsetWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#scatterplot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.energy)])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.popularity)])
        .range([height, 0]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
      .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .style("text-anchor", "middle")
        .text("Energy");

    svg.append("g")
        .call(d3.axisLeft(yScale))
      .append("text")
        .attr("x", -40)
        .attr("y", height / 2)
        .style("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Popularity");

    svg.selectAll("circle")
        .data(data)
      .enter().append("circle")
        .attr("cx", d => xScale(d.energy))
        .attr("cy", d => yScale(d.popularity))
        .attr("r", 5)
        .style("fill", "#69b3a2")
        .style("opacity", 0.7);

    const tooltip = svg.append("g")
        .style("visibility", "hidden")
        .style("font-size", "12px");

    tooltip.append("rect")
        .attr("x", 5)
        .attr("y", 5)
        .attr("width", 200)
        .attr("height", 40)
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "rgba(0,0,0,0.7)");

    tooltip.append("text")
        .attr("x", 10)
        .attr("y", 20)
        .style("fill", "#fff");

    svg.selectAll("circle")
        .on("mouseover", function(event, d) {
            tooltip.select("text")
                .text(d.song + " by " + d.artist + ": " + d.popularity);
            tooltip.style("visibility", "visible")
                .attr("transform", "translate(" + (event.pageX + 10) + "," + (event.pageY - 20) + ")");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(200)
                .style("visibility", "hidden");
        });
});

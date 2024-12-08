// Load the data
d3.csv("data/songs_normalize.csv").then(data => {
    // Parse genres and organize data
    const genreHierarchy = { name: "Genres", children: [] };
    const genreMap = new Map(); // To track genre nodes

    data.forEach(d => {
        const genres = d.genre.split(", ").map(g => g.trim());
        let currentNode = genreHierarchy;

        genres.forEach(genre => {
            if (!genreMap.has(genre)) {
                // Create a new node
                const newNode = { name: genre, children: [], songs: [] };
                genreMap.set(genre, newNode);
                currentNode.children.push(newNode);
            }
            // Move to the next level (or current node)
            currentNode = genreMap.get(genre);
        });

        // Attach song data to the leaf node
        currentNode.songs.push(d);
    });

    // Determine the min and max year from the dataset
    const years = data.map(d => +d.year).filter(y => !isNaN(y));
    const minYear = d3.min(years);
    const maxYear = d3.max(years);

    // Create SVG area
    const width = 800, height = 500;
    const svg = d3.select("#genre_evolution_tree").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create tree layout
    const treeLayout = d3.tree().size([width - 100, height - 100]);
    const hierarchy = d3.hierarchy(genreHierarchy, d => d.children);
    treeLayout(hierarchy);

    // Calculate the offset to center the tree
    const xOffset = (width - (d3.extent(hierarchy.descendants(), d => d.x)[1] - d3.extent(hierarchy.descendants(), d => d.x)[0])) / 2;
    const yOffset = (height - (d3.extent(hierarchy.descendants(), d => d.y)[1] - d3.extent(hierarchy.descendants(), d => d.y)[0])) / 2;

    // Add a group to translate the tree
    const treeGroup = svg.append("g")
        .attr("transform", `translate(${xOffset},${yOffset})`);

    // Draw links (branches)
    treeGroup.selectAll("path")
        .data(hierarchy.links())
        .enter()
        .append("path")
        .attr("d", d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y))
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-width", 1.5);

    // Create a tooltip (embedded styling)
    const tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.7)")
        .style("color", "#fff")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    // Draw nodes
    const nodes = treeGroup.selectAll("g")
        .data(hierarchy.descendants())
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    nodes.append("circle")
        .attr("r", 5)
        .attr("fill", d => d.children ? "#007bff" : "#ff6f61")
        .on("mouseover", (event, d) => {
            const songData = d.data.songs.slice(0, 5).map(song =>
                `<strong>${song.artist}</strong>: ${song.song} (${song.year})`
            ).join("<br>");
            
            const moreDataCount = d.data.songs.length > 5 ? `...and ${d.data.songs.length - 5} more` : "";

            tooltip.style("opacity", 1)
                .html(`<strong>${d.data.name}</strong><br>${songData || "No songs"}<br>${moreDataCount}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", () => {
            tooltip.style("opacity", 0);
        });

    // Add labels
    nodes.append("text")
        .attr("dx", -20)
        .attr("dy", +10)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .text(d => d.data.name);

    // Add Y-Axis for time periods
    const yScale = d3.scaleLinear()
        .domain([maxYear, minYear])
        .range([height - 100 + yOffset, yOffset]);

    const yAxis = d3.axisLeft(yScale)
        .ticks(10) // Customize the number of ticks
        .tickFormat(d => `${Math.round(d)}`); // Format ticks as years

    // Append the axis
    svg.append("g")
        .attr("transform", `translate(${xOffset - 20}, 0)`) // Adjust placement
        .call(yAxis);

    // Add Y-Axis label
    svg.append("text")
        .attr("x", xOffset - 50)
        .attr("y", height / 2)
        .attr("transform", `rotate(-90, ${xOffset - 60}, ${height / 2})`)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Years");
});

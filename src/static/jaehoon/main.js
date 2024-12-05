// Load the Spotify data CSV file
d3.csv("top_10000_1950-now.csv").then(data => {
    console.log(data); // Check if data is loaded and formatted correctly in the console

    // Ensure numerical data is parsed correctly
    data.forEach(d => {
        d.Popularity = +d.Popularity;
        d.Energy = +d.Energy;
        d.Danceability = +d.Danceability;
        d.Valence = +d.Valence;
        d.Tempo = +d.Tempo;
        d['Track Duration (ms)'] = +d['Track Duration (ms)'];
        d['Album Release Date'] = new Date(d['Album Release Date']).getFullYear(); // Convert release date to year only
    });

    // Visualization 1: Top Tracks by Popularity and Genre
    createPopularityGenresChart(data);

    // Visualization 2: Energy vs. Popularity by Genre
    createEnergyPopularityGenreChart(data);

    // Visualization 3: Genre Evolution Over Time
    createGenreEvolutionChart(data);

    // Visualization 4: Tempo Trends Over Time
    createTempoTrendsChart(data);
});

function createPopularityGenresChart(data) {
    const topTracks = data.filter(d => d.Popularity > 75);
    const genrePopularity = d3.rollup(topTracks, v => d3.mean(v, d => d.Popularity), d => d['Artist Genres']);
    const genreData = Array.from(genrePopularity, ([genre, popularity]) => ({ genre, popularity }));
    genreData.sort((a, b) => b.popularity - a.popularity);

    const margin = { top: 40, right: 20, bottom: 100, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#popularity-genres-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(genreData.map(d => d.genre))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(genreData, d => d.popularity)])
        .nice()
        .range([height, 0]);

    svg.selectAll("rect")
        .data(genreData)
        .enter()
        .append("rect")
        .attr("x", d => x(d.genre))
        .attr("y", d => y(d.popularity))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.popularity))
        .attr("fill", "#69b3a2");

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g").call(d3.axisLeft(y));

    // Title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Top Genres by Popularity");

    // X-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 70)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Genres");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Popularity");
}

function createEnergyPopularityGenreChart(data) {
    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#energy-popularity-genre-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Energy)])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Popularity)])
        .range([height, 0]);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.Energy))
        .attr("cy", d => y(d.Popularity))
        .attr("r", 4)
        .style("fill", "#69b3a2")
        .style("opacity", 0.6);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    // Title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Energy vs. Popularity by Genre");

    // X-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Energy");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Popularity");
}

















function createGenreEvolutionChart(data) {
    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#genre-evolution-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Step 1: Parse and prepare data for line chart
    const genreYearData = Array.from(d3.group(data, d => d['Album Release Date'], d => d['Artist Genres']),
        ([year, genres]) => ({
            year: +year,
            genres: Array.from(genres, ([genre, records]) => ({ genre, count: records.length }))
        })
    );

    // Flatten data and group by genre
    const genreSeries = d3.group(
        genreYearData.flatMap(d => d.genres.map(genreData => ({
            year: d.year,
            genre: genreData.genre,
            count: genreData.count
        }))),
        d => d.genre
    );

    // Define scales
    const x = d3.scaleLinear()
        .domain(d3.extent(genreYearData, d => d.year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(genreYearData, d => d3.max(d.genres, g => g.count))])
        .nice()
        .range([height, 0]);

    // Define line generator
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.count));

    // Plot each genre's trend line
    genreSeries.forEach((values, genre) => {
        svg.append("path")
            .datum(values)
            .attr("fill", "none")
            .attr("stroke", d3.schemeCategory10[genreSeries.size % 10]) // Categorical color for each genre
            .attr("stroke-width", 1.5)
            .attr("d", line);
    });

    // Add X-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format("d")));

    // Add Y-axis
    svg.append("g").call(d3.axisLeft(y));

    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Genre Evolution Over Time");

    // Add X-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Year");

    // Add Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Number of Songs");
}



















// Function to create Tempo Trends Over Time chart
function createTempoTrendsChart(data) {
    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#tempo-trends-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Aggregate data by year, calculating average tempo
    const tempoByYear = Array.from(
        d3.rollup(data, v => d3.mean(v, d => d.Tempo), d => d['Album Release Date']),
        ([year, avgTempo]) => ({ year, avgTempo })
    ).sort((a, b) => a.year - b.year);

    // Define scales
    const x = d3.scaleLinear()
        .domain(d3.extent(tempoByYear, d => d.year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([d3.min(tempoByYear, d => d.avgTempo), d3.max(tempoByYear, d => d.avgTempo)])
        .nice()
        .range([height, 0]);

    // Add line for average tempo trend
    svg.append("path")
        .datum(tempoByYear)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.year))
            .y(d => y(d.avgTempo))
        );

    // Add X and Y axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format("d")));

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(10).tickFormat(d3.format("d")));
    svg.append("g").call(d3.axisLeft(y));

    // Title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Tempo Trends Over Time");

    // X-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Year");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Average Tempo");
    



    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(10).tickFormat(d3.format("d")));
    svg.append("g").call(d3.axisLeft(y));

    // Title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Tempo Trends Over Time");

    // X-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Year");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Average Tempo");
}
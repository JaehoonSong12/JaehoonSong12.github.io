// **** Functions to call for scaled values ****
// These functions are used to scale the 'year' and 'popularity score' for our scatterplot.

function scaleYear(year) {
    return yearScale(year);  // Uses the yearScale function to convert the year to a pixel value on the x-axis
}

function scalePopularityScore(score) {
    return hrScale(score);  // Uses the hrScale function to convert the popularity score to a pixel value on the y-axis
}

// Define the scale for the x-axis (year), mapping years to pixel values
var yearScale = d3.scaleTime()
    .domain([new Date(2013, 0, 1), new Date(2020, 0, 1)])  // Data from 2013 to 2020
    .range([60, 700]);  // Map to the width of the SVG (leaving margins)

// Define the scale for the y-axis (popularity score), mapping the score to pixel values
var hrScale = d3.scaleLinear()
    .domain([0, 100])  // Popularity scores range from 0 to 100
    .range([340, 20]);  // Invert the scale to place higher values at the top

// Parse dates in the format provided in the CSV
var parseDate = d3.timeParse("%Y-%m-%d");

// Select the SVG element where the scatterplot will be drawn
var svg = d3.select('svg');

// Append x-axis to the SVG
svg.append('g').attr('class', 'x axis')
    .attr('transform', 'translate(0,345)')  // Position at the bottom of the SVG
    .call(d3.axisBottom(yearScale).tickFormat(d3.timeFormat("%Y")));  // Format ticks as years

// Append y-axis to the SVG
svg.append('g').attr('class', 'y axis')
    .attr('transform', 'translate(55,0)')  // Position on the left side of the SVG
    .call(d3.axisLeft(hrScale));  // Use the hrScale for the y-axis

    





// **** Your JavaScript code goes here ****

// **** Add labels and title ****
// Title for the scatterplot (now at the top-center)
svg.append("text")
    .attr("x", 360) // Center it based on the SVG width
    .attr("y", 30) // Position it at the top
    .attr("class", "title")
    .text("Pop Music on Spotify");
// Label for the y-axis (Track Popularity Score)
svg.append("text")
    .attr("class", "label")
    .attr("transform", "rotate(90)")  // Rotate in the opposite direction
    .attr("x", 180)  // Adjust position along y-axis
    .attr("y", -15)  // Fine-tune position on the x-axis
    .text("Track Popularity Score");
// Label for the x-axis (Year)
svg.append("text")
    .attr("class", "label")
    .attr("x", 360)  // Center it based on the SVG width
    .attr("y", 390)  // Position it just below the x-axis
    .text("Year");

// **** Loading and Filtering Data ****
// Load the CSV file and create the scatterplot
d3.csv('./spotify_songs.csv').then(function(data) {
    // Filter the data to only include pop songs released between 2013 and 2020
    var filteredData = data.filter(function(d) {
        let releaseDate = parseDate(d.track_album_release_date);
        return d.playlist_genre === 'pop' && 
               releaseDate >= new Date(2013, 0, 1) && 
               releaseDate <= new Date(2019, 11, 31);
    });
    // Bind data and create groups (<g> elements) for each track
    var groups = svg.selectAll("g.track-group")
        .data(filteredData)
        .enter()
        .append("g")
        .attr("transform", function(d) { return "translate(" + scaleYear(parseDate(d.track_album_release_date)) + "," + scalePopularityScore(d.track_popularity) + ")"; })
        .attr("class", "track-group");
    // Append circle elements to each group
    groups.append("circle")
        .attr("r", 2) // Set radius of circles to 2px
        .attr("class", function(d) { return d.danceability >= 0.75 ? "high-danceability" : "low-danceability"; }); // Assign a class based on danceability
    // Append text elements to each group (initially hidden)
    groups.append("text")
        .attr("class", "track-label")
        .attr("dy", -5)  // Position text above the circle
        .text(function(d) { return d.track_name; });  // Display track name
});

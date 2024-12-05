// Load the CSV file using D3
d3.csv("./spotify_songs_released_2020.csv").then(function(data) {
    // Log the data to verify it's loaded correctly
    console.log(data);

    // Select the div with id 'spotify-artist' to append paragraph elements
    let artistDiv = d3.select("#spotify-artist");

    // Loop over each data entry and append a paragraph element
    data.forEach(function(d) {
        // Construct the text for each paragraph
        let paragraphText = `${d.rank}. ${d.artist}'s ${d.song} with ${d.streams} streams`;

        // Append a paragraph element to the div with the constructed text
        artistDiv.append("p")
            .text(paragraphText)
            // Apply green color to the top 5 artists (rank 1-5)
            .attr("class", d.rank <= 5 ? "highlight" : "");
    });

    // Select the tbody of the table to append rows for each artist's daily streams
    let tableBody = d3.select("#artist-table tbody");

    // Loop over the data again to append rows to the table
    data.forEach(function(d) {
        // Append a new row
        let row = tableBody.append("tr");

        // Append data cells to the row
        row.append("td").text(d.rank);
        row.append("td").text(d.artist);
        row.append("td").text(d.song);
        row.append("td").text(d.daily);
    });
    
    // Further commenting for explaining the CSV loading and manipulation:
    // The D3.csv() function loads the CSV file from the specified path.
    // Once the file is loaded, D3 automatically parses the CSV into an array of objects.
    // Each object represents a row in the CSV, with the column headers as the object keys.
});

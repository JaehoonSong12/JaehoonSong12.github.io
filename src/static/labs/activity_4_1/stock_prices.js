// **** Example of how to create padding and spacing for trellis plot****
// Select the SVG element from the DOM
const svg = d3.select('svg');

// Hand code the svg dimensions, 
// you can also use +svg.attr('width') or +svg.attr('height')
const svgWidth = Number(svg.attr('width'));
const svgHeight = Number(svg.attr('height'));

// Define padding to create space for the trellis plots
const padding = { t: 20, r: 20, b: 60, l: 60 };

// Compute the width and height for each trellis plot in the 2x2 grid
const trellisWidth = svgWidth / 2 - padding.l - padding.r;
const trellisHeight = svgHeight / 2 - padding.t - padding.b;

// As an example for how to layout elements with our variables
// Lets create .background rects for the trellis plots
svg.selectAll('.background')
    .data(['A', 'B', 'C', 'D']) // dummy data
    .enter()
    .append('rect') // Append 4 rectangles
    .attr('class', 'background')
    .attr('width', trellisWidth) // Use our trellis dimensions
    .attr('height', trellisHeight)
    .attr('transform', function (d, i) {
        // Position based on the matrix array indices.
        // i = 1 for column 1, row 0)
        const tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
        const ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
        return `translate(${tx}, ${ty})`;
    });



// **** How to properly load data ****
d3.csv('stock_prices.csv').then(function(dataset) {
    ////////////////////////////////////////// DEBUG
    console.log(dataset);

    // **** Your JavaScript code goes here ****
    // Step 1: Parse the 'date' field into a JavaScript Date object and format the 'price'
    dataset.forEach(function (d) {
        d.date = (d3.timeParse("%Y-%m-%d"))(d.date);  // Convert date string to Date object
        d.price = parseFloat(d.price.slice(1));  // Remove the dollar sign and convert to a number
    });


    // Step 2: Nest (Roll up) the dataset by 'company' using d3.rollup()
    const nestedData = d3.rollup(
        dataset,
        v => v,  // No aggregation, just keep the full array for each company
        d => d.company  // Group by company
    );
    dataset = new d3.InternMap(nestedData); // Create an InternMap from rolled-up data


    // Step 3: Create a trellis plot for each company in the nested data
    const flattenedData = Array.from(dataset.values()).flat(); // Manually flatten the dataset for scales
    // Define scales for the X and Y axes (shared across subplots)
    const xScale = d3.scaleTime()
        .domain(d3.extent(flattenedData, d => d.date))  // Get the min and max date from all companies
        .range([0, trellisWidth]);  // Map to the width of each subplot
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(flattenedData, d => d.price)])  // Get the max price from all companies
        .range([trellisHeight, 0]);  // Invert the Y axis
    // Define a line generator function for the area chart
    const areaGenerator = d3.area()
        .x(d => xScale(d.date))  // X value is the date
        .y0(trellisHeight)  // The base of the area (y0)
        .y1(d => yScale(d.price));  // Y value is the stock price
    // Add gridlines to each trellis plot for readability
    function addGridlines(g) {
        // X-axis grid: Every year
        const gridX = d3.axisBottom(xScale).ticks(d3.timeYear.every(1))  // Yearly ticks
            .tickSize(-trellisHeight).tickFormat('');
        // Y-axis grid: Every 10 units
        const gridY = d3.axisLeft(yScale).ticks(10)
            .tickSize(-trellisWidth).tickFormat('');
        g.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0, ${trellisHeight})`)
            .call(gridX);
        g.append('g')
            .attr('class', 'grid')
            .call(gridY);
    }
    const companies = Array.from(dataset.keys());
    companies.forEach(function (company, i) {
        // Create a group (<g>) element for each subplot
        const g = svg.append('g')
            .attr('transform', function () {
                // Calculate x and y positions for each subplot in the 2x2 grid
                const tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
                const ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
                return `translate(${tx}, ${ty})`;
            })
            .attr('class', `trellis-plot ${company.toLowerCase()}`);
        // Add background rectangles for each subplot
        g.append('rect')
            .attr('class', 'background')
            .attr('width', trellisWidth)
            .attr('height', trellisHeight);
        // Add gridlines to the subplot
        addGridlines(g);
        // Draw the area chart for the company
        g.append('path')
            .datum(dataset.get(company))  // Bind the company's data
            .attr('class', 'area-plot')  // Apply the area plot class from the CSS
            .attr('d', areaGenerator);  // Generate the area chart
        // Add a label for the company in the middle of the subplot
        g.append('text')
            .attr('class', 'company-label')
            .attr('x', trellisWidth / 2)  // Center the text horizontally
            .attr('y', trellisHeight / 2)  // Center the text vertically
            .text(company);
        // Step 4: Add X and Y axes to each subplot
        g.append('g')
            .attr('transform', `translate(0, ${trellisHeight})`)  // Move to the bottom of the plot
            .call(d3.axisBottom(xScale).ticks(d3.timeYear.every(1)));  // Yearly ticks
        g.append('g')
            .call(d3.axisLeft(yScale).ticks(10)); // Y-axis ticks every 10 units
        // Step 5: Add axis labels for each subplot
        g.append('text')
            .attr('class', 'axis-label')
            .attr('x', trellisWidth / 2)
            .attr('y', trellisHeight + padding.b - 20)  // Position just below the X axis
            .text('Date (by Month)');
        g.append('text')
            .attr('class', 'axis-label')
            .attr('x', -trellisHeight / 2)  // Rotate and center along Y axis
            .attr('y', -padding.l / 2 - 10)
            .attr('transform', 'rotate(-90)')
            .text('Stock price (USD)');
    });


    ////////////////////////////////////////// DEBUG
    console.log(dataset);
});
// Remember code outside of the data callback function will run before the data loads
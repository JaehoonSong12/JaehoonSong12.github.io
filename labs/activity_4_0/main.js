// Data for different sectors and companies
// Each sector contains a list of companies with their stock prices and positions
var stockData = [
    {
        key: 'TECHNOLOGY', pos: [200, 105], value: {
            total: 397.08,  // Total stock value for the sector
            companies: [
                { company: "MSFT", price: 77.74, pos: [-60, 0], color: '#85b623' }, // Microsoft stock data
                { company: "IBM", price: 159.48, pos: [12, -48], color: '#236cb0' }, // IBM stock data
                { company: "AAPL", price: 159.86, pos: [15, 45], color: '#666666' }  // Apple stock data
            ]
        }
    },
    {
        key: 'FOOD & DRINK', pos: [85, 290], value: {
            total: 266.78, // Total stock value for the sector
            companies: [
                { company: "KO", price: 46.47, pos: [50, 0], color: '#e32232' },  // Coca-Cola stock data
                { company: "MCD", price: 165.07, pos: [-18, -20], color: '#fed430' }, // McDonald's stock data
                { company: "SBUX", price: 55.24, pos: [20, 45], color: '#0e7042' }  // Starbucks stock data
            ]
        }
    },
    {
        key: 'AIRLINES', pos: [320, 290], value: {
            total: 183.51, // Total stock value for the sector
            companies: [
                { company: "DAL", price: 52.88, pos: [0, -35], color: '#980732' },  // Delta Airlines stock data
                { company: "AAL", price: 51.95, pos: [35, 10], color: '#1f98ce' },  // American Airlines stock data
                { company: "JBLU", price: 20.08, pos: [7, 45], color: '#101e40' },  // JetBlue stock data
                { company: "LUV", price: 58.60, pos: [-35, 15], color: '#d81f2a' }  // Southwest Airlines stock data
            ]
        }
    }
];

// Using D3.js's rollup function to group and process stock data (Updated for D3 V6)
// This section creates a hierarchical data structure, grouping companies by sector and summing their stock prices
var nested = d3.rollup(
    stockData,
    v => { return { values: { companies: v, total: d3.sum(v, d => d.price) } }; }, // Calculate the total stock price for each group
    d => { return { key: d.sector } } // Group by the sector
);

// Scale for sector circles based on total stock value
// We use a square root scale for the size of the sector circles
var rSectorScale = d3.scaleSqrt()
    .domain([0, 397.08]) // Domain is the range of total stock values
    .range([0, 100]);     // Range is the pixel radius of the sector circles

// Scale for company circles based on individual stock price
// Similar to the sector scale but applied to company circles
var rScale = d3.scaleSqrt()
    .domain([0, 165.07]) // Domain is the range of individual stock prices
    .range([0, 45]);     // Range is the pixel radius of the company circles

// Select the SVG element from the HTML where we will draw the sectors and companies
var svg = d3.select('svg');

// Create groups for each sector (TECHNOLOGY, FOOD & DRINK, AIRLINES)
// Each sector will have a separate <g> element, and its position is set using the 'transform' attribute
var sectorG = svg.selectAll('.sector')
    .data(stockData) // Bind stock data to the sectors
    .enter()         // Enter the data to create new elements
    .append('g')     // Append a <g> (group) element for each sector
    .attr('class', 'sector')  // Assign class 'sector' to each group for styling
    .attr('transform', function(d) {
        return 'translate(' + d.pos + ')';  // Position each sector based on its 'pos' property
    })
    .style('fill', '#ccc');  // Set default fill color for the sector circles

// Append circles for each sector, their size is based on the total stock value of the sector
sectorG.append('circle')
    .attr('r', function(d) {
        return rSectorScale(d.value.total); // Radius based on the total stock value
    })
    .style('fill', '#ccc');  // Light grey color for the sector circles

// Append sector names as text labels
sectorG.append('text')
    .text(function(d) {
        return d.key;  // Use the sector name (key) as the text
    })
    .attr('y', function(d) {
        return rSectorScale(d.value.total) + 16;  // Position the text below the sector circle
    })
    .attr('dy', '0.3em')  // Fine-tuning the vertical alignment
    .style('text-anchor', 'middle')  // Center the text horizontally
    .style('fill', '#aaa')  // Light grey text color
    .style('font-size', 14)  // Set font size
    .style('font-family', 'Open Sans');  // Set font family

// Create groups for each company within each sector
var companyG = sectorG.selectAll('.company')
    .data(function(d) {
        return d.value.companies;  // Bind the company data from each sector
    })
    .enter()  // Enter the company data to create new elements
    .append('g')  // Append a <g> (group) element for each company
    .attr('class', 'company')  // Assign class 'company' to each group for styling
    .attr('transform', function(d) {
        return 'translate(' + d.pos + ')';  // Position each company circle based on its 'pos' property
    });

// Append circles for each company
companyG.append('circle')
    .attr('r', function(d) {
        return rScale(d.price);  // Radius based on the company's stock price
    })
    .style('fill', function(d) {
        return d.color;  // Use the company-specific color for each circle
    });

// Append company names as text labels
companyG.append('text')
    .text(function(d) {
        return d.company;  // Use the company name as the text
    })
    .attr('dy', '0.3em')  // Fine-tuning the vertical alignment
    .style('text-anchor', 'middle')  // Center the text horizontally
    .style('fill', '#fff')  // White text color
    .style('font-size', 12)  // Set font size
    .style('font-family', 'Open Sans');  // Set font family

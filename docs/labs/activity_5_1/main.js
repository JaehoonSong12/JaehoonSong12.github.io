const svg = d3.select("svg");
const svgWidth = Number(svg.attr("width"));
const svgHeight = Number(svg.attr("height"));

// The prepared SVG elements for the chart axis and bars, feel free to modify the code
// to best suit your needs
const padding = { top: 24, right: 16, bottom: 24, left: 228 };

// Predefined SVG groups for axes and bars
const axisGroup = svg.append("g").attr("class", "axis-group");
const barGroup = svg.append("g").attr("class", "bar-group").attr("transform", "translate(0, 24)");

/**
 * Create or update the chart with the given parameters.
 * 
 * @param {Array<Object.<string, string | number>>} data The data to use for the chart, the "Calories" fields are already converted to numbers
 * @param {"Tall" | "Grande" | "Venti" | "Short"} size One of the options in "Size" column
 * @param {"2% Milk" | "Nonfat Milk" | "Soy Milk" | "Whole Milk" | "n/a"} milkType One of the options in "Milk type" column
 */
function updateChart(
    data,
    size,
    milkType
) {
    // TODO - Activity 1: Your code for rendering chart goes here
    console.log(data, size, milkType);

    // Define all possible beverages for consistent bar count
    const allBeverages = Array.from(new Set(data.map(d => d.Beverage)));

    // Filter and sort data based on selected size and milk type, using placeholders for missing items
    const filteredData = allBeverages.map(beverage => {
        const match = data.find(d => d.Beverage === beverage && d.Size === size && d["Milk type"] === milkType);
        return match ? match : { Beverage: beverage, Calories: 0, placeholder: true };  // Placeholder if no match found
    }).sort((a, b) => b.Calories - a.Calories);  // Sort by Calories in descending order

    // Set up scales
    const xScale = d3.scaleLinear()
                     .domain([0, 550]) // Max calories
                     .range([padding.left, svgWidth - padding.right]);

    const yScale = d3.scaleBand()
                     .domain(filteredData.map(d => d.Beverage))  // Use sorted beverage list
                     .range([0, svgHeight - padding.top - padding.bottom])
                     .padding(0.4);

    // Create an update selection for bars, using the beverage name as the key
    const bars = barGroup.selectAll("rect")
                         .data(filteredData, d => d.Beverage);

    // ENTER new bars
    bars.enter()
        .append("rect")
        .merge(bars)  // Merge enter and update
        .attr("x", padding.left)
        .attr("y", d => yScale(d.Beverage))
        .attr("width", d => xScale(d.Calories) - padding.left)
        .attr("height", yScale.bandwidth())
        .attr("opacity", d => d.placeholder ? 0 : 1);  // Hide placeholder bars

    // EXIT old bars
    bars.exit().remove();

    // Redraw axes as before
    axisGroup.selectAll("*").remove();

    // x-axis (Top) with grid line
    axisGroup.append("g")
        .attr("transform", `translate(0, ${padding.top})`)
        .call(d3.axisTop(xScale).ticks(10)
            .tickSize(-svgHeight + padding.top + padding.bottom));  // Set grid line height
            
    axisGroup.select(".domain").remove();  // Remove axis line

    // x-axis (Bottom) with labels and domain line removed
    axisGroup.append("g")
        .attr("transform", `translate(0, ${svgHeight - padding.bottom})`)
        .call(d3.axisBottom(xScale).ticks(10))
        .call(g => g.select(".domain").remove());

    // y-axis with labels (only for non-placeholder items)
    axisGroup.append("g")
        .attr("transform", `translate(${padding.left - 10}, 0)`)
        .selectAll(".y-label")
        .data(filteredData.filter(d => !d.placeholder))  // Exclude placeholder bars
        .enter()
        .append("text")
        .attr("x", 0)
        .attr("y", d => yScale(d.Beverage) + yScale.bandwidth() + 20)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("class", "y-label")
        .html(d => decorateBeverageName(d.Beverage));
}

/**
 * Use regex to match the beverage name in the format of "Beverage Name (Some Annotation)"
 * and split them into two lines to display in SVG
 * 
 * @param {string} beverageName the beverage name in the format of "Beverage Name (Some Annotation)" or "Beverage Name"
 * @returns {string} a snippet of SVG text element with two spans for the extracted beverage name and annotation
 */
function decorateBeverageName(beverageName) {
    const matches = /^([\w\W]+)\s+\(([\w\W]+)\)$/.exec(beverageName);
    if (matches) {
        return `<tspan x="4px" dy="-0.25em">${matches[1]}</tspan>
                <tspan x="0" dy="1.0em" class="annotation">${matches[2]}</tspan>`;
    }
    return `<tspan x="0">${beverageName}</tspan>`;
}


/**
 * Load the data and initialize the controls
 */
async function loadDataAndInitializeControls() {
    const data = await d3.csv("starbucks_drinks.csv", d => ({ ...d, "Calories": Number(d["Calories"]) }));
    
    // Find the unique values for Size and Milk type
    const sizeOptions = [...new Set(data.map(d => d["Size"]))];
    const milkTypeOptions = [...new Set(data.map(d => d["Milk type"]))].sort();

    let selectedSize = sizeOptions[0];
    let selectedMilkType = milkTypeOptions[0];

    // Initialize the size and milk type radio buttons
    const sizeFieldsetElement = document.querySelector("#size-fieldset");
    sizeFieldsetElement.innerHTML = sizeOptions.map(d => `
        <input type="radio" value="${d}" name="size" id="${d}" ${d === selectedSize ? "checked" : ""}>
        <label for="${d}">${d}</label>
    `).join("");

    // Add onchange event listeners to the radio buttons
    sizeFieldsetElement.addEventListener("change", () => {

        // The only selected child will look like <input id="..." name="size" value="..." checked>
        // So we can use the :checked to find the selected radio button
        selectedSize = sizeFieldsetElement.querySelector("input:checked").value;

        // TODO - Activity 2: Handle the size change event
        console.log(selectedSize);





    });

    // Initialize the milk type radio buttons
    const milkFieldSetElement = document.querySelector("#milk-fieldset");
    milkFieldSetElement.innerHTML = milkTypeOptions.map(d => `
        <input type="radio" value="${d}" name="milk" id="${d}" ${d === selectedMilkType ? "checked" : ""}>
        <label for="${d}">${d}</label>
    `).join("");

    // TODO - Activity 2: Add event listener for the milk type radio buttons






    updateChart(data, selectedSize, selectedMilkType);
}


await loadDataAndInitializeControls();

// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold the chart,
// and shift the latter by left and top margins
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data
d3.csv("assets/data/data.csv")
    .then(function(stateData) {

        // Step 1: Parse Data/Cast as numbers
        stateData.forEach(function(data) {
            data.income = +data.income;
            data.obesity = +data.obesity;
        });

        // Step 2: Create scale functions
        // xLinearScale
        var incomeLinearScale = d3.scaleLinear()
            .domain([35000, d3.max(stateData, d => d.income + 5000)])
            .range([0, width]);

        // yLinearScale
        var obesityLinearScale = d3.scaleLinear()
            .domain([18, d3.max(stateData, d => d.obesity + 1)])
            .range([height, 0]);

        // Step 3: Create axis functions
        // bottomAxis
        var incomeAxis = d3.axisBottom(incomeLinearScale);
        // leftAxis
        var obesityAxis = d3.axisLeft(obesityLinearScale);

        // Step 4: Append Axes to the chart
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(incomeAxis);

        chartGroup.append("g")
            .call(obesityAxis);

        // Step 5: Create circles
        chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => incomeLinearScale(d.income))
        .attr("cy", d => obesityLinearScale(d.obesity))
        .attr("r", 15)
        .classed("stateCircle", true);

        // Step 6: Text in circles
        chartGroup.selectAll(".stateText")
        .data(stateData)
        .enter()
        .append("text")
        .attr("x", d => incomeLinearScale(d.income))
        .attr("y", d => obesityLinearScale(d.obesity))
        .attr("dy", 5)
        .text(function(d){
            return d.abbr
        })
        .classed("stateText", true);

        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height/1.75))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Obese (%)");

        chartGroup.append("text")
            .attr("transform", `translate(${width/2.65}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Household Income (Median)");
    });
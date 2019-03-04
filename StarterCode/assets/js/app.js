// @TODO: YOUR CODE HERE!

//SVG Height and Width
var svgWidth = 750;
var svgHeight = 500;

// Margins of SVG object
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

//Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

//Select HTML body element and append chart to it and set the dimensions
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//Appending the group area and setting it's margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Load in the data.csv
d3.csv("../data/data.csv").then(function(Hdata) {
    
    console.log(Hdata);

    //Pull data from the csv
    Hdata.forEach(function(data){
        data.smokes = +data.smokes;
        data.poverty = +data.poverty;
    });
    
    //Create the xScale for the % Poverty
    var xPovertyScale = d3.scaleLinear()
        .domain([d3.min(Hdata, d => d.poverty) * 0.8, d3.max(Hdata, d => d.poverty) * 1.2])
        .range([0, chartWidth]);
        
    //Create the yScale for the % Health Care
    var ySmokeScale = d3.scaleLinear()
        .domain([d3.min(Hdata, d => d.smokes) * 0.8, d3.max(Hdata, d => d.smokes * 1.2)])
        .range([chartHeight, 0]);
    
    //Store the bottom and left axis into vars using d3
    var bottomAxis = d3.axisBottom(xPovertyScale);
    var leftAxis = d3.axisLeft(ySmokeScale);

    //Add the axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);

    //Place the data into the cirlce variables 
    var circles = chartGroup.selectAll("circle")
        .data(Hdata)
        .enter()
        .append("circle")
        .attr("cx", d => xPovertyScale(d.poverty))
        .attr("cy", d => ySmokeScale(d.smokes))
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", ".5");

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return(`${d.state}<br>% Poverty: ${d.poverty}<br>% Smoking: ${d.smokes}`)
        })
    
    chartGroup.call(toolTip);

    circles.on("click", function(data){
        toolTip.show(data, this);
    })
        .on("mouseout", function(data, index){
            toolTip.hide(data);
        });

    // Add the axes labels
    chartGroup.append("text")    
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left +40)
        .attr("x", 0 -(chartHeight / 2))
        .attr("class", "axistext")
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Smokers (%)")
    
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top +30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)")
});
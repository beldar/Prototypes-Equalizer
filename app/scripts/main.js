var categories = [
    {id: 1, name: 'Health', value: 0, color: '#90bf5e'},
    {id: 2, name: 'Sports', value: 10, color: '#ed5565'},
    {id: 3, name: 'Wealth', value: 20, color: '#4fc1e9'},
    {id: 4, name: 'Hobbies', value: 50, color: '#ac92ec'},
    {id: 5, name: 'Lifestyle', value: 90, color: '#ec87c0'},
    {id: 6, name: 'News', value: -10, color: '#5d9cec'},
    {id: 7, name: 'Entertainment', value: -40, color: '#48cfad'},
    {id: 8, name: 'Home', value: -50, color: '#fc6e51'},
    {id: 9, name: 'Travel', value: -90, color: '#ffce54'},
];
var links = [
    {"source":0,"target":1,"value":1},
    {"source":1,"target":2,"value":1},
    {"source":2,"target":3,"value":1},
    {"source":3,"target":4,"value":1},
    {"source":4,"target":5,"value":1},
    {"source":5,"target":6,"value":1},
    {"source":6,"target":7,"value":1},
    {"source":7,"target":8,"value":1}
];
var width = 600;
var height = 400;
var xW = width / categories.length;
var yW = height / 100;
var radius = 20;

var getCX = function(d) {
    return (d.id * xW) - (xW/2);
};
var getCY = function(d) {
    return (height / 2) + (d.value);
};

var svg = d3.select("#equalizer")
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height);

var scale = d3.scale.linear()
    .domain([0, 100])
    .range([0, 100]);

update(categories);

function update(categories) {
    console.log(categories);

//---- Links ----//
    var lines = svg.selectAll(".link")
        .data(links);

    var lineShadows = svg.selectAll(".link-shadow")
        .data(links);

    //** Enter **//
    //Shadow
    lineShadows
        .enter()
        .append('line')
            .attr('class', 'link-shadow');
    //Links
    lines
        .enter()
        .append('line')
            .attr('class', 'link');

    //** Enter + Update **//
    //Shadow
    lineShadows
        .transition()
        .attr("x1", function(d) { return getCX(categories[d.source]) })
        .attr("y1", function(d) { return getCY(categories[d.source])+3 })
        .attr("x2", function(d) { return getCX(categories[d.target]) })
        .attr("y2", function(d) { return getCY(categories[d.target])+3 });

    //Links
    lines
        .transition()
        .attr("x1", function(d) { return getCX(categories[d.source]) })
        .attr("y1", function(d) { return getCY(categories[d.source]) })
        .attr("x2", function(d) { return getCX(categories[d.target]) })
        .attr("y2", function(d) { return getCY(categories[d.target]) });

    //** Exit **//
    lineShadows.exit().remove();
    lines.exit().remove();

//---- Circles ----//
    var circles = svg.selectAll(".circle")
        .data(categories);

    var circleShadows = svg.selectAll(".circle-shadow")
        .data(categories);

    //** Enter **//
    //Shadow
    circles
        .enter()
        .append("circle")
        .attr('r', radius)
        .attr('class', 'circle-shadow')
        .style('fill', function(d){ return d.color; });

    //Points
    circleShadows
        .enter()
        .append("circle")
        .attr('r', radius)
        .attr('class', 'circle')
        .style('fill', function(d){ return d.color; });

    //** Enter + Update **//
    //Shadow
    circleShadows
        .transition()
        .attr('cx', function(d){ return getCX(d); })
        .attr('cy', function(d){ return getCY(d)+3; });

    //Points
    circles
        .transition()
        .attr('cx', function(d){ return getCX(d); })
        .attr('cy', function(d){ return getCY(d); });

    //** Exit **//
    circleShadows.exit().remove();
    circles.exit().remove();
}

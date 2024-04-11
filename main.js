// Load the CSV data
d3.csv("cleaned_movies.csv").then(function(data) {
    // Parse 'year' to date format
    data.forEach(function(d) {
        d.year = new Date(d.year);
    });
  
    // Group data by year and count the number of movies for each year
    var moviesByYear = {};
    data.forEach(function(d) {
        var year = d.year.getFullYear();
        if (!moviesByYear[year]) {
            moviesByYear[year] = 0;
        }
        moviesByYear[year]++;
    });
  
    // Convert the grouped data to an array of objects
    var moviesData = Object.keys(moviesByYear).map(function(year) {
        return { year: new Date(year), count: moviesByYear[year] };
    });
  
    // Set up dimensions
    var margin = {top: 30, right: 30, bottom: 40, left: 60},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
  
    // Create SVG element
    var svg = d3.select("#chart-container")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    // Define scales
    var x = d3.scaleTime()
              .domain(d3.extent(moviesData, function(d) { return d.year; }))
              .range([0, width]);
  
    var y = d3.scaleLinear()
              .domain([0, d3.max(moviesData, function(d) { return d.count; })])
              .nice()
              .range([height, 0]);
  
    // Define axes
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);
  
    // Draw axes
    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);
  
    svg.append("g")
       .attr("class", "y axis")
       .call(yAxis);
  
    // Draw line
    var line = d3.line()
                 .x(function(d) { return x(d.year); })
                 .y(function(d) { return y(d.count); });
  
    svg.append("path")
       .datum(moviesData)
       .attr("class", "line")
       .attr('fill', 'none')
       .attr('stroke', 'steelblue')
       .attr('stroke-width', 2)
       .attr("d", line);    
  
    // Add title and labels
    svg.append("text")
       .attr("class", "title")
       .attr("x", width / 2)
       .attr("y", -margin.top / 2)
       .style("text-anchor", "middle")
       .text("Number of Movies Over Time");
  
    svg.append("text")
       .attr("class", "label")
       .attr("transform", "rotate(-90)")
       .attr("x", -height / 2)
       .attr("y", -margin.left + 15)
       .style("text-anchor", "middle")
       .text("Number of Movies");
  
    svg.append("text")
       .attr("class", "label")
       .attr("x", width / 2)
       .attr("y", height + margin.bottom - 5)
       .style("text-anchor", "middle")
       .text("Year");
  });
  
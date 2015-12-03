function updateRepPlot() {


    var dataList;
    d3.json('/getRepresentativePlotJson', function (data) {
        showScatter(data);
    })
}

/**
 * It is the main callback function that
 * is called after the JSON data is parsed.
 */
function showScatter(jsonData) {

    dataList = jsonData.datalist;

    //set the stats
    d3.select("#stats").html(
        "<p> <b> Data-Set Name: </b>" + jsonData.datasetName +
        "<p> <b> No. of rows: </b>" + jsonData.rows +
        "<p> <b> No. of columns: </b>" + jsonData.cols +
        "<p> <b> Current X: </b>" + jsonData.columnNames[jsonData.currentX] +
        "<p> <b> Current Y: </b>" + jsonData.columnNames[jsonData.currentY] +
        "<p> <b> Current Category: </b>" + jsonData.columnNames[jsonData.currentZ]
    )

    //console.log(jsonData.columnNames)
    //set the column names
    var stringX = "";
    stringX += '<option value="'+jsonData.currentX+'">'+jsonData.columnNames[jsonData.currentX]+'</option>'
    for (var i = 0; i < jsonData.columnNames.length; i++) {
        if(i!=jsonData.currentX)
        stringX += '<option value="'+i+'">'+jsonData.columnNames[i]+'</option>'
    }
    var stringY = "";
    stringY += '<option value="'+jsonData.currentY+'">'+jsonData.columnNames[jsonData.currentY]+'</option>'
    for (var i = 0; i < jsonData.columnNames.length; i++) {
        if(i!=jsonData.currentY)
        stringY += '<option value="'+i+'">'+jsonData.columnNames[i]+'</option>'
    }
    var stringZ = "";
    stringZ += '<option value="'+jsonData.currentZ+'">'+jsonData.columnNames[jsonData.currentZ]+'</option>'
    for (var i = 0; i < jsonData.columnNames.length; i++) {
        if(i!=jsonData.currentZ)
        stringZ += '<option value="'+i+'">'+jsonData.columnNames[i]+'</option>'
    }
    d3.select("#xOptions").html(stringX)
    d3.select("#yOptions").html(stringY)
    d3.select("#zOptions").html(stringZ)



    //function to get x Value from JSON Object
    xVals = function (d) {
        return d.xValue;
    }

    //function to get y Value from JSON Object
    yVals = function (d) {
        return d.yValue;
    }

    //function to get category name
    categoryVals = function (d) {
        return d.category;
    }

    var margin = {top: 30, right: 30, bottom: 40, left: 50}

    var height = 400 - margin.top - margin.bottom,
        width = 600 - margin.left - margin.right,
        barWidth = 50,
        barOffset = 5;

    // will be later used to set item color back to original after mouseout event
    var tempColor;

    //setting y-scale to fit in the svg window
    var yScale = d3.scale.linear()
        .domain(d3.extent(dataList, yVals))
        .range([height, 0]);

    //setting x-scale to fit in the svg window
    var xScale = d3.scale.linear()
        .domain(d3.extent(dataList, xVals))
        .range([0, width]);

    //constructing array of colors
    var rgbArray = [];


    //var rgbArray = ["Aqua","Aquamarine","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
    var rgbArray = ["BlueViolet", "BurlyWood", "Green", "Yellow", "Red", "Yellow", "Black", "Violet"]
    //setting up a colorScale
    var colorScale = d3.scale.ordinal()
        //.domain(["Alpha", "Beta", "Gamma", "Delta", "Epsa"])
        .range(rgbArray);

    //for debug purposes
    console.log(d3.extent(dataList, xVals)[1])

    //styling the tooltip
    var tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0)

    //main scatter plot
    var myChart = d3.select('#chart').append('svg')
        .attr('id', "repPlot")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .selectAll('circle').data(dataList)
        .enter().append('circle')
        .style('fill', function (d, i) {
            return colorScale(d.category);
        })
        .attr('r', 0)
        .attr('cx', function (d) {
            return xScale(xVals(d))
        })
        .attr('cy', function (d) {
            return yScale(yVals(d))
        })

        .on('mouseover', function (d) {
            //display tooltip on mouseover
            tooltip.transition()
                .style('opacity', .9)

            //content of tooltip
            tooltip.html("x: " + xVals(d) + " y: " + yVals(d) + " category: " + categoryVals(d))
                .style('left', (d3.event.pageX - 35) + 'px')
                .style('top', (d3.event.pageY - 30) + 'px')

            //saving current color
            tempColor = this.style.fill;

            //changing color and opacity
            d3.select(this)
                .style('opacity', .5)
                .style('fill', 'blue')
        })

        .on('mouseout', function (d) {
            //after mouseout the color needs to be reset
            d3.select(this)
                .style('opacity', 1)
                .style('fill', tempColor);

            //hide tooltip
            tooltip.transition()
                .style('opacity', 0);


        })

    //load the points animatedly
    myChart.transition()
        .attr('r', 4)
        .delay(function (d, i) {
            return i * 10;
        })
        .duration(100)
        .ease('bounce')

    //--------------------------------AXIS------------------------------------------

    //Y-Axis
    var vAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(10)


    var vGuide = d3.select('svg').append('g')
    vAxis(vGuide)
    vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
    vGuide.selectAll('path')
        .style({fill: 'none', stroke: "#000"})
    vGuide.selectAll('line')
        .style({stroke: "#000"})


    //X Axis or Horizontal Axis
    var hAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(10)


    var hGuide = d3.select('svg').append('g')
    hAxis(hGuide)
    hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
    hGuide.selectAll('path')
        .style({fill: 'none', stroke: "#000"})
    hGuide.selectAll('line')
        .style({stroke: "#000"});

    d3.select("#chart svg")
        .append("rect")
        .attr("id", "userRect");


    //----------------------AXES LABELS----------------------------

    //svg_divs = d3.selectAll('svg')
    //svg_divs.append("text")      // text label for the x axis
    //    .attr("x", width/2 )
    //    .attr("y", height )
    //    .style("text-anchor", "middle")
    //    .text("Date");
    //
    //svg_divs.append("g")         // Add the X Axis
    //    .attr("class", "x axis")
    //    .attr("transform", "translate(0," + height + ")")
    //    .call(xAxis);
    //
    //
    //svg_divs.append("g")         // Add the Y Axis
    //    .attr("class", "y axis")
    //    .call(yAxis);


    //----------------------DRAWING USER RECTANGLE------------------

    var drawing = false;
    var drawn = false;
    var mouseX;
    var mouseY;
    d3.select("svg")
        .on("mousedown", function () {
            var coordinates = [0, 0];
            coordinates = d3.mouse(this);
            mouseX = coordinates[0];
            mouseY = coordinates[1];
            drawing = true;
            d3.select(this)
                .on("mousemove", function () {
                    if (drawing == false)
                        return;
                    var coordinatesMove = [0, 0];
                    coordinatesMove = d3.mouse(this);
                    x = coordinatesMove[0];
                    y = coordinatesMove[1];

                    userXStart = xScale.invert(mouseX - 50)
                    userYStart = yScale.invert(mouseY - 30)

                    userXEnd = xScale.invert(x - 50)
                    userYEnd = yScale.invert(y - 30)


                    d3.select("#userRect")
                        .style('fill', 'red')
                        .style('stroke', 'black')
                        .style('stroke-width', '3')
                        .attr('width', function () {
                            return Math.abs(mouseX - x);
                        })
                        .attr('x', mouseX)
                        .attr('height', function () {
                            return Math.abs(mouseY - y);
                        })
                        .attr('y', mouseY)
                        .style('opacity', 0.1);
                    console.log(x + " " + y);
                    d3.select(this).on("mouseup", function () {
                        drawing = false;

                    })

                })
            if (drawing == false)
                return;

        })
        .on("click", function () {
            var coordinates = [0, 0];
            coordinates = d3.mouse(this);
            mouseX = coordinates[0];
            mouseY = coordinates[1];
            //window.alert(userXStart + " " + userYStart + " " + userXEnd + " " + userYEnd);
            $("#userXStart").text(userXStart);
            $("#userYStart").text(userYStart);
            $("#userXEnd").text(userXEnd);
            $("#userYEnd").text(userYEnd);
            drawing = false;
        })
}






















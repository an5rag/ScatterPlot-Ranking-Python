/**
 * Created by an5ra on 11/16/2015.
 */

function updateResultsPlot() {
    d3.json('/getResultsPlotJson', function (data){
        showResultsScatter1(data);
        showResultsScatter2(data);
        showResultsScatter3(data);
    })
}

/**
 * It is the main callback function that
 * is called after the JSON data is parsed.
 */
function showResultsScatter1(jsonData) {

    dataList = jsonData.datalist1;
    console.log(dataList)


    //function to get x Value from JSON Object
    xVals = function (d) {
        return d.xValue;
    };

    //function to get y Value from JSON Object
    yVals = function (d) {
        return d.yValue;
    };

    //function to get category name
    categoryVals = function (d) {
        return d.category;
    };

    var margin = {top: 30, right: 30, bottom: 40, left: 50};

    var height = 200 - margin.top - margin.bottom,
        width = 300 - margin.left - margin.right,
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
    var rgbArray = ["BlueViolet", "BurlyWood", "Green", "Yellow", "Red", "Yellow", "Black", "Violet"];
    //setting up a colorScale
    var colorScale = d3.scale.ordinal()
        //.domain(["Alpha", "Beta", "Gamma", "Delta", "Epsa"])
        .range(rgbArray);

    //for debug purposes
    console.log(d3.extent(dataList, xVals)[1]);

    //styling the tooltip
    var tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0);

    //main scatter plot
    var myChart = d3.selectAll('#results_1').append('svg')
        .classed({'resultsPlotSvg1':true, 'resultsPlotSvg':true})
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
                .style('opacity', .9);

            //content of tooltip
            tooltip.html("x: " + xVals(d) + " y: " + yVals(d) + " category: " + categoryVals(d))
                .style('left', (d3.event.pageX - 35) + 'px')
                .style('top', (d3.event.pageY - 30) + 'px');

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


        });

    //load the points animatedly
    myChart.transition()
        .attr('r', 2)
        .delay(function (d, i) {
            return i * 10;
        })
        .duration(100)
        .ease('bounce');

    //--------------------------------AXIS------------------------------------------

    //Y-Axis
    var vAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(10);

    var vGuide = d3.selectAll('.resultsPlotSvg1').append('g');
    vAxis(vGuide);
    vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    vGuide.selectAll('path')
        .style({fill: 'none', stroke: "#000"});
    vGuide.selectAll('line')
        .style({stroke: "#000"});


    //X Axis or Horizontal Axis
    var hAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(10);


    var hGuide = d3.selectAll('.resultsPlotSvg1').append('g');
    hAxis(hGuide);
    hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')');
    hGuide.selectAll('path')
        .style({fill: 'none', stroke: "#000"});
    hGuide.selectAll('line')
        .style({stroke: "#000"});
}

/**
 * It is the main callback function that
 * is called after the JSON data is parsed.
 */
function showResultsScatter2(jsonData) {

    dataList = jsonData.datalist2;


    //function to get x Value from JSON Object
    xVals = function (d) {
        return d.xValue;
    };

    //function to get y Value from JSON Object
    yVals = function (d) {
        return d.yValue;
    };

    //function to get category name
    categoryVals = function (d) {
        return d.category;
    };

    var margin = {top: 30, right: 30, bottom: 40, left: 50};

    var height = 200 - margin.top - margin.bottom,
        width = 300 - margin.left - margin.right,
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
    var rgbArray = ["BurlyWood", "Green", "Yellow", "Red", "Yellow", "Black", "Violet"];
    //setting up a colorScale
    var colorScale = d3.scale.ordinal()
        //.domain(["Alpha", "Beta", "Gamma", "Delta", "Epsa"])
        .range(rgbArray);

    //for debug purposes
    console.log(d3.extent(dataList, xVals)[1]);

    //styling the tooltip
    var tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0);

    //main scatter plot
    var myChart = d3.selectAll('#results_2').append('svg')
        .classed({'resultsPlotSvg2':true, 'resultsPlotSvg':true})
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
                .style('opacity', .9);

            //content of tooltip
            tooltip.html("x: " + xVals(d) + " y: " + yVals(d) + " category: " + categoryVals(d))
                .style('left', (d3.event.pageX - 35) + 'px')
                .style('top', (d3.event.pageY - 30) + 'px');

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


        });

    //load the points animatedly
    myChart.transition()
        .attr('r', 2)
        .delay(function (d, i) {
            return i * 10;
        })
        .duration(100)
        .ease('bounce');

    //--------------------------------AXIS------------------------------------------

    //Y-Axis
    var vAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(10);

    var vGuide = d3.selectAll('.resultsPlotSvg2').append('g');
    vAxis(vGuide);
    vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    vGuide.selectAll('path')
        .style({fill: 'none', stroke: "#000"});
    vGuide.selectAll('line')
        .style({stroke: "#000"});


    //X Axis or Horizontal Axis
    var hAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(10);


    var hGuide = d3.selectAll('.resultsPlotSvg2').append('g');
    hAxis(hGuide);
    hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')');
    hGuide.selectAll('path')
        .style({fill: 'none', stroke: "#000"});
    hGuide.selectAll('line')
        .style({stroke: "#000"});
}

/**
 * It is the main callback function that
 * is called after the JSON data is parsed.
 */
function showResultsScatter3(jsonData) {

    dataList = jsonData.datalist3;


    //function to get x Value from JSON Object
    xVals = function (d) {
        return d.xValue;
    };

    //function to get y Value from JSON Object
    yVals = function (d) {
        return d.yValue;
    };

    //function to get category name
    categoryVals = function (d) {
        return d.category;
    };

    var margin = {top: 30, right: 30, bottom: 40, left: 50};

    var height = 200 - margin.top - margin.bottom,
        width = 300 - margin.left - margin.right,
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
    var rgbArray = ["Green", "Yellow", "Red", "Yellow", "Black", "Violet"];
    //setting up a colorScale
    var colorScale = d3.scale.ordinal()
        //.domain(["Alpha", "Beta", "Gamma", "Delta", "Epsa"])
        .range(rgbArray);

    //for debug purposes
    console.log(d3.extent(dataList, xVals)[1]);

    //styling the tooltip
    var tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0);

    //main scatter plot
    var myChart = d3.selectAll('#results_3').append('svg')
        .classed({'resultsPlotSvg3':true, 'resultsPlotSvg':true})
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
                .style('opacity', .9);

            //content of tooltip
            tooltip.html("x: " + xVals(d) + " y: " + yVals(d) + " category: " + categoryVals(d))
                .style('left', (d3.event.pageX - 35) + 'px')
                .style('top', (d3.event.pageY - 30) + 'px');

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


        });

    //load the points animatedly
    myChart.transition()
        .attr('r', 2)
        .delay(function (d, i) {
            return i * 10;
        })
        .duration(100)
        .ease('bounce');

    //--------------------------------AXIS------------------------------------------

    //Y-Axis
    var vAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(10);

    var vGuide = d3.selectAll('.resultsPlotSvg3').append('g');
    vAxis(vGuide);
    vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    vGuide.selectAll('path')
        .style({fill: 'none', stroke: "#000"});
    vGuide.selectAll('line')
        .style({stroke: "#000"});


    //X Axis or Horizontal Axis
    var hAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(10);


    var hGuide = d3.selectAll('.resultsPlotSvg3').append('g');
    hAxis(hGuide);
    hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')');
    hGuide.selectAll('path')
        .style({fill: 'none', stroke: "#000"});
    hGuide.selectAll('line')
        .style({stroke: "#000"});
}






















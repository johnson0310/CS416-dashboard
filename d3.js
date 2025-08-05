// load data
const carMarketData = {
    globalData: [
        {
            year: 2020,
            marketShares: [
                { brand: "Toyota", share: 11.8, color: "red" },
                { brand: "Volkswagen Group", share: 10.2, color: "blue" },
                { brand: "General Motors", share: 9.8, color: "green" },
                { brand: "Hyundai-Kia", share: 8.1, color: "orange" },
                { brand: "Ford", share: 7.4, color: "purple" }
            ]
        },
        {
            year: 2021,
            marketShares: [
                { brand: "Toyota", share: 12.1, color: "red" },
                { brand: "Volkswagen Group", share: 9.8, color: "blue" },
                { brand: "General Motors", share: 9.4, color: "green" },
                { brand: "Hyundai-Kia", share: 8.7, color: "orange" },
                { brand: "Ford", share: 6.9, color: "purple" }
            ]
        },
        {
            year: 2022,
            marketShares: [
                { brand: "Toyota", share: 11.0, color: "red" },
                { brand: "General Motors", share: 8.9, color: "green" },
                { brand: "Volkswagen Group", share: 8.7, color: "blue" },
                { brand: "Hyundai-Kia", share: 7.2, color: "orange" },
                { brand: "Ford", share: 6.2, color: "purple" }
            ]
        },
        {
            year: 2024,
            marketShares: [
                { brand: "Toyota", share: 10.5, color: "red" },
                { brand: "Volkswagen Group", share: 8.9, color: "blue" },
                { brand: "General Motors", share: 8.8, color: "green" },
                { brand: "Hyundai-Kia", share: 7.8, color: "orange" },
                { brand: "Ford", share: 5.9, color: "purple" }
            ]
        }
    ],
    insights: {
        scene1: {
            text: "Toyota stays as the global leader at 10.5% market share, followed by Volkswagen Group at 8.9% and GM at 8.8%. The top 5 automakers represent over 40% of the global market."
        },
        scene2: {
            text: "The auto industry has gone through COVID 19 impacts, supply chain issues, and the EV movements. The top 5 global automakers show varying recoveries post pandemic."
        },
        scene3: {
            text: "From 2020 to 2024, Ford lost the most market share at -1.5%, while Toyota at -1.3% and Volkswagen Group at -1.3% also declined. GM at -1.0% and Hyundai-Kia at -0.3%."
        }
    }
};


// build page

// util
function getYearData(year){
    for (let i=0; i < carMarketData.globalData.length; i++){
        if (carMarketData.globalData[i].year === year) {
            return carMarketData.globalData[i].marketShares;
        }
    }
    return [];
}

// style
function initializeStyles() {
    const style = document.createElement('style');
    style.textContent = `
        body { font-family: Arial, sans-serif; margin: 20px; text-align: center; }
        button { margin: 10px; }
        .indicator { display: inline-block; width: 80px; height: 60px; background: lightgray; margin: 5px; text-align: center; border: 1px solid black; padding: 5px; }
        .indicator.active { background: black; color: white; }
        .indicator-label { display: block; font-size: 12px; }
        svg { display: block; margin: 20px auto; }
        #key-insight { margin: 20px auto; max-width: 600px; }
        .progress-bar { width: 200px; height: 10px; background: lightgray; margin: 20px auto; }
        .progress-fill { height: 100%; background: black; }
    `;
    document.head.appendChild(style);
}
// d3
const margin = 80;
const width = 900 - 2 * margin;
const height = 600 - 2 * margin;

let svg, g;
let currentScene = 0;

const scene = {
    0: {
        title: "Today's top 5 market leaders",
        description: 'Current global auto market share in 2024'
    },
    1: {
        title: "The historical market share trend",
        description: 'The auto market share trend through the last few years (2020-2024)'
    },
    2: {
        title: "Market share changes over 4 years",
        description: 'Market share changes from 2020 to 2024'
    }
}

function init() {
    // initialize d3 elements
    svg = d3.select("#main-chart");
    g = svg.append("g")
        .attr("transform", `translate(${margin},${margin})`);

    initializeStyles();
    updateSceneUI();
    renderScene(currentScene);
    setupEventListeners();
}

// event listeners
function setupEventListeners() {
    const prevBtn = d3.select("#prev-btn");
    const nextBtn = d3.select("#next-btn");
    const indicators = d3.selectAll(".indicator");

    prevBtn.on("click", function() {
        if (currentScene > 0) {
            currentScene--;
            updateSceneUI();
            renderScene(currentScene);
        }
    });

    nextBtn.on("click", function() {
        if (currentScene < 2) {
            currentScene++;
            updateSceneUI();
            renderScene(currentScene);
        }
    });

    indicators.on("click", function() {
        const sceneIndex = +d3.select(this).attr("data-scene");
        currentScene = sceneIndex;
        updateSceneUI();
        renderScene(currentScene);
    });
}

// scene control
function updateSceneUI() {
    const config = scene[currentScene];

    d3.select("#scene-title").text(config.title);
    d3.select("#scene-description").text(config.description);

    // progress bar
    const progress = ((currentScene + 1) / 3) * 100;
    d3.select(".progress-fill").style("width", `${progress}%`);
    d3.select(".progress-text").text(`Scene ${currentScene + 1} of 3`);

    d3.selectAll(".indicator")
        .classed("active", false);
    d3.select(`.indicator[data-scene="${currentScene}"]`)
        .classed("active", true);

    const prevBtn = d3.select("#prev-btn");
    const nextBtn = d3.select("#next-btn");

    if (currentScene === 0) {
        prevBtn.property("disabled", true);
    } else {
        prevBtn.property("disabled", false);
    }

    if (currentScene === 2) {
        nextBtn.property("disabled", true);
    } else {
        nextBtn.property("disabled", false);
    }

    // insight
    const insight = carMarketData.insights[`scene${currentScene + 1}`];
    if (insight) {
        d3.select("#key-insight").text(insight.text);
    }
}

function renderScene(sceneIndex) {
    try {
        // clear previous scene
        if (g) {
            g.selectAll("*").remove();
        }

        switch(sceneIndex) {
            case 0:
                scene1();
                break;
            case 1:
                scene2();
                break;
            case 2:
                scene3();
                break;
            default:
                break;
        }
    } catch (error) {
    }
}

// scene 1
function scene1() {
    const data = getYearData(2024)
        .sort(function(a, b) { return b.share - a.share; })
        .slice(0, 5);

    const brandNames = [];
    for (let i = 0; i < data.length; i++) {
        brandNames.push(data[i].brand);
    }

    const xScale = d3.scaleBand()
        .domain(brandNames)
        .range([0, width])
        .padding(0.15);

    let maxShare = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].share > maxShare) {
            maxShare = data[i].share;
        }
    }

    const yScale = d3.scaleLinear()
        .domain([0, maxShare + 2])
        .range([height, 0]);

    bars = g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d.brand); })
        .attr("width", xScale.bandwidth())
        .attr("y", function(d) { return yScale(d.share); })
        .attr("height", function(d) { return height - yScale(d.share); })
        .attr("fill", function(d) { return d.color; });

    g.selectAll(".value-label")
        .data(data)
        .enter().append("text")
        .attr("class", "value-label")
        .attr("x", function(d) { return xScale(d.brand) + xScale.bandwidth() / 2; })
        .attr("y", function(d) { return yScale(d.share) - 5; })
        .attr("text-anchor", "middle")
        .text(function(d) { return d.share + "%"; });

    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin)
        .attr("x", 0 - (height / 2))
        .attr("dy", "3em")
        .style("text-anchor", "middle")
        .text("Market Share (%)");

    addScene1Annotations(data, xScale, yScale);
}

// scene 2
function scene2() {
    const years = [2020, 2021, 2022, 2024];
    const topBrands = ["Toyota", "Volkswagen Group", "General Motors", "Hyundai-Kia", "Ford"];

    const lineData = [];
    for (let i = 0; i < topBrands.length; i++) {
        const brand = topBrands[i];
        const values = [];
        for (let j = 0; j < years.length; j++) {
            const year = years[j];
            const yearData = getYearData(year);
            let share = 0;
            for (let k = 0; k < yearData.length; k++) {
                if (yearData[k].brand === brand) {
                    share = yearData[k].share;
                    break;
                }
            }
            values.push({ year: year, share: share });
        }

        const currentData = getYearData(2024);
        let color;
        for (let k = 0; k < currentData.length; k++) {
            if (currentData[k].brand === brand) {
                color = currentData[k].color;
                break;
            }
        }

        lineData.push({
            brand: brand,
            values: values,
            color: color
        });
    }

    const xScale = d3.scaleLinear()
        .domain(d3.extent(years))
        .range([0, width]);

    let maxValue = 0;
    for (let i = 0; i < lineData.length; i++) {
        for (let j = 0; j < lineData[i].values.length; j++) {
            if (lineData[i].values[j].share > maxValue) {
                maxValue = lineData[i].values[j].share;
            }
        }
    }

    const yScale = d3.scaleLinear()
        .domain([0, maxValue + 2])
        .range([height, 0]);

    const line = d3.line()
        .x(function(d) { return xScale(d.year); })
        .y(function(d) { return yScale(d.share); });

    g.selectAll(".line")
        .data(lineData)
        .enter().append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .attr("stroke", function(d) { return d.color; })
        .attr("stroke-width", 2)
        .attr("fill", "none");

    g.selectAll(".line-label")
        .data(lineData)
        .enter().append("text")
        .attr("class", "line-label")
        .attr("x", width + 5)
        .attr("y", function(d) { return yScale(d.values[d.values.length - 1].share); })
        .attr("dy", "0.35em")
        .style("font-size", "12px")
        .attr("fill", "black")
        .text(function(d) { return d.brand; });

    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));

    g.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 40})`)
        .style("text-anchor", "middle")
        .text("Year");

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin)
        .attr("x", 0 - (height / 2))
        .attr("dy", "3em")
        .style("text-anchor", "middle")
        .text("Market Share (%)");
}

// scene 3
function scene3() {
    const data2020 = getYearData(2020);
    const data2024 = getYearData(2024);

    const changeData = [];
    for (let i = 0; i < data2024.length; i++) {
        const brand2024 = data2024[i];
        let share2020 = 0;
        for (let j = 0; j < data2020.length; j++) {
            if (data2020[j].brand === brand2024.brand) {
                share2020 = data2020[j].share;
                break;
            }
        }
        const change = brand2024.share - share2020;
        changeData.push({
            brand: brand2024.brand,
            change: change,
            color: change >= 0 ? "green" : "red"
        });
    }

    changeData.sort(function(a, b) { return a.change - b.change; });

    const brandNames = [];
    for (let i = 0; i < changeData.length; i++) {
        brandNames.push(changeData[i].brand);
    }

    const yScale = d3.scaleBand()
        .domain(brandNames)
        .range([0, height])
        .padding(0.2);

    let maxAbsChange = 0;
    for (let i = 0; i < changeData.length; i++) {
        const absChange = Math.abs(changeData[i].change);
        if (absChange > maxAbsChange) {
            maxAbsChange = absChange;
        }
    }

    const xScale = d3.scaleLinear()
        .domain([-maxAbsChange - 0.5, maxAbsChange + 0.5])
        .range([0, width]);

    const centerX = xScale(0);

    g.selectAll(".change-bar")
        .data(changeData)
        .enter().append("rect")
        .attr("class", "change-bar")
        .attr("x", function(d) {
            return d.change >= 0 ? centerX : xScale(d.change);
        })
        .attr("y", function(d) { return yScale(d.brand); })
        .attr("width", function(d) {
            return Math.abs(xScale(d.change) - centerX);
        })
        .attr("height", yScale.bandwidth())
        .attr("fill", function(d) { return d.color; });

    g.selectAll(".change-label")
        .data(changeData)
        .enter().append("text")
        .attr("class", "change-label")
        .attr("x", function(d) {
            return d.change >= 0 ? xScale(d.change) + 5 : xScale(d.change) - 5;
        })
        .attr("y", function(d) { return yScale(d.brand) + yScale.bandwidth() / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", function(d) { return d.change >= 0 ? "start" : "end"; })
        .text(function(d) { return (d.change >= 0 ? "+" : "") + d.change.toFixed(1) + "%"; });

    // center line on x axis for 0
    g.append("line")
        .attr("x1", centerX)
        .attr("x2", centerX)
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "black")
        .attr("stroke-width", 1);

    g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));

    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    g.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 40})`)
        .style("text-anchor", "middle")
        .text("Market Share Change (%)");

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin)
        .attr("x", 0 - (height / 2))
        .attr("dy", "3em")
        .style("text-anchor", "middle")
        .text("Automaker");
}

// annotations
function addScene1Annotations(data, xScale, yScale) {
    let toyotaData;
    let hyundaiData;
    for (let i = 0; i < data.length; i++) {
        if (data[i].brand === "Toyota") {
            toyotaData = data[i];
        }
        if (data[i].brand === "Hyundai-Kia") {
            hyundaiData = data[i];
        }
    }

    if (toyotaData) {
        const annotations = g.append("g").attr("class", "annotation");

        annotations.append("line")
            .attr("x1", xScale("Toyota") + xScale.bandwidth() / 2)
            .attr("y1", yScale(toyotaData.share))
            .attr("x2", xScale("Toyota") + xScale.bandwidth() / 2)
            .attr("y2", yScale(toyotaData.share) - 40)
            .style("stroke", "black")
            .style("stroke-width", 1);

        annotations.append("text")
            .attr("x", xScale("Toyota") + xScale.bandwidth() / 2)
            .attr("y", yScale(toyotaData.share) - 45)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "black")
            .text("Market Leader");
    }

    if (hyundaiData) {
        const annotations = g.append("g").attr("class", "annotation");

        annotations.append("line")
            .attr("x1", xScale("Hyundai-Kia") + xScale.bandwidth() / 2)
            .attr("y1", yScale(hyundaiData.share))
            .attr("x2", xScale("Hyundai-Kia") + xScale.bandwidth() / 2)
            .attr("y2", yScale(hyundaiData.share) - 40)
            .style("stroke", "black")
            .style("stroke-width", 1);

        annotations.append("text")
            .attr("x", xScale("Hyundai-Kia") + xScale.bandwidth() / 2)
            .attr("y", yScale(hyundaiData.share) - 45)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "black")
            .text("Growing");
    }
}

// init page
document.addEventListener('DOMContentLoaded', function() {
    init();
});
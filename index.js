//let's start
const heighta = 400
const height = 320
const width = 1230
const wpadding = 60
const hpadding = 50
const pxwidth = (window.innerWidth)
const pxheight = (window.innerHeight)

const svg = d3.select("body")
    .append("svg")
    .attr("class", "canvas")
    .attr("width", width)
    .attr("height", heighta)

var tooltip = d3.select("#holder")
    .append("span")
    .attr("id", "tooltip")
    .style("opacity", 0)

function twodec(x) {
    return Math.round(x * 100) / 100
}

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

fetch(url)
    .then(response => response.json())
    .then(data => {
        const base = data["baseTemperature"]
        const dataset = data["monthlyVariance"]
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const colorset = ['#36419b', '#425aa0', '#7fb5d5', '#bee1ed', '#f1f6d5', '#fbf0b0', '#fec87b', '#fa9b5b', '#e65637', '#bb1c28']
        const xScale = d3.scaleLinear().domain([d3.min(dataset, d => d["year"]), d3.max(dataset, d => d["year"])]).range([wpadding, width - wpadding])
        const yScale = d3.scaleLinear().domain([d3.min(dataset, d => d["month"]), d3.max(dataset, d => d["month"])]).range([hpadding, height])

        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("data-month", d => d["month"]-1)
            .attr("data-year", d => d["year"])
            .attr("data-temp", d => d["variance"] + base)
            .attr("width", 5)
            .attr("height", height / 12)
            .attr("x", d => xScale(d["year"]))
            .attr("y", d => yScale(d["month"]))
            .attr("fill", d => {
                var temp = d["variance"] + base
                if (temp < 3) {
                    return "#36419b"
                }
                else if (temp < 4) {
                    return "#425aa0"
                }
                else if (temp < 5) {
                    return "#7fb5d5"
                }
                else if (temp < 6) {
                    return "#bee1ed"
                }
                else if (temp < 7) {
                    return "#f1f6d5"
                }
                else if (temp < 8) {
                    return "#fbf0b0"
                }
                else if (temp < 9) {
                    return "#fec87b"
                }
                else if (temp < 10) {
                    return "#fa9b5b"
                }
                else if (temp < 12) {
                    return "#e65637"
                }
                return "#bb1c28"
            })
            .on("mouseover", function (d) {
                console.log(d["year"])
                tooltip.transition()
                    .duration(0)
                    .style("opacity", 0.9)
                    .style("top", (yScale(d["month"])+100).toString() + "px")
                    .style("left", (xScale(d["year"])+100).toString() + "px")
                    .attr("data-year", d["year"])
                d3.select("#tooltip").html(`${d["year"]} - ${months[d["month"] - 1]}<br>${twodec(d["variance"] + base)}°C<br>${twodec(d["variance"])}°C`)
            })
            .on("mouseout", function () {
                tooltip.transition()
                    .duration(0)
                    .style("opacity", 0)
                    .style("top", "0vw")
                    .style("left", "0vw")
            })


        const xAxis = d3.axisBottom().scale(xScale)
            .tickFormat(d => d)
        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", "translate(0,345)")
            .call(xAxis)

        const ycale = d3.scaleLinear().domain([d3.min(dataset, d => d["month"]), d3.max(dataset, d => d["month"])]).range([hpadding + (height / 24), height + (height / 24)])
        const yAxis = d3.axisLeft().scale(ycale)
            .tickFormat(d => months[d - 1])
        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", "translate(" + wpadding + ",0)")
            .call(yAxis)

        console.log(dataset, base);
        d3.select("#legend")
            .append("svg")
            .attr("class", "legend")
            .attr("width", 200)
            .attr("height", 50)
            .selectAll("rect")
            .data(colorset)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 20)
            .attr("y", 20)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", d => d)


    })

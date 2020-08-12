window.addEventListener('DOMContentLoaded', function() {

    const req = new XMLHttpRequest();
    const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

let dataset;
let baseTemp;
const colours = ["#020f66", "steelblue", "#3fbdeb", "#a6e7ff", "#fffa6e", "#d6b300", "#d68b00", "#d65900", "#d1321d", "#940101"]

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const svg = d3.select('svg')


const width = +svg.attr('width');
const height = +svg.attr('height');

const margin = { top: 20, right: 60, bottom: 100, left: 80 };

const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.right - margin.left;

let xScale;
let xAxis;

let yScale;
let yAxis;



let setScales = () => {

    let xValue = (d) => { return d.year }
    let yValue = (d) => { return d.month }

    xScale = d3.scaleLinear()
        .domain([d3.min(dataset, xValue), d3.max(dataset, xValue)])
        .range([margin.left, width - margin.right])
        


    yScale = d3.scaleBand()
        .domain(monthNames)
        .range([margin.top, height - margin.bottom])

}

let makeAxes = () => {

    xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'))
            .ticks(25)

    yAxis = d3.axisLeft(yScale);

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate('+ (0) +', '+ (height - margin.bottom) +')')

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate('+ (margin.left) +', 0)')

    svg.append('text')
        .attr('transform', 'translate('+ (width / 2) +', '+ (height - 60) +')')
        .style('text-anchor', 'middle')
        .style('font-family', 'Spectral')
        .style('font-size', '1.2em')
        .text('Years')

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 10)
        .attr('x', 20 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Months')
        .style('font-family', 'Spectral')
        .style('font-size', '1.2em')
}

let makeBars = () => {

    let barWidth = innerWidth / dataset.length

    let toolTip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')
        .style('position', 'absolute')

    svg.selectAll('rect').data(dataset).enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('fill', (d) => {
            let temp = (baseTemp + d.variance).toFixed(1)
            if (temp <= 2.5) {
                return '#020f66'
            }
           else if (temp > 2.5 && temp <= 3.5) {
                return 'steelblue'
            }
           else if (temp > 3.5 && temp <= 4.5) {
                return '#3fbdeb'
            }
           else if (temp > 4.5 && temp <= 5.5) {
                return '#a6e7ff'
            }
            else if (temp > 5.5 && temp <= 6.5) {
                return '#fffa6e'
            }
            else if (temp > 6.5 && temp <= 7.5) {
                return '#d6b300'
            }
            else if (temp > 7.5 && temp <= 8.5) {
                return '#d68b00'
            }
            else if (temp > 8.5 && temp <= 9.5) {
                return '#d65900'
            }
            else if (temp > 9.5 && temp <= 10.5) {
                return '#d1321d'
            }
            else {
                return '#940101'
            }
        })
        .attr('data-month', (d) => { return d.month - 1 })
        .attr('data-year', (d) => { return d.year })
        .attr('data-temp', (d) => { return d.variance })
        .attr('height', (d) => { return innerHeight / 12 })
        .attr('width', (d) => { return width / (dataset.length / 8) })
        .attr('x', (d, i) => { return xScale(d.year)})
        .attr('y', (d) => { return yScale(monthNames[d.month - 1]) })
        .on('mouseover', (d) => {

            toolTip.transition()
                .duration(50)
                .style('visibility', 'visible')
                .style('left', `${d3.event.pageX}`+"px")
                  .style('top', `${d3.event.pageY}`+"px")
                  .style('border', '1px solid black')
                  .style('width', '75px')
                  .style('height', '50px')
                  .style('border-radius', '5px')
                  .style('opacity', '0.8')
                  .style('background-color', 'black')
                  .style('box-shadow', '2px 2px 2px 3px')
                  .style('font-size', 'small')
                  .style('color', 'white')
                  .attr('data-year', d.year)
                  .attr('temp', (baseTemp + d.variance).toFixed(1))
            let temp = (baseTemp + d.variance).toFixed(1)

            toolTip.text(monthNames[d.month - 1] + " " + d.year + " " + temp + "℃" + ", " + d.variance.toFixed(2) + "℃")
            
        })
        .on('mouseout', (d) => {

            toolTip.transition()
                .duration(50)
                .style('visibility', 'hidden')
        })
}

let generateLegend = () => {
    let legendWidth = 500;
    let legendHeight = 10;

    var legend = svg.append('g')
        .attr('id', 'legend')
        // .attr('height', 100)
        // .attr('width', 500)
        .attr('transform', 'translate('+ (margin.left) +', '+ (height - 160) +')')


    legend.selectAll('rect').data(colours).enter()
        .append('rect')
        .attr('height', '25px')
        .attr('width', '40px')
        .attr('class', 'rect')
        .attr('x', (d, i) => { return i * 30 })
        .attr('y', 110)
        .attr('fill', (d, i) => { return colours[i] })
        
        
    legend.selectAll('text').data(colours).enter().append('text')
        .attr('x', (d, i) => { 
                return (i + 1) * 32
         })
        .attr('y', 155)
        .attr('dy', '0.25em')
        .attr('text-anchor', 'end')
        .text((d, i) => {
            if (i === 0) {
                return 2.5;
            }
            if (i === 1) {
                return 3.5;
            }
            if (i === 2) {
                return 4.5;
            }
            if (i === 3) {
                return 5.5;
            }
            if (i === 4) {
                return 6.5;
            }
            if (i === 5) {
                return 7.5;
            }
            if (i === 6) {
                return 8.5
            }
            if (i === 7) {
                return 9.5
            }
            if (i === 8) {
                return 10.5
            }
        })
    
}

req.open('GET', url, true);
req.send();
req.onload = function() {
    let json = JSON.parse(req.responseText);
    dataset = json.monthlyVariance
    baseTemp = json.baseTemperature;
    console.log(baseTemp)
    setScales();
    makeAxes();
    makeBars();
    generateLegend();
}


})
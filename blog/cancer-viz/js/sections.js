
let dataset, svg
let salarySizeScale, salaryXScale, categoryColorScale
let simulation, nodes, nodes2
let categoryLegend, salaryLegend

const margin = {left: 170, top:50, bottom: 50, right: 20}
const width = 1000 - margin.left - margin.right
const height = 900 - margin.top - margin.bottom
const categories = ["Breast Cancer", "Colorectal Cancer", "Endometrial Cancer", "Ovarian Cancer", "Pancreatic Cancer", "Small Intestine Cancer", "Brain Cancer", "Kidney Cancer", "Melanoma Cancer"];
const colors = ['#ffcc00', '#ff6666', '#cc0066', '#66cccc', '#f688bb', '#65587f', '#baf1a1', '#333333', '#75b79e',  '#66cccc', '#9de3d0', '#f1935c', '#0c7b93', '#eab0d9', '#baf1a1', '#9399ff']

// load data
d3.csv('data/fam.csv', function(d){
    return {
        Cancer: d.Cancer,
        full_name: d.full_name,
        onset_age: +d.onset_age,
        perc_case: +d.perc_case,
        perc_BRCA1_in_case:+d.perc_BRCA1_in_case,
        perc_BRCA1_in_control:+d.perc_BRCA1_in_control    
    };
}).then(data => {
    dataset = data
    console.log(dataset)
    createScales() // a function to create scales
    setTimeout(drawInitial(), 100) // a function to draw initial components
})

function createScales(){
    // salaryXScale = d3.scaleLinear(d3.extent(dataset, d => d.onset_age), [margin.left + 36, margin.left + width])
    salaryXScale = d3.scaleLinear()
        .domain([
        d3.min(dataset,d => d.onset_age-2),
        d3.max(dataset, d => d.onset_age+2)
    ])
        .range([margin.left + 36, margin.left + width])
        .clamp(true)
    
    salarySizeScale = d3.scaleLinear(d3.extent(dataset, d => d.perc_case), [5, 30]).clamp(true)
    categoryColorScale = d3.scaleOrdinal(categories, colors)

    BRCA1XScale = d3.scaleLinear()
        .domain([
            0,
            // d3.min(dataset, d => d.perc_BRCA1_in_case-0.0005), 
            d3.max(dataset, d => d.perc_BRCA1_in_case+0.005) 
            // 0.1
        ])
        // .domain([d3.extent(dataset, d=> d.perc_BRCA1_in_case)])
        .range([margin.left + 36, margin.left + width])
        .clamp(true)

}

function createLegend(x, y){ // size depends on size scale
    let svg = d3.select('#legend1')

    svg.append('g')
        .attr('class', 'categoryLegend')
        .attr('transform', `translate(${x},${y})`)

    categoryLegend = d3.legendColor()
                        .shape('path', d3.symbol().type(d3.symbolCircle).size(150)())
                        .shapePadding(10)
                        .scale(categoryColorScale)
    
    d3.select('.categoryLegend')
        .call(categoryLegend)
}


function drawInitial(){

    let svg = d3.select("#vis")
        .append('svg')
        .attr('width', 1000)
        .attr('height', 950)
        .attr('opacity', 1)
    
    // svg.append('g')
    //     .append('text')
    //     .attr('class', 'first-page')
    //     .attr('x', margin.left +width / 2)
    //     .attr('y', (height / 3) + (height / 5))
    //     .text('Cancer')
    //     .attr('opacity', 0.8)

    // Axis of first plot
    let xAxis = d3.axisBottom(salaryXScale)
        .ticks(10)
        .tickSize(height + 80)

    // xAxisGroups
    let xAxisGroup = svg.append('g')
        .attr('class', 'first-axis')
        .attr('transform', 'translate(0, 0)')
        .call(xAxis)
        .classed('axis', true)
        .call(g => g.select('.domain')
            .remove()) // remove outline
        .call(g => g.selectAll('.tick line'))
            .attr('stroke-opacity', 0.2)
            .attr('stroke-dasharray', 2.5) // dash line
        // .attr('opacity', 0)
        

    let BRCA1xAxis = d3.axisBottom(BRCA1XScale)
        .ticks(10)
        .tickSize(height + 80)
    
    let BRCA1xAxisGroup = svg.append('g')
        .attr('class', 'brca1-axis')
        .attr('transform', 'translate(0, 0)')
        .call(BRCA1xAxis)
        .classed('axis', true)
        .call(g => g.select('.domain')
            .remove()) // remove outlines
        .call(g => g.selectAll('.tick line'))
            .attr('stroke-opacity', 0.2)
            .attr('stroke-dasharray', 2.5) // dash line
        .attr('opacity', 0)


    // // Axis of second plot
    // let BRCA1xAxis = d3.axisBotton(BRCA1XScale)
    //     .ticks(10)
    // let BRCA1xAxisGroup = svg.append('g')
    //     .attr('class', 'second-axis')
    //     .attr('transform', 'translate(0, 0)')
    //     .call(BRCA1xAxis)
    //     .classed('axis', true)
    //     .call(g => g.select('.domain')
    //         .remove()) // remove outline
    //     .call(g => g.selectAll('.tick line'))
    //         .attr('stroke-opacity', 0.2)
    //         .attr('stroke-dasharray', 2.5) // dash line

    // label
    xAxisGroup.append('text')
        .attr('x', width/2 + margin.left)
        .attr('y', height + margin.top + margin.bottom+ 20)
        .attr('fill', 'black')
        .text('Age')

    BRCA1xAxisGroup.append('text')
        .attr('x', width/2 + margin.left)
        .attr('y', height + margin.top + margin.bottom + 20)
        .attr('fill', 'black')
        .text('% BRCA1 carriers among cases')

    // Selection of all the circles 
    svg.selectAll('.first-circle')
        .data(dataset)
        .enter()
        .append('circle')
            .attr('class','first-circle')
            .attr('fill', d => categoryColorScale(d.full_name))
            .attr('r', d => salarySizeScale(d.perc_case) * 1.2)
            .attr('cx', (d, i) => salaryXScale(d.onset_age))
            .attr('cy', (d, i) => i * 80 + 120-8)
            // .attr('opacity', 0)

    // Selection of all the circles 
    svg.selectAll('.second-circle')
        .data(dataset)
        .enter()
        .append('circle')
            .attr('class','second-circle')
            .attr('fill', d => categoryColorScale(d.full_name))
            .attr('r', 10)
            .attr('cx', (d, i) => BRCA1XScale(d.perc_BRCA1_in_case))
            .attr('cy', (d, i) => i * 80 + 120-8)
            .attr('opacity', 0)

    //Small text label for 1st graph
    svg.selectAll('.small-text')
        .data(dataset)
        .enter()
        .append('text')
            .attr('class', 'small-text')    
            .text((d, i) => d.full_name)
            .attr('x', margin.left+25)
            .attr('y', (d, i) => i * 80 + 120)
            .attr('font-size', '20px')
            .attr('text-anchor', 'end')
            // .attr('opacity', 0)

    // Add mouseover and mouseout events for all circles (1st plot)
    // Changes opacity and adds border

    svg.selectAll('circle')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)

    function mouseOver(d, i){

        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('opacity', 1)
            .attr('stroke-width', 3)
            .attr('stroke', 'black')
            
        d3.select('#tooltip')
            .style('left', (d3.event.pageX + 10)+ 'px')
            .style('top', (d3.event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .html(`<strong>Cancer: </strong> ${d.full_name} 
                <br> <strong>Mean Onset Age: </strong> ${d.onset_age} 
                <br> <strong>% Cases among women population: </strong> ${d3.format(",.6r")(d.perc_case*100)}%
                <br> <strong>% BRCA1 carriers among cases: </strong> ${d3.format(",.6r")(d.perc_BRCA1_in_case)}`)
    }
    
    function mouseOut(d, i){
        d3.select('#tooltip')
            .style('display', 'none')

        d3.select(this)
            .transition('mouseout').duration(100)
            .attr('opacity', 0.8)
            .attr('stroke-width', 0)
    }
}

function clean(chartType){
    let svg = d3.select('#vis').select('svg')
    // if (chartType !== 'isZero'){
    //     svg.selectAll('.first-page').transition().attr('opacity', 0)
    // }
    if (chartType !== "isFirst"){
        svg.select('.first-axis').transition().attr('opacity', 0)
        // svg.selectAll('.small-text').transition().attr('opacity', 0)
        //     .attr('x', -200)   
        svg.selectAll('.first-circle').transition().attr('opacity', 0)
    }
    if (chartType !== 'isSecond'){
        svg.select('.brca1-axis').transition().attr('opacity', 0)
        // svg.selectAll('.small-text').transition().attr('opacity', 0)
        //     .attr('x', -200)   
        svg.selectAll('.second-circle').transition().attr('opacity', 0)
    }
}
// function draw0(){
//     //Stop simulation
//     simulation.stop()
//     let svg = d3.select("#vis")
//                     .select('svg')
//                     .attr('width', width)
//                     .attr('height', height)
//     clean('isZero')
//     svg.select('.first-page')
//         .attr('opacity', 1)

// }
function draw1(){

    let svg = d3.select("#vis")
        .select('svg')
        .attr('width', 1000)
        .attr('height', 950)
    
    clean('isFirst')

    // d3.select('.categoryLegend').transition().remove()

    svg.select('.first-axis')
        .attr('opacity', 1)
    
    svg.selectAll('.first-circle')
        .transition().duration(500).delay(100)
        .attr('r', d => salarySizeScale(d.perc_case) * 1.2)
        .attr('cx', (d, i) => salaryXScale(d.onset_age))
        .attr('cy', (d, i) => i * 80 + 120)
        .attr('fill', d => categoryColorScale(d.full_name))
        .attr('opacity', 1)

    svg.selectAll('.small-text').transition()
        .attr('opacity', 1)
        .attr('x', margin.left+25)
        .attr('y', (d, i) => i * 80 + 120- 8)
        .attr('font-size', '20px')
        .attr('text-anchor', 'end')

    

    // createLegend(20, 50)
}

function draw2(){
    
    
    let svg = d3.select("#vis")
        .select('svg')
        .attr('width', 1000)
        .attr('height', 950)
    
    clean('isSecond')

    // d3.select('.categoryLegend').transition().remove()

    svg.select('.brca1-axis')
        .attr('opacity', 1)
    
    svg.selectAll('.second-circle')
        .transition().duration(500).delay(100)
        .attr('r', 10)
        .attr('cx', (d, i) => BRCA1XScale(d.perc_BRCA1_in_case))
        .attr('cy', (d, i) => i * 80 + 120 - 8)
        .attr('fill', d => categoryColorScale(d.full_name))
        .attr('opacity', 1)

    svg.selectAll('.small-text').transition()
        .attr('opacity', 1)
        .attr('x', margin.left+25)
        .attr('y', (d, i) => i * 80 + 120)
        .attr('font-size', '20px')
        .attr('text-anchor', 'end')

    // createLegend(20, 50)
}


//Array of all the graph functions
//Will be called from the scroller functionality

let activationFunctions = [
    draw1,
    draw2
]


//All the scrolling function
//Will draw a new graph based on the index provided by the scroll


let scroll = scroller()
    .container(d3.select('#graphic'))
scroll()

let lastIndex, activeIndex = 0

scroll.on('active', function(index){
    d3.selectAll('.step')
        .transition().duration(500)
        .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});
    
    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1; 
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(i => {
        activationFunctions[i]();
    })
    lastIndex = activeIndex;

})

scroll.on('progress', function(index, progress){
    if (index == 2 & progress > 0.7){

    }
})
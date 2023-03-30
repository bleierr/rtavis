
console.log(data[0]);

const days = {}

for (let i = 0; i < data.length; i++){
    if(data[i]){
            if(days.hasOwnProperty(data[i].title)){
                days[data[i].title].push(data[i].id)
            }else{
                days[data[i].title] = []
                days[data[i].title].push(data[i].id)
            }
        
    }

} 

console.log(Object.keys(days).sort())

let daysArr = [];

for (const [i, d] of Object.keys(days).entries()){
    const o = {};
    //o.id = d;
    //o.id = i;
    o.days = days[d]
    o.daysCount = days[d].length
    daysArr.push(o)
}



daysArr = daysArr.sort((a,b) => (a.daysCount > b.daysCount) ? 1 : ((b.daysCount > a.daysCount) ? -1 : 0))

for (let i = 0; i < daysArr.length; i++) 
    { 
      daysArr[i].id = daysArr.length - i
    }



console.log(daysArr[0])

// set the dimensions and margins of the graph
const margin = {top: 70, right: 30, bottom: 200, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 5000 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#datavis")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

 const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


        //add x axis
const x = d3.scaleLinear()
        .domain([0, 70])
        .range([ 0, width ]);
          

 svg.append("g")
          .call(d3.axisTop(x))
          .selectAll("text")
          //.attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");


g.append("text")
            .attr("class", "x axis-label")
            .attr("x", 250)
            .attr("y", -100)
            //.attr("text-anchor", "middle")
            .text("Anzahl der Paralellüberlieferungen").style("font-size","14px");
  
        
        // Add Y axis
const y = d3.scaleBand()
          .domain(daysArr.map(function(d) { return d.id; }))
          .range([ height, 0])
          .padding(0.01);


 svg.append("g")
          .attr("transform", "translate(0, 0)")
          .call(d3.axisLeft(y));

 g.append("text")
          .attr("class", "y axis-label")
          .attr("x", -250)
          .attr("y", -140)
          //.attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .text("Titel von RTA Texten").style("font-size","14px");
        

// Tooltip Funktionalität

const tooltip = d3.select("#datavis")
        .append("div")
        .style("opacity", 1)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("position", "absolute")
        //.style("width", "200px")
        //.style("height", "200px")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

const mouseover = function(event, d) {
        tooltip.style("opacity", 1)
        }
const mousemove = function(event, d) {
      tooltip
      .html(()=>{
      let daysCount = 0
      if (d.hasOwnProperty("count")){
      daysCount = d.count
      }
      return "Tag: " + d.id + "<br>" + "Anzahl: " + daysCount;
      })
      .style("left", (event.pageX + 30) + "px") //
      .style("top", (event.pageY) + "px") //
      }
const mouseleave = function(event, d) {
      tooltip.style("opacity", 0)
      }




        // Bars
 svg.selectAll("bar")
        .data(daysArr)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", function(d) { return y(d.id); })
        .attr("width", function(d) { return  x(d.daysCount) ; })
        .attr("height", 20)
        .attr("fill", "#69b3a2")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
 
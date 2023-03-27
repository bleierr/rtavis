
//console.log(data[0]);

const getDaysArray = function(start, end) {
  let arr = []
  for(arr,dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
      arr.push(new Date(dt));
  }
  return arr;
};

const dayMap = getDaysArray("1576-06-07", "1576-10-25")
//console.log(dayMap)

const res = dayMap.reduce((a, c, i) => {
  return i % 7 === 0 ? a.concat([dayMap.slice(i, i + 7)]) : a;
}, []);

//console.log("RES:",res[1][1])

const dayArr = []

const weekdays = ['Mo','Di','Mi','Do','Fr','Sa','So']

const calendarWeeks = []

for (w in res){
  calendarWeeks.push("KW"+String(Number(w)+19))
  for (d in res[w]){
    const o = {}
    o.week = "KW"+String(Number(w)+19)
    o.weekday = weekdays[d]
    o.id = res[w][d].toISOString().split('T')[0]
    dayArr.push(o)
  }
}

//console.log("DayArr: ", dayArr)

const days = {}

for (let i = 0; i < data.length; i++){
    if(data[i] && data[i].hasOwnProperty("tage")){
        //console.log(data[i])
        for (const d of data[i].tage){
            //console.log(d)
            if(days.hasOwnProperty(d)){
                days[d].push(data[i].id)
            }else{
                days[d] = []
                days[d].push(data[i].id)
            }
        }
    }
} 



const daysObj = {};

for (const [i,d] of Object.keys(days).sort().entries()){
  if ( i >= 50){
    daysObj[d] = {};
    daysObj[d].id = d;
    daysObj[d].days = days[d]
    daysObj[d].daysCount = days[d].length
   
  }
}

console.log("dayArr:", dayArr)
console.log("daysObj:", daysObj)

// set the dimensions and margins of the graph
const margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 500 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

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

const x = d3.scaleBand()
          .range([ 0, width ])
          .domain(weekdays)
          .padding(0.01);
        
          svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          
     
        
        // Add Y axis
const y = d3.scaleBand()
          .domain(calendarWeeks)
          .range([ height, 0])
          .padding(0.01);
        svg.append("g")
          .call(d3.axisLeft(y));


 // Build color scale
          var myColor = d3.scaleLinear()
            .range(["white", "#69b3a2"])
            .domain([0,10])        

const infotext =  d3.select("#infotext").text(d.id);

const mouseclick = function(event, d) {
          let t = d.id + "<br>"
          if (daysObj.hasOwnProperty(d.id) ){
            t = t + "Count: " + daysObj[d.id].daysCount + "<br>"
            t = t + daysObj[d.id].days.join("<br>")
          }

          d3.selectAll(".cell")
            .style("stroke", "white")

          d3.select(this)
          .style("stroke", "red")
          infotext.html(t);
        }


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
        if (daysObj.hasOwnProperty(d.id) ){
          daysCount = daysObj[d.id].daysCount
        }
        return "Count: " + daysCount + "<br>" + d.id;
      })
      .style("left", (event.pageX + 30) + "px") //
      .style("top", (event.pageY) + "px") //
  }
  const mouseleave = function(event, d) {
    tooltip.style("opacity", 0)
  }

          

svg.selectAll()
          .data(dayArr, function(d) {return d.weekday+':'+d.week;})
          .enter()
          .append("rect")
            .attr("class", "cell")
            .style("cursor", "pointer")
            .style("stroke-width", "1")
            .style("stroke", "white")
            .attr("x", function(d) { return x(d.weekday); })
            .attr("y", function(d) { return y(d.week); })
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .attr("fill", function(d) { return (daysObj.hasOwnProperty(d.id) ) ? myColor(daysObj[d.id].daysCount): myColor(0)})
            .on("click", mouseclick)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
const gams = "https://gams.uni-graz.at/"
console.log(data[0]);



/* const calendar = [...Array(21)].map(month => Array(7));


for (let i of calendar) {
  for (let j of i) {
    console.log(j) //Should log numbers from 1 to 10
  }
} */


//make grid

const getDaysArray = function(start, end) {
  let arr = []
  for(arr,dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
      arr.push(new Date(dt));
  }
  return arr;
};

const daysArr = getDaysArray("1576-05-03", "1576-10-25")

const dayMap = daysArr.reduce((a, c, i) => {
  return i % 7 === 0 ? a.concat([daysArr.slice(i, i + 7)]) : a;
}, []);
//console.log(dayMap)

//console.log("RES:",res[1][1])

const dayObj = {}

const weekdays = ['Mo','Di','Mi','Do','Fr','Sa','So']

const calendarWeeks = []

for (w in dayMap){
  calendarWeeks.push("KW"+String(Number(w)+14))
  for (d in dayMap[w]){
    const o = {}
    o.week = "KW"+String(Number(w)+14)
    o.weekday = weekdays[d]
    o.id = dayMap[w][d].toISOString().split('T')[0]

    o.days = data.filter(d => d.tag === o.id);

    o.count = o.days.length;

    dayObj[dayMap[w][d].toISOString().split('T')[0]] = o
    //weeksObj[dayMap[w][d].toISOString().split('T')[0]] = o

  }
}

//Calendar Weeks:  KW21, KW22, etc.

//dayArr = {week, weekday, id},{week, weekday, id}

//const days = []


/* for (d of data){

  console.log("d: ", d)
  if (d){
    if (Object.keys(dayObj).includes(d.tag)){
          d.weekday = dayObj[d.tag].weekday
          d.week = dayObj[d.tag].week
          days.push(d)
    }
} */
            /* //console.log(d)
            if(days.hasOwnProperty(d)){
                days[d].days.push(data[i].id)
                days[d].daysCount = days[d].days.length
                
            }else{
                days[d] = {}
                days[d].days = []
                days[d].days.push(data[i].id)
                days[d].id = d
            } 
        }*/
    
// } 

//console.log("days:", dayObj);


//console.log(data)

/* for (const [i,d] of Object.keys(days).sort().entries()){
  if ( i >= 50){
    daysObj[d] = {};
    daysObj[d].id = d;
    daysObj[d].days = days[d]
    daysObj[d].daysCount = days[d].length
   
  }
} */

//console.log("dayArr:", dayArr)
//console.log("daysObj:", daysObj)

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
          let t = "Tag: " + d.id + "<br>"
          if (d.hasOwnProperty("count")){
            t = t + "Anzahl: " + d.count + "<br>"
            t = t + d.days.map((day) =>  `<a href="${gams+day.pid}" target="_blank">${day.pid}</a>, ${day.archiv}, ${day.gremium}`).join("<br>")
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


     // List of groups (here I have one group per column)
     var allGroup = [... new Set(d3.map(data, function(d){return (d) ? d.gremium : '' }).values())]

     // add the options to the button
     d3.select("#selectButton")
       .selectAll('myOptions')
        .data(allGroup)
       .enter()
       .append('option')
       .text(function (d) { return d; }) // text showed in the menu
       .attr("value", function (d) { return d; })




       

svg.selectAll()
          .data(Object.values(dayObj), function(d) {return d.weekday+':'+d.week;})
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
            .attr("fill", function(d) { return (d.hasOwnProperty("count") ) ? myColor(d.count): myColor(0)})
            .on("click", mouseclick)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)


//.attr("fill", function(d) { return (daysObj.hasOwnProperty(d.id) ) ? myColor(daysObj[d.id].daysCount): myColor(0)})


// set the dimensions and margins of the graph
const margin = {top: 50, right: 50, bottom: 20, left: 50},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#datavis")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
//../data/parallelueberlieferungen.json 
d3.json("../data/out.json ").then( result => {

  console.log("data: ", result);


  //remove not relevant data (no committee)

  const data = result.map((d, idx)=>{

    topicsLst = [];
    for (const property in d) {
      if (d[property] > 0.15){
        topicsLst.push({"id":property, "propability": d[property]});
      }
    }

    return {"id" : `"T${idx}"`, "topics":d, "topicsLst": topicsLst}
  }) 

  console.log("data: ", data);

  
  console.log("data topics length:", Object.keys(data[1].topics).length)

  console.log("data topicsLst length:", data[1].topicsLst.length)

  // Add X axis
  const x = d3.scaleLinear()
      .domain([0, 250])
      .range([0, width ]);

  svg.append("g")
    .call(d3.axisTop(x).tickSizeOuter(0));

  

      // Add Y axis
      const y = d3.scaleBand()
      .domain(data.map((d)=>d.id))
      .range([0, height])
      .padding([0.05])

      svg.append("g")
      .call(d3.axisLeft(y));


       // Tooltip Funktionalität

       const infotext =  d3.select("#infotext");

       const mouseclick = function(event, d) {
        let t = "Topic: " + d.id + "<br>"
        
          t = t + "Anzahl: " + d.topicsLst.length + "<br><table>"

          

          for (const topic of d.topicsLst.sort((a, b) => b.propability - a.propability)){
            t = t + `<row><cell>${topic.id}</cell><cell>${topic.propability}</cell></row>`
          }
          t = t + "</table><br>"
               
       /*  d3.select(this)
        .style("stroke", "red") */
        infotext.html(t);

      

      }

       

  // Show the bars
  svg.selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
        .attr("class", "bar")
        .attr("fill", "#69b3a2")
        .attr("y", (d) =>  y(d.id))
        .attr("x", (d) =>  0)
        .attr("height", y.bandwidth())
        .attr("width", (d) => x(d.topicsLst.length))
        .on("click", mouseclick)


 


    })

  
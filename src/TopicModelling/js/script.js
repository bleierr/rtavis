

// set the dimensions and margins of the graph
const MARGIN = {top: 200, right: 50, bottom: 20, left: 50},
    WIDTH = 800 - MARGIN.left - MARGIN.right,
    HEIGHT = 1000 - MARGIN.top - MARGIN.bottom;



// append the svg object to the body of the page
const svg = d3.select("#datavis")
  .append("svg")
    .attr("width", WIDTH + MARGIN.left + MARGIN.right)
    .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
  .append("g")
    .attr("transform",
          "translate(" + MARGIN.left + "," + MARGIN.top + ")");


          
  const svg2 = d3.select("#datavis2")
      .append("svg")
        .attr("width", WIDTH + 400 + MARGIN.left + MARGIN.right)
        .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
      .append("g")
        .attr("transform",
              "translate(" + MARGIN.left + "," + MARGIN.top + ")");
  

  const filterData = function (data, propabilityRange){

    return data.map((d) => {
      console.log("propabilityRange: ", propabilityRange);
      return {"id" : d.id, "topicsLst": d.topicsLst.filter((t)=>t.propability > propabilityRange)}

    })
  }
  
  const mouseclick = function(event, d) {
    const infotext =  document.getElementById("infotext");

    let topicHeading = (d.id) ? d.id : `${d.topic} - <a href="https://gams.uni-graz.at/o:rta1576.listterm#${d.term.replace('listterm:', '')}" target="_blank">${d.term}</a>`;

    console.log(infotext)
    infotext.innerHTML = `Anzahl der Texte: ${d.topicsLst.length} | ${topicHeading}`;

    console.log("In onclick")

    table.clear().draw();
    table.rows.add(d.topicsLst.map((row)=>[ `<a href="https://gams.uni-graz.at/o:${row.pid}#${row.did}" target="_blank">${row.id}</a>`, row.title, row.date, row.propability, row.topics])).draw();

    
  }

let url = "../data/out25.json";

const hash = window.location.hash.substring(1);

  if(hash) {
    if(['25', '50', '75'].indexOf(hash)){
      url = `../data/out${hash}.json`;
    }
  } 

Promise.all([
  d3.json(url),
  d3.json("../data/meta.json")
]).then( ([result, meta]) => {

  console.log("data: ", result);


  console.log("Meta", meta)

  


  mapTopics = (data) => {


    const lst = []
    

    console.log("DATA in map: ", data)

    for (let d of data){
      const terms = {}

      if (d.topicsLst){
        for (let tl of d.topicsLst){
          if(tl.topics){

            for (let t of tl.topics.split(" ")){
              if(terms.hasOwnProperty(t)){
                terms[t].count = terms[t].count + 1;
                terms[t].topicsLst.push(tl)
              }else{
                console.log(tl)
                terms[t] = {}
                terms[t].count = 1;
                terms[t].topicsLst = [];
                terms[t].topicsLst.push(tl)
              }
            }
          }
        }  
      }

     lst.push(Object.keys(terms).map((t) => {
                    return {"topic":d.id, "term":t, "count":terms[t].count, "topicsLst":terms[t].topicsLst}
                  }));
    }
    return lst.flat(1)
  }

  

  //console.log("TOPICS: ", termTopicDic)


  const metaDic = {}

  for (let m of meta){
    metaDic[m.file_name] = m
  }

  console.log("Meta Dic", metaDic)


  const data = result.map((d, idx)=>{

      topicsLst = [];
      for (const property in d) {
          topicsLst.push({"id":property, "propability": d[property], "title": metaDic[property].title, "pid": metaDic[property].PID,
                        "did": metaDic[property].div_ID,"date": metaDic[property].date, "topics": metaDic[property].topics});
      }
      return {"id" : `"T${idx}"`, "topics":d, "topicsLst": topicsLst};
    });

  console.log("data: ", data);

  let lstTerms = []

  for (let d of data){
    if (d.topicsLst){
      for (let tl of d.topicsLst){
        if(tl.topics){
          lstTerms = lstTerms.concat(tl.topics.split(" "))
        }
      }  
    }
  }
  lstTerms = [...new Set(lstTerms)];

  console.log("LSTTERMS", lstTerms)

  
  console.log("data topics length:", Object.keys(data[1].topics).length)

  console.log("data topicsLst length:", data[1].topicsLst.length)

  // Add X axis
  const x = d3.scaleLinear()
      .domain([0, 250])
      .range([0, WIDTH ]);

  svg.append("g")
    .call(d3.axisTop(x).tickSizeOuter(0));

      // Add Y axis
      const y = d3.scaleBand()
      .domain(data.map((d)=>d.id))
      .range([0, HEIGHT])
      .padding([0.05])

      svg.append("g")
      .call(d3.axisLeft(y));


      function update(data){

        const t = svg.transition().duration(750);

        console.log("data: ", data)

        svg.selectAll(".bar")
        .data(data)
        .join(
          enter => enter.append("rect")
          .attr("class", "bar")
          .attr("fill", "#69b3a2")
          .attr("y", (d) =>  y(d.id))
          .attr("x", (d) =>  0)
          .attr("height", y.bandwidth())
          .on("click", function(e, d){
            mouseclick(e, d);
            //updateMinivis(d);
          })
          .call(enter => enter.transition(t)
                  .attr("width", (d) => x(d.topicsLst.length))), 
          update => update.call(update => update.transition(t)
                  .attr("width", (d) => x(d.topicsLst.length))),
          exit => exit.remove()
        );
          

      }


      /***********Datavis 2***********/



     
      

      // Add X axis
      const xAxis2 = d3.scaleBand()
      .domain(lstTerms)
      .range([0, WIDTH + 400])
      .padding([0.05])

      svg2.append("g")
            .attr("class", "x axis")
            //.attr("transform", "translate(0," + (HEIGHT) + ")")
            .call(d3.axisTop(xAxis2).tickSizeOuter(0))
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "1.1em")
            .attr("transform", "rotate(90)");

      

      // Add Y axis
      const yAxis2 = d3.scaleBand()
      .domain(data.map((d)=>d.id))
      .range([0, HEIGHT])

      svg2.append("g")
      .call(d3.axisLeft(yAxis2));

      // Build color scale
      var myColor = d3.scaleLinear()
                .range(["white","blue", "#46505E"])
                .domain([0.0000001,15, 50])


      function updatevis2(data2){
        console.log("Works");

        const t = svg2.transition().duration(750);

        console.log("data 2: ", data2)

        svg2.selectAll(".zell")
        .data(data2, function(d) {return d.topic+':'+d.term;})
        .join(
          enter => enter.append("rect")
          .attr("class", "zell")
          .style("stroke-width", "1")
          .style("stroke", "black")
          .attr("fill", (d) =>  (d.hasOwnProperty("count") ) ? myColor(d.count): myColor(0))
          .attr("x", (d) =>  {return xAxis2(d.term)})
          .attr("width", xAxis2.bandwidth())          
          .attr("y", (d) => yAxis2(d.topic) )
          .attr("height", yAxis2.bandwidth())
          .on("click", function(e, d){
            mouseclick(e, d);
            //updateMinivis(d);
          }), 
          update => update.transition(t)
                          .attr("fill", (d) =>  (d.hasOwnProperty("count") ) ? myColor(d.count): myColor(0)),
          exit => exit.remove()
        );


        /* .append("rect")
                .attr("class", "cell")
                .style("cursor", "pointer")
                .style("stroke-width", "1")
                .style("stroke", "white")
                .attr("x", function(d) { return x(d.weekday); })
                .attr("y", function(d) { return y(d.week); })
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .attr("fill", function(d) { return (d.hasOwnProperty("count") ) ? myColor(d.count): myColor(0)})

 */

      }

      const slider = document.getElementById('propabilityRange')

      slider.onchange = function(d){
        const selectedValue = d.target.value;
        document.getElementById("slidervalue").innerHTML = selectedValue;

        const fd = filterData(data, selectedValue);
        console.log("DATA: ", fd);
        

        const td = mapTopics(fd)
        console.log("TOPICS: ", td);
        updatevis2(td)

        update(fd);

      }

      const fd = filterData(data, document.getElementById('propabilityRange').value);

      update(fd);

      updatevis2(mapTopics(fd));


  })
    



let table =  new DataTable('#detailsTable');



  
    

  
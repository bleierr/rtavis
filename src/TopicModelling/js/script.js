

// set the dimensions and margins of the graph
const MARGIN = {top: 100, right: 50, bottom: 100, left: 50},
    WIDTH = 1200 - MARGIN.left - MARGIN.right,
    HEIGHT = 500 - MARGIN.top - MARGIN.bottom;



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
        .attr("width", WIDTH + MARGIN.left + MARGIN.right)
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
    const infotext =  d3.select("#infotext");
    infotext.text(`Anzahl der Texte: ${d.topicsLst.length} | ${d.id}`);

    console.log("In onclick")

    table.clear().draw();
    table.rows.add(d.topicsLst.map((row)=>[ `<a href="https://gams.uni-graz.at/o:${row.pid}#${row.did}" target="_blank">${row.id}</a>`, row.title, row.date, row.propability, row.topics])).draw();

    
  }




Promise.all([
  d3.json("../data/out.json"),
  d3.json("../data/meta.json")
]).then( ([result, meta]) => {

  console.log("data: ", result);


  console.log("Meta", meta)



  const mapTopics = (data)=>{


    const dict = {}

    console.log("DATA in map: ", data)

    for (let d of data){

      if (d.topicsLst){
        for (let tl of d.topicsLst){
          if(tl.topics){

            const topics = tl.topics.split(" ");
            for (let t of topics){
      
              if(dict.hasOwnProperty(t)){
                dict[t].push(tl);
              }else{
                dict[t]=[];
                dict[t].push(tl);
              }
            }
          }
        }  
      }
    }

    return Object.keys(dict).map((k) => {
                                  return {"id" : k, "list" : dict[k]}
                              });

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
      .domain(mapTopics(data).map((d)=>d.id))
      .range([0, WIDTH])
      .padding([0.05])

      svg2.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (HEIGHT) + ")")
            .call(d3.axisBottom(xAxis2).tickSizeOuter(0))
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

      

      // Add Y axis
      const yAxis2 = d3.scaleLinear()
      .domain([0,100])
      .range([HEIGHT,0])

      svg2.append("g")
      .call(d3.axisLeft(yAxis2));


      function updatevis2(data){
        console.log("Works");

        const t = svg2.transition().duration(750);

        console.log("data: ", data)

        svg2.selectAll(".bar")
        .data(data)
        .join(
          enter => enter.append("rect")
          .attr("class", "bar")
          .attr("fill", "#69b3a2")
          .attr("x", (d) =>  xAxis2(d.id))
          .attr("width", xAxis2.bandwidth())          
          .call(enter => enter.transition(t)      
                  .attr("y", (d) => yAxis2(d.list.length) )
                  .attr("height", (d) => HEIGHT - yAxis2(d.list.length))), 
          update => update.call(update => update.transition(t)
                  .attr("y", (d) => yAxis2(d.list.length) )
                  .attr("height", (d) => HEIGHT - yAxis2(d.list.length))),
          exit => exit.remove()
        );





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



  
    

  
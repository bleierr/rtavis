

// set the dimensions and margins of the graph
const margin = {top: 100, right: 50, bottom: 20, left: 50},
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


          
  const svgMini = d3.select("#minivis")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
  

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




      /***********MINI VIS***********/

      // Add X axis
      const xMini = d3.scaleBand()
      .domain(data.map((d)=>d.id))
      .range([0, width])
      .padding([0.05])

      svg.append("g")
      .call(d3.axisBottom(x).tickSizeOuter(0));

      // Add Y axis
      const yMini = d3.scaleLinear()
      .domain([0,50])
      .range([0, height])

      svg.append("g")
      .call(d3.axisLeft(y));


      function updateMinivis(data){
        console.log("Works");

        const t = svgMini.transition().duration(750);

        console.log("data: ", data)

        svgMini.selectAll(".bar")
        .data(data)
        .join(
          enter => enter.append("rect")
          .attr("class", "bar")
          .attr("fill", "#69b3a2")
          .attr("y", (d) =>  0)
          .attr("x", (d) =>  yMini(d.id))
          .attr("height", yMini.bandwidth())
          .on("click", function(e, d){
            mouseclick(e, d);
            //updateMinivis(d);
          })
          .call(enter => enter.transition(t)
                  .attr("width", (d) => xMini(d.topicsLst.length))), 
          update => update.call(update => update.transition(t)
                  .attr("width", (d) => xMini(d.topicsLst.length))),
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
        updateMinivis(td)

        update(fd);

      }

      update(filterData(data, document.getElementById('propabilityRange').value));


  })
    



let table =  new DataTable('#detailsTable');



  
    

  
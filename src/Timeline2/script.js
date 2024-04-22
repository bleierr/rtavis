
//http://glossa.uni-graz.at/archive/objects/query:rta1576.timeline/methods/sdef:Query/getJSON

/* fetch("https://glossa.uni-graz.at/archive/objects/query:rta1576.timeline/methods/sdef:Query/getJSON", {
    headers: {'Accept': 'application/json'}
    })
    .then(res => res.json()) // parse response as JSON (can be res.text() for plain response)
    .then( (r) => {   */

    const data = JSONDATA;

    const DAY = 1000*60*60*24


    // set the dimensions and margins of the graph
    const margin = {top: 50, right: 50, bottom: 100, left: 100},
    width = 1200 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#datavis")
                        .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform",
                              "translate(" + margin.left + "," + margin.top + ")")
                        .call(d3.zoom().on("zoom", function (e) {
                            d3.select('svg g').attr("transform", e.transform)
                                console.log("zooming")
                             }));


    console.log(data)

      const groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
      
    const daysArray = function(startDate, endDate) {
        let arr=[]
        for(date=new Date(startDate); date<=new Date(endDate); date.setDate(date.getDate()+1)){
            arr.push(new Date(date));
        }
        return arr;
    };
    
      const groupedData = groupBy(data.map( (j) => {
        const obj = {}
        obj.date = j.from;
        obj.endDate = j.to;
        obj.dateType = j.dateType;
        obj.url = j.pid;
        obj.label = j.label;
        obj.collection = j.collection;
        obj.repository = j.repository;

        return obj

      }), "dateType")



      const dayFilter = (d) => d


      const monthFilter = (d, idx)=>{
                                  if(idx===0) return true;
                                  if (d.getDate()===1) return true;
                                  return false;
                                }

      const days = daysArray("1555-05-03", "1576-08-15").filter(dayFilter)

      

      console.log("Days: ", days)

      console.log("Grouped data: ", groupedData)

      //ganz unten eine Zeile mit "alle Daten"

      //select our chart wrapper
      const graph = d3.select(".chart");

      const subgroups = ["single-day-event", "multiple-day-event"]

      const dataWithCategories = data.map((d)=>{
        const dNew = d;
        if (d.from === d.to){
          dNew.eventType = "single-day-event"
        }
        else{
          dNew.eventType = "multiple-day-event"
        }
        return dNew

      }) 



      const subgroupsCount = days.map((day)=>{
        const o = {}
        o["id"] = day.toISOString().split('T')[0]
        o["group"] = {}
        o["group"]["id"]  = day.toISOString().split('T')[0]

        for (let i = 0; i < subgroups.length; i++){
          //console.log(day, " ", subgroups[i])
          //console.log("date with categories: ", dataWithCategories.filter((d) => d.from === day.toISOString().split('T')[0]).filter((d) => d.eventType === subgroups[i]).length)
          o["group"][subgroups[i]] = dataWithCategories.filter((d) => d.from === day.toISOString().split('T')[0]).filter((d) => d.eventType === subgroups[i]).length
        }


        return o
      })


      /* let sgc = subgroupsCount.map((s)=>{
      
        const obj = {}
        obj["id"] = s.id
        obj["herrschaft"] = {}
        obj["herrschaft"]["id"] = s.id
  
        for (let i = 0; i < subgroups.length; i++){
            let len = 0
            let hits = s["group"].filter((o) => o.herrschaft === subgroups[i])
            if(hits.length > 0){
                len = hits.length
            }
            obj["herrschaft"][subgroups[i]] = len
            
        }
        return obj
    }) */

    console.log("subgroupsCount: ", subgroupsCount)


      const stackedData = d3.stack()
              .keys(subgroups)
              (subgroupsCount.map((d)=>d.group)) 


      //console.log("Stacked data: ", stackedData)


        // Add y axis
        const y = d3.scaleLinear()        
                  .domain([0, 50])
                  .range([height, 0 ]);

        

        // Add x axis


      //const x = d3.scaleBand()"1576-05-03", "1576-08-15"
      const x =  d3.scaleTime([new Date("1555-05-03"), new Date("1576-08-15")], [0, width]);
              /* .domain(days.map(d=>d.toISOString().split('T')[0]))
              .range([0, width])
              .padding([0.2]) */

    svg.append("g")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(d3.timeFormat("%b %Y")));

      svg.append("g")
      //.attr("transform", "translate(" + width + ",0)")
      .call(d3.axisLeft(y));


      // color palette = one color per subgroup
      const color = d3.scaleOrdinal()
      .domain(days.map(d=>d.toISOString().split('T')[0]))
      .range(["#4b5bdc", "#0cd36d"])


    /*   svg.append("g")
      .selectAll("g")
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .enter().append("g")
        .attr("fill", "#ccc")
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data((d) => d)
        .enter().append("rect")
          .attr("x", (d) =>  x(new Date(d.data.id)))
          .attr("y", (d) =>  y(d[0]))
          .attr("width", "10px")
          .attr("height",(d) => y(d[0]) - y(d[1])) */
    
// Show the bars
svg.append("g")
.attr("class", "bar-segments")
  .selectAll("g")
      // Enter in the stack data = loop key per key = group per group
  .data(stackedData)
  .enter().append("g")
    .attr("fill", (d) => color(d.key))
    
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data((d) => d)
    .enter().append("rect")
      .attr("x", (d) =>  x(new Date(d.data.id)))
      .attr("y", (d) =>  y(d[1]))
      .attr("width", "5")
      .attr("height", (d) =>  y(d[0]) - y(d[1]))
      /* .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave) */



      /* const xAxisLabels = graph.append("div")
                    .attr("class", "timeline-labels")
      xAxisLabels.selectAll(".label-container")
                    .data(days)
                    .join("div")
                    .attr("class", "label-container")
                    .append("div")
                      .attr("class", "x-label")
                      .text(d => d.toISOString().split('T')[0]); */




      // for (const timelineCategory in groupedData){

      //   console.log("grouped data entry: ", groupedData[timelineCategory])

       
        
      //   /* const entryData = []

      //   for (const [key, value] of Object.entries(groupBy(groupedData[k],"date"))) {
      //     const dict = {}
      //     dict.key = key
      //     dict.values = value
        
      //     entryData.push(dict)
      //   }


      //   const entryDict = groupBy(groupedData[k],"date")


      //   console.log("entry data: ", entryData) */
        

      //   //loop over our nested data and render a container
      //   //for each concert venue
      //   const div = graph.append("div")
      //       .attr("class", "timeline")


      //   const group = div.selectAll(".box-container")
      //     .data(days)
      //     .join("div")
      //     .attr("class", "box-container")
      //     /* .append("div")
      //          .attr("class","x-label")
      //          .text(d => d.toISOString().split('T')[0]); */

      //   console.log("data.map: ",groupedData[timelineCategory])

      //     //color scale
      //   const colors = ["#FF8E79", "#FF6B5B", "#FF4941", "#DB1D25"];
      //   scaleColor = d3.scaleOrdinal()
      //     .domain(groupedData[timelineCategory].map(d => d.date))
      //     .range(colors);

      //   //https://www.williamrchase.com/writing/2019-10-13-animated-waffle-charts-with-d3-and-gsap
      //   //https://lvngd.com/blog/building-pictogram-grids-d3js/
      //   //https://d3js.org/d3-array/group






      //  group
      //     .selectAll(".box")
      //     .data((d, idx) => {

      //       const timelineStart = d;
      //       const timelineEnd = days[idx+1]


      //       const filteredArr = groupedData[timelineCategory].filter((ed)=> {

      //         const dateStart = new Date(ed.date)
      //         let dateEnd = ""
      //         if (ed.date===ed.endDate){
      //           if(ed.endDate.length === 10){
      //             dateEnd = new Date(new Date(ed.endDate).getTime() + DAY)
      //           }
      //           //for month and year still necessary 1576-04

      //         }
      //         else dateEnd = new Date(ed.endDate)

      //         if (d.getTime() === new Date("1576-07-14").getTime()){
      //           /* console.log("date: ",new Date(ed.date).getTime())
      //           console.log("endDate: ", new Date(ed.endDate).getTime()) 
      //           console.log("d.getTime(): ", d.getTime())  */
      //           console.log("ed: ", d) 
      //           console.log("ed + 1: ", days[idx+1]) 
      //         }
      //         //if (new Date(ed.date).getTime() <= d.getTime() &&  d.getTime() <= new Date(ed.endDate).getTime()){
      //         if (timelineStart < dateEnd && dateStart < timelineEnd){
      //           return true
      //         }
      //         return false 
      //       })
      //       /* if (d.toISOString().split('T')[0] in entryDict){
      //         return entryDict[d.toISOString().split('T')[0]]
      //       }
      //       else{
      //         return []
      //       } */
      //       //console.log("filteredArr: ", filteredArr)
      //       if (filteredArr.length>0){
      //         console.log("filteredArr: ", filteredArr)
      //       }

      //       return filteredArr//.map((d)=>d.values).flat(1)
      //     })
      //     .join("div")
      //     .attr("class", "box")
      //     .style("background-color", (d)=>{
      //       console.log(d)
      //       if (d.date === d.endDate){
      //         return "#FF4941"
      //       }
      //       return "#FF8E79"
      //     });
        
 



      // }



      



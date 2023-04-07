const gams = "https://gams.uni-graz.at/"

const colorScheme = [
  "#63b598", "#8a96c6", "#9685eb", "#a48a9e", "#c6e1e8", "#648177", "#0d5ac1",
  "#f205e6", "#1c0365", "#14a9ad", "#4ca2f9", "#a4e43f", "#d298e2", "#6119d0",
  "#d2737d", "#c0a43c", "#f2510e", "#651be6", "#79806e", "#61da5e", "#cd2f00",
  "#9348af", "#01ac53", "#c5a4fb", "#996635", "#b11573", "#4bb473", "#75d89e",
  "#2f3f94", "#2f7b99", "#da967d", "#34891f", "#b0d87b", "#ca4751", "#7e50a8",
  "#c4d647", "#e0eeb8", "#11dec1", "#289812", "#566ca0", "#dce77a", "#2f1179",
  "#935b6d", "#916988", "#513d98", "#aead3a", "#9e6d71", "#4b5bdc", "#0cd36d",
  "#250662", "#cb5bea", "#228916", "#ac3e1b", "#df514a", "#539397", "#880977",
  "#f697c1", "#ba96ce", "#679c9d", "#c6c42c", "#5d2c52", "#48b41b", "#e1cf3b",
  "#5be4f0", "#57c4d8", "#a4d17a", "#be608b", "#96b00c", "#088baf", "#f158bf",
  "#e145ba", "#ee91e3", "#05d371", "#5426e0", "#4834d0", "#802234", "#6749e8",
  "#0971f0", "#8fb413", "#b2b4f0", "#c3c89d", "#c9a941", "#41d158", "#fb21a3",
  "#51aed9", "#5bb32d", "#21538e", "#89d534", "#d36647", "#7fb411", "#0023b8",
  "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3", "#79352c", "#521250",
  "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec", "#1bb699", "#6b2e5f",
  "#64820f", "#21538e", "#89d534", "#d36647", "#7fb411", "#0023b8", "#3b8c2a",
  "#986b53", "#f50422", "#983f7a", "#ea24a3", "#79352c", "#521250", "#c79ed2",
  "#d6dd92", "#e33e52", "#b2be57", "#fa06ec", "#1bb699", "#6b2e5f", "#64820f",
  "#9cb64a", "#996c48", "#9ab9b7", "#06e052", "#e3a481", "#0eb621", "#20f6ba",
  "#b2db15", "#aa226d", "#792ed8", "#73872a", "#520d3a", "#cefcb8", "#a5b3d9",
  "#7d1d85", "#c4fd57", "#f1ae16", "#8fe22a", "#ef6e3c", "#243eeb", "#dd93fd",
  "#3f8473", "#e7dbce", "#421f79", "#7a3d93", "#635f6d", "#93f2d7", "#9b5c2a",
  "#15b9ee", "#0f5997", "#409188", "#911e20", "#1350ce", "#10e5b1", "#77ecca",
  "#cb2582", "#ce00be", "#32d5d6", "#608572", "#c79bc2", "#00f87c", "#77772a",
  "#6995ba", "#608fa4", "#f07815", "#8fd883", "#060e27", "#96e591", "#21d52e",
  "#d00043", "#b47162", "#1ec227", "#4f0f6f", "#1d1d58", "#947002", "#bde052",
  "#e08c56", "#28fcfd", "#36486a", "#d02e29", "#1ae6db", "#3e464c", "#a84a8f",
  "#911e7e", "#3f16d9", "#0f525f", "#ac7c0a", "#b4c086", "#c9d730", "#30cc49",
  "#3d6751", "#fb4c03", "#640fc1", "#62c03e", "#d3493a", "#88aa0b", "#406df9",
  "#615af0", "#2a3434", "#4a543f", "#79bca0", "#a8b8d4", "#00efd4", "#7ad236",
  "#7260d8", "#1deaa7", "#06f43a", "#823c59", "#e3d94c", "#dc1c06", "#f53b2a",
  "#b46238", "#2dfff6", "#a82b89", "#1a8011", "#436a9f", "#1a806a", "#4cf09d",
  "#c188a2", "#67eb4b", "#b308d3", "#76fc1b", "#af3101", "#71b1f4", "#a2f8a5",
  "#e23dd0", "#d3486d", "#00f7f9", "#474893", "#3cec35", "#1c65cb", "#5d1d0c",
  "#2d7d2a", "#07d7f6", "#5cdd87", "#a259a4", "#e4ac44", "#1bede6", "#8798a4",
  "#d7790f", "#b2c24f", "#de73c2", "#d70a9c", "#88e9b8", "#c2b0e2", "#86e98f",
  "#ae90e2", "#1a806b", "#436a9e", "#0ec0ff", "#f812b3", "#b17fc9", "#8d6c2f",
  "#d3277a", "#2ca1ae", "#dba2e6"
]

// /rtavis/src
//d3.json("../data/test.json").then( data => {

// set the dimensions and margins of the graph
const margin = {top: 50, right: 1400, bottom: 20, left: 20},
    width = 2300 - margin.left - margin.right,
    height = 4000 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#datavis")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.json("../data/Parallelueberlieferungen.json").then( data => {

  // List of subgroups = header of the csv files = soil condition here
  
  //var subgroups = data.columns.slice(1)

  console.log(data)

  //const subgroups = Object.keys(data[0]).slice(1)
  const subgroups = Array.from(new Set(data.map((d) => d.herrschaft)))

  console.log("Sub-groups:", subgroups)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  //const groups = data.map((d)=>d.group)

  const groups = Array.from(new Set(data.map((d) => d.title)))

  console.log("Groups:", groups.length)

  // Add X axis
  const x = d3.scaleLinear()
      .domain([0, 65])
      .range([0, width ]);

  svg.append("g")
    .call(d3.axisTop(x).tickSizeOuter(0));

  

    const subgroupsCount = groups.map((group)=>{
      const o = {}
      o["id"] = group
      o["group"] = data.filter((d) => d.title === group )
      return o
  })

  let sgc = subgroupsCount.map((s)=>{
      
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
  })

  console.log("SG count", sgc)
  function compare( a, b ) {
    //console.log(d3.sum(Object.values(a.herrschaft).filter((val)=>typeof(val)==='number'? val : 0)))

    if ( d3.sum(Object.values(a.herrschaft).filter((val)=>typeof(val)==='number'? val : 0)) > d3.sum(Object.values(b.herrschaft).filter((val)=>typeof(val)==='number'? val : 0))){
      return -1;
    }
    if ( d3.sum(Object.values(a.herrschaft).filter((val)=>typeof(val)==='number'? val : 0)) < d3.sum(Object.values(b.herrschaft).filter((val)=>typeof(val)==='number'? val : 0)) ){
      return 1;
    }
    return 0;
  }

  sgc = sgc.sort(compare)

  console.log("SG count", sgc)


  const stackedData = d3.stack()
      .keys(subgroups)
      (sgc.map((h)=>h.herrschaft)) 

  /*  var stackedData = d3.stack()
    .keys(subgroups)
    (data) */

      // Add Y axis
      const y = d3.scaleBand()
      .domain(sgc.map((s)=>s.id))
      .range([0, height])
      .padding([0.2])

      svg.append("g")
      .attr("transform", "translate(" + width + ",0)")
      .call(d3.axisRight(y));


      const colorRange = colorScheme.slice(0,groups.length)
      console.log("color range: ", colorRange)

      console.log("subgroups count: ", subgroups)



      // color palette = one color per subgroup
      const color = d3.scaleOrdinal()
      .domain(groups)
      .range(colorRange)

      //stack the data? --> stack per subgroup
      /*const stackedData = d3.stack()
      .keys(subgroups)
      (data)*/






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
        var subgroupName = d3.select(this.parentNode).datum().key;
        var subgroupValue = d.data[subgroupName];
      tooltip
          .html("Herrschaft: " + subgroupName + "<br>" + "Anzahl: " + subgroupValue)
          .style("opacity", 1)
    }
    const mousemove = function(event, d) {
      tooltip
      .style("left", (event.pageX + 90) + "px") //
      .style("top", (event.pageY) + "px") //
    }
    const mouseleave = function(event, d) {
      tooltip
        .style("opacity", 0)
    }



console.log("StackedData: ", stackedData)

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", (d) => color(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data((d) => d)
      .enter().append("rect")
        .attr("y", (d) =>  y(d.data.id))
        .attr("x", (d) =>  x(d[0]))
        .attr("height", 20)
        .attr("width",(d) =>  x(d[1]-d[0]))
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


 // A function that update the chart
 function update(selectedGroup) {

  // Create new data with the selection?
  
  let filteredData = []
  if (selectedGroup==="Alle Herrschaften"){
    filteredData = data
  }else{
    filteredData = data.filter(function(d){return d.herrschaft == selectedGroup })
  }

  console.log("selected group", selectedGroup)

  console.log("Filtered Data", filteredData)
  // Give these new data to update line

  d3.selectAll('rect.bar').remove()

  d3.select("#infotext").text("");

  svg.selectAll("bar")
          .data(createTextsObj(filteredData))
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", 0)
          .attr("y", function(d) { return y(d.id); })
          .attr("width", function(d) { return  x(d3.sum(Object.values(d.herrschaft))) ; })
          .attr("height", 20)
          .attr("fill", function(d) { return color(d.key); })
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)
 

}



    // List of groups (here I have one group per column)
    var allGroup = ["Alle Herrschaften"].concat([... new Set(d3.map(data, function(d){return (d) ? d.herrschaft.trim(' ') : '' }).values())].sort())


    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
        .data(allGroup)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; })


      // When the button is changed, run the updateChart function
      d3.select("#selectButton").on("change", function(d) {
          // recover the option that has been chosen
          var selectedOption = d3.select(this).property("value")
      
      
          update(selectedOption)
      })










    })

    //.attr("width", function(d) { return  x(d3.sum(Object.values(d.herrschaft))) ; })

    

      /*   console.log("data: ", data);


        const subgroups = Object.keys(data[0])

        console.log("subgroup: ", subgroups)

        const groups = Array.from(new Set(data.map((d) => d.title)))

        const herrschaft = Array.from(new Set(data.map((d) => d.herrschaft)))

        console.log("group: ", groups)

        console.log("herrschaft: ", herrschaft)
        
        const createTextsObj = (data) => {

                const textsObj = {}

                for (let i = 0; i < data.length; i++){
                    if(data[i]){
                            if(textsObj.hasOwnProperty(data[i].title)){
                                textsObj[data[i].title].push(data[i])
                            }else{
                                textsObj[data[i].title] = []
                                textsObj[data[i].title].push(data[i])
                            }
                        
                    }

                } 

                console.log(Object.keys(textsObj).sort())

                let textsArr = [];

                for (const [i, d] of Object.keys(textsObj).entries()){
                    const o = {};
                    //o.id = d;
                    //o.id = i;
                    o.versions = textsObj[d]
                    o.title = d
                    o.versionsCount = textsObj[d].length
                    textsArr.push(o)
                }

                const stackedData = []

                for (const [i, d] of Object.keys(textsObj).entries()){
                    const o = {};
                    
                    for (let i = 0; i < Object.keys(textsObj).length; i++){ 

                    o.versions = textsObj[d]
                    o.title = d
                    o.versionsCount = textsObj[d].length
                    textsArr.push(o)
                    }
                }

                textsArr = textsArr.sort((a,b) => (a.versionsCount > b.versionsCount) ? 1 : ((b.versionsCount > a.versionsCount) ? -1 : 0))

                for (let i = 0; i < textsArr.length; i++) 
                    { 
                    textsArr[i].id = textsArr.length - i
                    }
                    
                return textsArr

            }

    const textsArr = createTextsObj(data)


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
                .domain(groups)
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
                return d.title;
            })
            .style("left", (event.pageX + 30) + "px") //
            .style("top", (event.pageY) + "px") //
            }
        const mouseleave = function(event, d) {
            tooltip.style("opacity", 0)
            }

        
        const subgroupsCount = groups.map((group)=>{
            const o = {}
            o["id"] = group
            o["group"] = data.filter((d) => d.title === group )
            return o
        })

        const sgc = subgroupsCount.map((s)=>{
            
            const obj = {}
            obj["id"] = s.id
            obj["herrschaft"] = {}

            for (let i = 0; i < herrschaft.length; i++){
                let len = 0
                let hits = s["group"].filter((o) => o.herrschaft === herrschaft[i])
                if(hits.length > 0){
                    len = hits.length
                }
                obj["herrschaft"][herrschaft[i]] = len
                
            }
            return obj
        })



        console.log("SG count", sgc)


        const stackedData = d3.stack()
            .keys(herrschaft)
            (sgc.map((h)=>h.herrschaft))

            console.log("stacked data: ", stackedData)


           // color palette = one color per subgroup
        const color = d3.scaleOrdinal()
           .domain(herrschaft)
           .range(['#e41a1c','#377eb8','#4daf4a'])

        console.log("stacked data")
        stackedData.forEach((d)=>{
            console.log(d)
            console.log(d.key)
            console.log(d[1])

        })

                // Bars
        svg.append("g")
                .selectAll("g")
                .data(stackedData)
                .enter().append("g")
                .attr("fill", function(d) { return color(d.key); })
                .selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                    .attr("x", function(d) { return y(d.key); })
                    .attr("y", function(d) { return x(d[1]); })
                    .attr("height", function(d) { return x(d[0]) - x(d[1]); })
                    .attr("width",y.bandwidth())

     
        


         // A function that update the chart
    function update(selectedGroup) {

        // Create new data with the selection?
        
        let filteredData = []
        if (selectedGroup==="Alle Herrschaften"){
          filteredData = data
        }else{
          filteredData = data.filter(function(d){return d.herrschaft == selectedGroup })
        }
  
        console.log("selected group", selectedGroup)

        console.log("Filtered Data", filteredData)
        // Give these new data to update line
  
        d3.selectAll('rect.bar').remove()
  
        d3.select("#infotext").text("");
  
        svg.selectAll("bar")
                .data(createTextsObj(filteredData))
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", 0)
                .attr("y", function(d) { return y(d.id); })
                .attr("width", function(d) { return  x(d3.sum(Object.values(d.herrschaft))) ; })
                .attr("height", 20)
                .attr("fill", function(d) { return color(d.key); })
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
       
      
      }



       // List of groups (here I have one group per column)
       var allGroup = ["Alle Herrschaften"].concat([... new Set(d3.map(data, function(d){return (d) ? d.herrschaft.trim(' ') : '' }).values())].sort())


       // add the options to the button
       d3.select("#selectButton")
         .selectAll('myOptions')
           .data(allGroup)
         .enter()
         .append('option')
         .text(function (d) { return d; }) // text showed in the menu
         .attr("value", function (d) { return d; })


        // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function(d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
        
        
            update(selectedOption)
        })

 */
const gams = "https://gams.uni-graz.at/"


d3.json("/src/data/parallelueberlieferungen.json").then( data => {
        console.log("data: ", data);


        
        const createTextsObj = (data) => {

                const textsObj = {}

                for (let i = 0; i < data.length; i++){
                    if(data[i]){
                            if(textsObj.hasOwnProperty(data[i].title)){
                                textsObj[data[i].title].push(data[i].id)
                            }else{
                                textsObj[data[i].title] = []
                                textsObj[data[i].title].push(data[i].id)
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
                .domain(textsArr.map(function(d) { return d.id; }))
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




                // Bars
        svg.selectAll("bar")
                .data(createTextsObj(data))
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", 0)
                .attr("y", function(d) { return y(d.id); })
                .attr("width", function(d) { return  x(d.versionsCount) ; })
                .attr("height", 20)
                .attr("fill", "#69b3a2")
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
                .attr("width", function(d) { return  x(d.versionsCount) ; })
                .attr("height", 20)
                .attr("fill", "#69b3a2")
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
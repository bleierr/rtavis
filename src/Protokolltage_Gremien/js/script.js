const gams = "https://gams.uni-graz.at/"
//console.log(data[0]);

//https://glossa.uni-graz.at/archive/objects/query:rta1576.timeline/methods/sdef:Query/getJSON
//"../data/protokollauswertung.json"
d3.json("https://glossa.uni-graz.at/archive/objects/query:rta1576.timeline/methods/sdef:Query/getJSON").then( result => {
    console.log("data: ", result);


    //remove not relevant data (no committee)

    const data = result.filter((d)=> d.hasOwnProperty("committee"))

    console.log("data: ", data);
    
    //make grid

    const getDaysArray = function(start, end) {
      let arr = []
      for(arr,dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
          arr.push(new Date(dt));
      }
      return arr;
    };

    const daysArr = getDaysArray("1576-05-03", "1576-10-24")

    const dayMap = daysArr.reduce((a, c, i) => {
      return i % 7 === 0 ? a.concat([daysArr.slice(i, i + 7)]) : a;
    }, []).reverse();
    //console.log(dayMap)

    //console.log("RES:",res[1][1])



    const weekdays = ['Mo','Di','Mi','Do','Fr','Sa','So']

    const calendarWeeks = []

    console.log("Daymap 1:",dayMap[0][0])

    for (w in dayMap){
      //calendarWeeks.push("KW"+String(Number(w)+14))

      const mondayDate = dayMap[w][0].getUTCDate() + "." + (dayMap[w][0].getUTCMonth() + 1) + "."
      const sundayDate = dayMap[w][6].getUTCDate() + "." + (dayMap[w][6].getUTCMonth() + 1) + "."

      calendarWeeks.push(mondayDate + "-" + sundayDate)

    }
    //console.log("Calendar:",calendarWeeks)



    const makeGridObj = (gridMap, data) => {

        const gridObj = {}

        for (w in gridMap){
          const mondayDate = dayMap[w][0].getUTCDate() + "." + (dayMap[w][0].getUTCMonth() + 1) + "."
          const sundayDate = dayMap[w][6].getUTCDate() + "." + (dayMap[w][6].getUTCMonth() + 1) + "."

          for (d in gridMap[w]){
            const o = {}
            //o.week = "KW"+String(Number(w)+14)
            o.week = mondayDate + "-" + sundayDate

            o.weekday = weekdays[d]
            o.id = gridMap[w][d].toISOString().split('T')[0]

            o.days = data.filter(d => d.from === o.id);

            o.count = o.days.length;

            gridObj[gridMap[w][d].toISOString().split('T')[0]] = o
            //weeksObj[dayMap[w][d].toISOString().split('T')[0]] = o

          }
        }

        return gridObj

    }


    const dayObj = makeGridObj(dayMap, data);


    // set the dimensions and margins of the graph
    const margin = {top: 80, right: 50, bottom: 50, left: 120},
          width = 500 - margin.left - margin.right,
          height = 800 - margin.top - margin.bottom;



const makeSvg = (divId) => {         
    // append the svg object to the body of the page
    const svg = d3.select(divId)
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom + 50)
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
              .call(d3.axisTop(x))
              
        
            
            // Add Y axis
    const y = d3.scaleBand()
              .domain(calendarWeeks)
              .range([ height, 0])
              .padding(0.01);
            svg.append("g")
              .call(d3.axisLeft(y));


    var myColor = d3.scaleLinear()
              .range(["white","blue", "#46505E"])
              .domain([0.0000001,15, 60])        

    const infotext =  d3.select("#infotext").text(d.id);

    const mouseclick = function(event, d) {
              let t = "Tag: " + d.id + "<br>"
              if (d.hasOwnProperty("count")){
                t = t + "Anzahl: " + d.count + "<br><ol>"
                //t = t + d.days.map((day) =>  `<li><b>${day.label}</b><br>${(day.folio_from===day.folio_to) ? day.folio_from : day.folio_from.concat("-", day.folio_to)}, 
                t = t + d.days.map((day) =>  `<li><b>${day.label}</b><br><a href="${day.pid}" target="_blank">${day.pid}</a>, ${day.repository}, ${day.committee}`).join("</li>")
                t = t + "</ol><br>"
              }

              d3.selectAll(".cell")
                .style("stroke", "white")

              d3.select(this)
              .style("stroke", "red")
              infotext.html(t);

            

            }


      // Tooltip Funktionalität

      const tooltip = d3.select(divId)
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


      const selectionMap = {

        "Kurfürstenrat" : ["Kurfürstenrat"],
        "Fürstenrat" : ["Fürstenrat"],
        "Städterat" : ["Städterat"], 
        "CA-Stände" : ["CA-Stände"], 
        "Katholische Stände": ["Katholische Stände"], 
        "Alle Gremien mit Beteiligung von Kurfürsten" : ["Kurfürstenrat", "CA-Stände", "Katholische Stände"],
        "Alle Gremien mit Beteiligung von Fürsten" : ["Fürstenrat", "CA-Stände", "Katholische Stände"],
        "Alle Gremien mit Beteiligung von Reichsstädten" : ["Städterat", "CA-Stände", "Katholische Stände"],
        "Alle Gremien mit Beteiligung von Kurfürsten oder Fürsten" : ["Kurfürstenrat", "Fürstenrat"],
        "Alle Gremien mit Beteiligung der CA-Stände" : ["Kurfürstenrat", "Fürstenrat", "Städterat", "CA-Stände"],
        "Alle Gremien mit Beteiligung der katholischen Stände" : ["Kurfürstenrat", "Fürstenrat", "Städterat", "CA-Stände", "Katholische Stände"],
        "Alle Gremien mit Beteiligung des ksl. Geheimen Rates" : ["interne Sitzungen kaiserlicher Geheimer Rat"],
        "Sonstige" : ["Sonstiges"]
      }


        // List of groups (here I have one group per column)
        //const allGroup = ["Alle Gremien"].concat([... new Set(d3.map(data, function(d){return (d) ? d.gremium.trim(' ') : '' }).values())].sort())

        const allGroup = ["Alle Gremien"].concat(Object.keys(selectionMap))

        console.log("allgroup:", allGroup)


        // add the options to the button
        d3.select("#selectButton")
          .selectAll('.sectionOptions')
            .data(allGroup)
          .enter()
          .append('option')
          .attr("class", "sectionOptions")
          .text(function (d) { return d; }) // text showed in the menu
          .attr("value", function (d) { return d; })


    svg.selectAll()
              .data(Object.values(makeGridObj(dayMap, data)), function(d) {return d.weekday+':'+d.week;})
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



    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      console.log("Data", data)
      let filteredData = []
      if (selectedGroup==="Alle Gremien"){
        filteredData = data
      }else{
        filteredData = data.filter(function(d){ return selectionMap[selectedGroup].includes(d.committee) })
      }

      console.log("Filtered Data", filteredData)
      // Give these new data to update line

      d3.select('.cell').remove()

      d3.select("#infotext").text("");

      svg.selectAll()
              .data(Object.values(makeGridObj(dayMap, filteredData)), function(d) {return d.weekday+':'+d.week;})
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
    
    }

    svg.append("text")      // text label for the x axis
            .attr("x", width / 2 )
            .attr("y", -40 )
            .style("text-anchor", "middle")
            .text("Wochentag");

    svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - 80 )
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Woche im Jahr 1576");

   



    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
      
      
        update(selectedOption)
    })

  } //End makeSvg

  makeSvg("#datavis")
  makeSvg("#datavis2")



  const svgLegend = d3.select("#legend")
                      .append("svg")
                      .attr("width", 500)
                      .attr("height", 50)
                      
  const gradient = svgLegend.append("defs")
                      .append("linearGradient")
                      .attr("id", "gradient");
  
            gradient.append("stop")
                      .attr("stop-color","white")
                      .attr("offset","0%")
                     
            gradient.append("stop")
                       .attr("stop-color","blue")
                       .attr("offset","25%");

            gradient.append("stop")
                       .attr("stop-color","#46505E")
                       .attr("offset","100%");
                       

      
    svgLegend.append("rect")
                .attr("href","#gradient")
                .attr("x","200")
                .attr("width","200")
                .attr("height","20")
                .attr("fill", "url(#gradient)");
                
    svgLegend.append("text")
            .attr("x","100")
            .attr("y","20")
            .text("Legende: ")


            svgLegend.append("text")
            .attr("x","200")
            .attr("y","30")
            .attr("font-size","smaller")
            .text("0")

            svgLegend.append("text")
            .attr("x","290")
            .attr("y","30")
            .attr("font-size","smaller")
            .text("30")

            svgLegend.append("text")
            .attr("x","380")
            .attr("y","30")
            .attr("font-size","smaller")
            .text("50+")



 })




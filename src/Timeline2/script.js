
//http://glossa.uni-graz.at/archive/objects/query:rta1576.timeline/methods/sdef:Query/getJSON

/* fetch("https://glossa.uni-graz.at/archive/objects/query:rta1576.timeline/methods/sdef:Query/getJSON", {
    headers: {'Accept': 'application/json'}
    })
    .then(res => res.json()) // parse response as JSON (can be res.text() for plain response)
    .then( (r) => {   */

    const r = JSONDATA;

    console.log(r)
/* 
      $(document).ready(function() {
        $('[data-toggle="popover"]').popover({
          'container': '#pf-timeline',
          'placement': 'top'
        });
      });
      */
      var groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
      
     /*  $(document).on('click', '.drop', function () {$(this).popover('show'); });
      
      $(document).on('click', '.grid', function () {$('[data-toggle="popover"]').popover('hide');}); */ 
      
      const ONE_HOUR = 60 * 60 * 1000,
            ONE_DAY = 24 * ONE_HOUR,
            ONE_WEEK = 7 * ONE_DAY,
            ONE_MONTH = 30 * ONE_DAY,
            SIX_MONTHS = 6 * ONE_MONTH,
            ONE_YEAR = 12 * ONE_MONTH;

      //console.log(r);

      let resJson = r.map( (j) => {
        const obj = {}
        obj.date = j.from;
        obj.endDate = j.to;
        obj.dateType = j.dateType;
        obj.url = j.pid;
        obj.label = j.label;
        obj.collection = j.collection;
        obj.repository = j.repository;

        return obj

      })

      //console.log("Obj before filter: ", resJson)

     /*  resJson = resJson.filter((j) =>{

        //console.log(j)

        if(j.dateType === "Kommunikationsdatum"){
          return false;
        }

        const dateObj = new Date(j.date);
        if(dateObj.toString() === 'Invalid Date') {
          return false;
        } 

        if(dateObj < new Date("1570-01-01")) {
          return false;
        }  

        return true;

      }) */

      console.log("Obj after filter: ", resJson)


      var groupedJson = groupBy(resJson, "dateType")

      console.log("Grouped Json: ", groupedJson)

      //ganz unten eine Zeile mit "alle Daten"

      let ausstellung = groupedJson.Ausstellungsdatum


      //SVG setup
      const margin = {top: 10, right: 30, bottom: 30, left: 30},
      width = 3000 - margin.left - margin.right,
      height = 480 - margin.top - margin.bottom;

      //x scales
      /* const x = d3.scaleLinear()
      .rangeRound([0, width])
      .domain([2, 11]); */


      const x = d3.scaleTime([new Date("1576-06-01"), new Date("1576-08-31")], [0, 960]);


      //set up svg
      const svg = d3.select("#rta-timeline")
                      .append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform",
                            `translate(${margin.left}, ${margin.top})`);

          //tooltip
          const tooltip = d3.select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

          const t = d3.transition()
          .duration(1000);

          const dataFile = "roster.csv"

        //number of bins for histogram
        const nbins = 50;

//Note: data fetching is done each time the function is ran
//as d3.csv is replaced by tabletop.js request to get data each time
//from google spreadsheet
function update(){
// Get the data
//d3.csv(dataFile, function(error, allData) {

//d3.csv(dataFile).then( allData => {

  ausstellung.forEach(function(d) {
    d.Name = d.label;
    d.Value = new Date(d.date);
  });

  console.log("Ausstellungsdatum: ", ausstellung)

  data = ausstellung

  console.log("Data: ", data)

  console.log("x.domain(): ", x.domain())

//histogram binning
const histogram = d3.histogram()
.domain(x.domain())
.thresholds(x.ticks(nbins))
.value(function(d) { return d.Value;} )

//binning data and filtering out empty bins
const bins = histogram(data).filter(d => d.length>0)

console.log("Bins: ", bins)

//g container for each bin
let binContainer = svg.selectAll(".gBin")
.data(bins);

const species = d3.group(data, (d) => d.Value);

console.log("Species", species)

console.log(Object.getOwnPropertyNames(species));

//select our chart wrapper
const graph = d3.select(".chart");

//loop over our nested data and render a container
//for each concert venue
const group = graph
  .selectAll(".container")
  .data(species)
  .join("div")
  .attr("class", "container");

  //color scale
const colors = ["#FF8E79", "#FF6B5B", "#FF4941", "#DB1D25"];
scaleColor = d3.scaleOrdinal()
  .domain(data.map(d => d.Value))
  .range(colors);

//https://www.williamrchase.com/writing/2019-10-13-animated-waffle-charts-with-d3-and-gsap
//https://lvngd.com/blog/building-pictogram-grids-d3js/
//https://d3js.org/d3-array/group

/* group
  .selectAll(".box")
  .data(d => d.value)
  .join("div")
  .attr("class", "box")
  .style("background-color", d => scaleColor(d.Value));
 */


binContainer.exit().remove()

let binContainerEnter = binContainer.enter()
.append("g")
  .attr("class", "gBin")
  .attr("transform", d => `translate(${x(d.x0)}, ${height})`)

//need to populate the bin containers with data the first time
binContainerEnter.selectAll("circle")
  .data(d => d.map((p, i) => {
    return {idx: i,
            name: p.Name,
            value: p.Value,
            radius: (x(d.x1)-x(d.x0))/2
          }
  }))
.enter()
.append("circle")
  .attr("class", "enter")
  .attr("cx", 0) //g element already at correct x pos
  .attr("cy", function(d) {
      return - d.idx * 2 * d.radius - d.radius; })
  .attr("r", 0)
  .on("mouseover", tooltipOn)
  .on("mouseout", tooltipOff)
  .transition()
    .duration(500)
    .attr("r", function(d) {
    return (d.length==0) ? 0 : d.radius/2; })

binContainerEnter.merge(binContainer)
  .attr("transform", d => `translate(${x(d.x0)}, ${height})`)

//enter/update/exit for circles, inside each container
let dots = binContainer.selectAll("circle")
  .data(d => d.map((p, i) => {
    return {idx: i,
            name: p.Name,
            value: p.Value,
            radius: (x(d.x1)-x(d.x0))/2
          }
  }))

//EXIT old elements not present in data
dots.exit()
  .attr("class", "exit")
/* .transition(t)
  .attr("r", 0)
  .remove(); */

//UPDATE old elements present in new data.
dots.attr("class", "update");

//ENTER new elements present in new data.
dots.enter()
.append("circle")
  .attr("class", "enter")
  .attr("cx", 0) //g element already at correct x pos
  .attr("cy", function(d) {
    return - d.idx * 2 * d.radius - d.radius; })
  .attr("r", 0)
.merge(dots)
  .on("mouseover", tooltipOn)
  .on("mouseout", tooltipOff)
  /* .transition()
    .duration(500)
    .attr("r", function(d) {
    return (d.length==0) ? 0 : d.radius; }) */
//});//d3.csv
};//update

function tooltipOn(d) {
//x position of parent g element
let gParent = d3.select(this.parentElement)
let translateValue = gParent.attr("transform")

let gX = translateValue.split(",")[0].split("(")[1]
let gY = height + (+d3.select(this).attr("cy")-50)

d3.select(this)
.classed("selected", true)
tooltip.transition()
 .duration(200)
 .style("opacity", .9);
tooltip.html(d.name + "<br/> (" + d.value + ")")
.style("left", gX + "px")
.style("top", gY + "px");
}//tooltipOn

function tooltipOff(d) {
d3.select(this)
.classed("selected", false);
tooltip.transition()
   .duration(500)
   .style("opacity", 0);
}//tooltipOff



// add x axis
svg.append("g")
.attr("class", "axis axis--x")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x));

//draw everything
update();

//update with new data every 3sec
/* d3.interval(function() {
update();
}, 3000); */



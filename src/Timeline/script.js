$(document).ready(function() {
  $('[data-toggle="popover"]').popover({
    'container': '#pf-timeline',
    'placement': 'top'
  });
});

var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

$(document).on('click', '.drop', function () {$(this).popover('show'); });

$(document).on('click', '.grid', function () {$('[data-toggle="popover"]').popover('hide');});

const ONE_HOUR = 60 * 60 * 1000,
      ONE_DAY = 24 * ONE_HOUR,
      ONE_WEEK = 7 * ONE_DAY,
      ONE_MONTH = 30 * ONE_DAY,
      SIX_MONTHS = 6 * ONE_MONTH,
      ONE_YEAR = 12 * ONE_MONTH;


fetch("http://glossa.uni-graz.at/archive/objects/query:rta1576.timeline/methods/sdef:Query/getJSON", {
    headers: {'Accept': 'application/json'}
    })
    .then(res => res.json()) // parse response as JSON (can be res.text() for plain response)
    .then( (r) => {

      //console.log(r);

      let resJson = r.map( (j) => {
        const obj = {}
        obj.date = j.from;
        obj.endDate = j.to;
        obj.dateType = j.dateType;
        obj.url = j.isShownAt;
        obj.label = j.label;
        obj.collection = j.collection;
        obj.repository = j.repository;

        return obj

      })

      //console.log("Obj before filter: ", resJson)

      resJson = resJson.filter((j) =>{

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

      })

      //console.log("Obj after filter: ", resJson)


      var groupedJson = groupBy(resJson, "dateType")

      console.log(groupedJson)

      //ganz unten eine Zeile mit "alle Daten"

      const sortOrder = ["Sitzungsdatum","Protokollierter Tag", "Erwähntes Datum", "Ausstellungsdatum", "Praesentatum", "Lectum", "Anmeldetag", "Laufzeit"]

      const json = []

      for (const s of sortOrder){


        //https://stackoverflow.com/questions/4413590/javascript-get-array-of-dates-between-2-dates
        

        const value = groupedJson[s]

        let obj = {}
        obj.name = s
        
        let d = []
        for (const [k, v] of Object.entries(value)) {

          console.log("value: ", v)

          let o = {}
          o.date = v.date
          o.details = v
          d.push(o)


        }
        obj.data = d
        json.push(obj)



      }


      /* for (const [key, value] of Object.entries(groupedJson)) {
        
        let obj = {}
        obj.name = key
        
        let d = []
        for (const [k, v] of Object.entries(value)) {
          let o = {}
          o.date = v.date
          o.details = v
          d.push(o)
        }
        obj.data = d
        json.push(obj)
      } */


    //console.log(json)


    var data = [],
      start = new Date('1575-01-01'),
      today = new Date('1577-01-01');

    for (var x in json) { //json lives in external file for testing
      data[x] = {};
      data[x].name = json[x].name;
      data[x].data = [];
      for (var y in json[x].data) {
        data[x].data.push({});
        data[x].data[y].date = new Date(json[x].data[y].date);
        data[x].data[y].details = json[x].data[y].details;
      }
      $('#timeline-selectpicker').append("<option>" + data[x].name + "</option>");
      data[x].display = true;
    }
    $('#timeline-selectpicker').selectpicker('selectAll');

    var timeline = d3.chart.timeline()
      .width("1200")
      .padding({ top: 30, left: 100, bottom: 40, right: 20 })
      .end(today)
      .start(today - ONE_YEAR)
      .minScale(ONE_WEEK / ONE_MONTH)
      .maxScale(ONE_WEEK / ONE_DAY)
      /* .eventPopover((el)=>{


        console.log(el)


        return "Hello";

        let popoverStrg = ''

        
        popoverStrg = popoverStrg + 'Datum: ' + el.date.toISOString().split('T')[0] + '<br>';
        

        console.log(el)
        popoverStrg = popoverStrg +  `URL: <a href="${el.details.url}">${el.details.url}</a><br>`;

        return popoverStrg 
      })*/
      .eventColor((d)=>{

        //console.log("In eventLineColor: ", d)

        if(d.hasOwnProperty("events")) {
          if (d.events.length > 60){
            return '#191970';
          }
          else if (d.events.length > 40){

            return '#0F52BA';

          }
          else if (d.events.length > 20){

            return '#4169E1';

          }else if (d.events.length > 10){

            return '#6082B6';

          }else if (d.events.length > 5){

            return '#6495ED';

          }else{
            return '#89CFF0';
          }
          
        } else {
          return '#7DF9FF';
        }

      }) 
      .eventShape((d)=>{






        return '\uf111';

        /* if(d.hasOwnProperty("events")) {
          if (d.events.length > 10){
            return '\uf140';
          }
          else{
            return '\uf192';
          }
          
        } else {
          return '\uf111';
        } */


      })
      .eventClick(function(el) {

        console.log(el)

        var table = '<table class="table table-striped table-bordered">';
        if(el.hasOwnProperty("events")) {
          table = table + '<thead>' + el.events.length + ' mentionings of the date '+ el.date.toISOString().split('T')[0] + '</thead><tbody>';
          table = table + '<tr><th>Title</th><th>Archive</th><th>Resource type</th><th>Start date</th><th>End date</th><th>Date type</th></tr>';
          for (var i = 0; i < el.events.length; i++) {
            table = table + `<tr><td><a href="${el.events[i].details.url}" target="_blank">${el.events[i].details.label}</a></td>`;
            table = table + `<td>${el.events[i].details.repository}</td>`;
            table = table + `<td>${el.events[i].details.collection}</td>`;
            table = table + `<td>${el.events[i].details.date}</td>`;
            table = table + `<td>${(el.events[i].details.date !== el.events[i].details.endDate) ? el.events[i].details.endDate : "" }</td>`;
            table = table + `<td>${el.events[i].details.dateType}</td>`;

           /*  for (var j in el.events[i].details) {
              table = table +'<td> ' + el.events[i].details[j] + ' </td> ';
            } */
            table = table + '</tr>';
          }
          table = table + '</tbody>';
        } else {

          table = table + '<thead>One mentioning of the date '+ el.date.toISOString().split('T')[0] + '</thead><tbody>';
          
          table = table + '<tr><th>Title</th><th>Archive</th><th>Resource type</th><th>Start date</th><th>End date</th><th>Date type</th></tr>';
         
            table = table + `<tr><td><a href="${el.details.url}" target="_blank">${el.details.label}</a></td>`;
            table = table + `<td>${el.details.repository}</td>`;
            table = table + `<td>${el.details.collection}</td>`;
            table = table + `<td>${el.details.date}</td>`;
            table = table + `<td>${el.details.endDate}</td>`;
            table = table + `<td>${el.details.dateType}</td>`;

            table = table + '</tr>';
            table = table + '</tbody>';



          /* table = table + 'Datum: ' + el.date.toISOString().split('T')[0] + '<br>';

          table = table +  `URL: <a href="${el.details.url}">${el.details.url}</a><br>`; */


          /* for (i in el.details) {
            table = table + i.charAt(0).toUpperCase() + i.slice(1) + ': ' + el.details[i] + '<br>';
          } */
        }
        $('#legend').html(table);

      });
    if(countNames(data) <= 0) {
      timeline.labelWidth(60);
    }



    var element = d3.select('#pf-timeline').append('div').datum(data.filter(function(eventGroup) {
      return eventGroup.display === true;
    }));
    timeline(element);

    $('#timeline-selectpicker').on('changed.bs.select', function(event, clickedIndex, newValue, oldValue) {
      data[clickedIndex].display = !data[clickedIndex].display;
      element.datum(data.filter(function(eventGroup) {
        return eventGroup.display === true;
      }));
      timeline(element);
      $('[data-toggle="popover"]').popover({
        'container': '#pf-timeline',
        'placement': 'top'
      });
    });

    $(window).on('resize', function() {
      timeline(element);
      $('[data-toggle="popover"]').popover({
        'container': '#pf-timeline',
        'placement': 'top'
      });
    });


    $('#datepicker').datepicker({
      autoclose: true,
      todayBtn: "linked",
      todayHighlight: true
    });

$('#datepicker').datepicker('setDate', today);

$('#datepicker').on('changeDate', zoomFilter);

$( document.body ).on( 'click', '.dropdown-menu li', function( event ) {
  var $target = $( event.currentTarget );
    $target.closest( '.dropdown' )
      .find( '[data-bind="label"]' ).text( $target.text() )
        .end()
      .children( '.dropdown-toggle' ).dropdown( 'toggle' );

    zoomFilter();

    return false;
  });

function countNames(data) {
  var count = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].name !== undefined && data[i].name !=='') {
      count++;
    }
  }
  return count;
} 

function zoomFilter() {
  var range = $('#range-dropdown').find('[data-bind="label"]' ).text(),
      position = $('#position-dropdown').find('[data-bind="label"]' ).text(),
      date = $('#datepicker').datepicker('getDate'),
      startDate,
      endDate;

  switch (range) {
    case '1 hour':
      range = ONE_HOUR;
      break;

    case '1 day':
      range = ONE_DAY;
      break;

    case '1 week':
      range = ONE_WEEK;
      break;

    case '1 month':
      range = ONE_MONTH;
      break;
  }
  switch (position) {
    case 'centered on':
      startDate = new Date(date.getTime() - range/2);
      endDate = new Date(date.getTime() + range/2);
      break;

    case 'starting':
      startDate = date;
      endDate = new Date(date.getTime() + range);
      break;

    case 'ending':
      startDate =  new Date(date.getTime() - range);
      endDate = date;
      break;
  }
  timeline.Zoom.zoomFilter(startDate, endDate);
} 



})
  


$('#reset-button').click(function() {
  timeline(element);
  $('[data-toggle="popover"]').popover({
    'container': '#pf-timeline',
    'placement': 'top'
  });
});
 
$('body').on('click', function (e) {
  $('[data-toggle="popover"]').each(function () {
      if (!$(this).is(e.target) && 
           $(this).has(e.target).length === 0 && 
           $('.popover').has(e.target).length === 0) {
          $(this).popover('hide');
      }
  });
});

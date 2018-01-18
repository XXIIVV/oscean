function calendar_view()
{
  var width = 600;

  this.styles = function()
  {
    return `<style>
    #oscean { background:#72dec2}
    #hd photo { display:none}
    #sd { color:white; display:none}
    #sd > h3 { background:none; padding:0px}
    #sd > h3 list.navi ln.active { color:white}
    #sd > h3 list.navi ln:hover { color:white }
    #md { background:transparent; color:white; padding-left:0px }
    #md > wr { float:none; margin:0px; max-width: 100%; }
    #md > wr > m1 { display:none}
    #md > wr > m2 { display:block; width:100%; margin:0px auto}
    #md > wr > m3 { display:none}
    #md > wr > .monitor { display:none}

    table.year { margin-bottom:30px; width:100%}
    table.year tr {  }
    table.year tr td { vertical-align: bottom; position:relative; border:1px solid black}
    table.year tr td a {display: block;font-size: 11px;line-height: 23px;padding: 0px 5px;color: black;font-family: 'input_mono_medium'; text-transform:uppercase}
    table.year tr td a.today { background:white}
    table.year tr td a:hover { background:#000; color:white}
    table.year tr td span.date { font-family:'input_mono_regular'}
    list.tidy ln { color:#000}
    list.tidy ln a { color:#000}
    </style>`;
  }

  this.calendar_graph = function(year,logs)
  {
    var today = new Date().desamber();
    var y = new Date().getFullYear().toString().substr(2,2);
    var m = 1;
    var d = 1;
    var html = "";
    while(m <= 26){
    var html_days = "";
      d = 1
      while(d <= 14){
        var desamber = `${y}${String.fromCharCode(96 + m).toUpperCase()}${prepend(d,2,"0")}`
        var log = logs[desamber];
        html_days += `<td><a ${log ? "href='"+log.term+"'": ""} class='${today == desamber ? "today" : ""}'><span class='date'>${desamber}</span> ${log ? log.sector.substr(0,1)+""+log.value+""+log.vector : ""}</a></td>`
        d += 1;
      }
      html += `<tr>${html_days}</tr>`
      m += 1
    }

    console.log(new Date("2018-01-28").desamber())
    console.log(new Date("2018-01-27").desamber())

    console.log(new Date("2018-01-18").desamber())
    console.log(new Date("2018-01-17").desamber())
    console.log(new Date("2018-01-16").desamber())
    console.log(new Date("2018-01-15").desamber())
    console.log("Error:")
    console.log(new Date("2018-01-14").desamber())
    console.log(new Date("2018-01-13").desamber())
    console.log(new Date("2018-01-12").desamber())
    console.log(new Date("2018-01-11").desamber())
    console.log(new Date("2018-01-05").desamber())
    
    return `<table class='year'>${html}</table>`;
  }

  this.event_graph = function(logs)
  {
    var html = "";

    for(id in logs){
      var log = logs[id];
      if(!log.is_event){ continue; }
      html += "<ln><span style='display:inline-block; width:45px'>"+log.time+"</span> <a href='"+log.term+"'>"+log.name+"</a></ln>"
    }

    return "<list class='tidy'>"+html+"</list>";
  }

  this.html = function()
  {
    var html = "";

    var logs = invoke.vessel.horaire.logs.slice()
    var current_year = new Date().getFullYear();

    var each_day = {};
    for(id in logs){
      var log = logs[id];
      if(current_year != log.time.year){ continue; }
      each_day[log.time.toString()] = log;
    }

    console.log(each_day)

    html += this.calendar_graph(current_year,each_day);
    html += this.event_graph(invoke.vessel.horaire.logs);
    html += this.styles();

    return html;
  }

  function prepend(s,length,char = "0")
  {
    var p = "";
    while((p+s).length < length){
      p += char;
    }
    return p+s;
  }
}; 

var payload = new calendar_view();

invoke.vessel.seal("special","calendar",payload);


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
    table.year tr td.special { colspan:14}
    table.year tr td.has_photo { background:white}
    table.year tr td.today { background:black; color:white}
    table.year tr td.today log { color:white}
    table.year tr td log {display: block;font-size: 11px;line-height: 23px;margin: 0px 10px;color: black;font-family: 'input_mono_medium'}
    list.tidy ln { color:#000}
    list.tidy ln a { color:#000}
    </style>`;
  }

  this.calendar_graph = function(year,logs)
  {
    var months = "";
    var m = 0;
    var prev = null;
    while(m < 26){
      var days = "";
      var d = 0;
      while(d < 14){
        var id = (m * 14) + d
        var log = logs[id+1];
        days += `<td title='${log ? log.time.gregorian.format : id}' class='${!log ? "missing" : ""} ${log && log.photo ? "has_photo" : ""} ${log && log.time.is_today() ? "today" : ""}'><log>${log && log.value > 0 ? log.time.toString()+" "+log.value+""+log.sector.substr(0,1).toUpperCase() : "×"}</log></td>`
        d += 1;
        prev = log ? log : prev;
      }
      months += `<tr>${days}</tr>`
      m += 1
    }
    if(logs[1].time.is_leap_year()){
      console.log("Is leap year")
      var log1 = logs[365];
      var log2 = logs[366];
      months += `<tr><td class='${!log1 ? "missing" : ""}'></td><td class='${!log2 ? "missing" : ""}' colspan='14'></td></tr>`
    }
    else{
      console.log("Is not leap year")
      var log = logs[365];
      months += `<tr><td class='${!log1 ? "missing" : ""}'></td></tr>`
    }
    
    return `<table class='year'>${months}</table>`;
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
    var current_year = logs[0].time.gregorian.y;

    var each_day = {};
    for(id in logs){
      var log = logs[id];
      if(log.time.gregorian.y != current_year){ continue; }
      each_day[log.time.doty] = log;
    }

    html += this.calendar_graph(current_year,each_day);
    html += this.event_graph(invoke.vessel.horaire.logs);
    html += this.styles();

    return html;
  }
}; 

var payload = new calendar_view();

invoke.vessel.seal("special","calendar",payload);


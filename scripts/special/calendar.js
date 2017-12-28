function calendar_view()
{
  var width = 600;

  this.styles = function()
  {
    return `<style>
    #oscean { background:#000}
    #hd { padding-bottom:0px !important}
    #hd > h1 { display:none}
    #hd > icon { display:none}
    #hd > h2 { display:none}
    #hd { background: #fff;color: white;padding-bottom: 40px }
    #sd { color:white}
    #sd icon { display:none}
    #sd > h3 { background:none; padding:0px}
    #sd > h3 list.navi ln.active { color:white}
    #sd > h3 list.navi ln:hover { color:white }
    #md { background:transparent; color:white }
    #md > wr > m1 { display:none}
    #md > wr > m2 { display:block; width:680px; margin:0px auto}
    #md > wr > m3 { display:none}
    #md > wr > .monitor { display:none}

    table.year { margin-bottom:30px; width:100%}
    table.year tr {  }
    table.year tr td { height:23px;vertical-align: bottom; position:relative}
    table.year tr td.special { colspan:14}
    table.year tr td.missing:before { content: "×";position: absolute;top:2px;left:0px;width:24px;text-align: center;color:#555}
    table.year tr td log { background:white; margin-right:1px; display:block; border-radius:2px }
    table.year tr td log.audio { background:#72dec2}
    table.year tr td log.visual { background:#ffbf05}
    table.year tr td log.research { background:#fff}
    list.tidy ln { color:#999}
    list.tidy ln a { color:#fff}
    </style>`;
  }

  this.calendar_graph = function(year,logs)
  {
    var months = "";
    var m = 0;
    var prev = null;
    while(m < 13){
      var days = "";
      var d = 0;
      while(d < 28){
        var id = (m * 28) + d
        var log = logs[id+1];
        days += `<td title='${log ? log.time.gregorian.format : id}' class='${!log ? "missing" : ""}'><log class='${log ? log.sector : ''}' style='height:${log ? log.value*10 : "0"}%'></log></td>`
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
      html += "<ln>"+log.time.gregorian.y+" <a href='"+log.term+"'>"+log.name+"</a></ln>"
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
      each_day[log.time.of_the_year()] = log;
    }

    html += this.calendar_graph(current_year,each_day);
    html += this.event_graph(invoke.vessel.horaire.logs);
    html += this.styles();

    return html;
  }
}; 

var payload = new calendar_view();

invoke.vessel.seal("special","calendar",payload);


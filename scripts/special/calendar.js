function calendar_view()
{
  this.html = function()
  {
    var html = "";
    
    html += this.navigation();
    html += this.calendar_graph(this.get_days());
    html += this.event_graph(invoke.vessel.horaire.logs);
    html += this.styles();

    return html;
  }

  this.navigation = function()
  {
    var html = "";

    var years = invoke.vessel.lexicon.find("calendar").children
    for(id in years){
      var year = years[id];
      html += `<a href='${year.name}' class='year ${year.name == invoke.vessel.corpse.query() ? "selected" : ""}'>${year.name}</a>`
    }
    return html
  }

  this.cell = function(log,desamber,today,full_width = false)
  {
    var content = log && log.value > 0 ? `${desamber.substr(2,3)}<a href='#${log.term.to_url()}'>${log ? (log.sector ? log.sector.substr(0,1) : "")+""+log.value+""+log.vector : ""}</a>` : desamber.substr(2,3)+"---";

    return `<td title='${new Desamber(desamber).to_gregorian()}' ${full_width ? "colspan='26'" : ""} class='${today == desamber ? "today" : ""} ${log && log.is_event ? "event" : ""}'>${content}</td>`
  }

  this.calendar_graph = function(logs)
  {
    var today = new Date().desamber();
    var y = Object.keys(logs)[0].substr(0,2);
    var m = 1;
    var d = 1;
    var html = "";
    while(m <= 26){
    var html_days = "";
      d = 1
      while(d <= 14){
        var desamber = `${y}${String.fromCharCode(96 + m).toUpperCase()}${prepend(d,2,"0")}`
        html_days += this.cell(logs[desamber],desamber,today);
        d += 1;
      }
      html += `<tr>${html_days}</tr>`
      m += 1
    }

    html += `<tr>${this.cell(logs[`${y}+01`],`${y}+01`,today,"year_day")}</tr>`;

    return `<table>${html}</table>`;
  }

  this.event_graph = function(logs)
  {
    var html = "";

    for(var id in logs){
      var log = logs[id];
      if(!log.is_event){ continue; }
      html += `<ln><a class='time' href='/#${log.time.year}'>${log.time}</a> <a href='${log.term.to_url()}'>${log.name}</a> ${log.time.offset() > 0 ? log.time.offset_format() : ""}</ln>`
    }

    return "<list class='tidy'>"+html+"</list>";
  }

  this.get_days = function()
  {
    var target_year = parseInt(invoke.vessel.corpse.query());
    var current_year = target_year > 2000 ? new Date(target_year,0,1).getFullYear() : new Date().getFullYear();
    var logs = invoke.vessel.horaire.logs.slice()

    var days = {};

    for(id in logs){
      var log = logs[id];
      if(current_year != log.time.year){ continue; }
      days[log.time.toString()] = log;
    }
    return days;
  }

  this.styles = function()
  {
    return `<style>

    a.year { display:inline-block; margin-right:10px; font-size:11px; margin-bottom:15px; color:black; font-family:'input_mono_medium'}
    a.year.selected { text-decoration:underline}
    a.year:hover { text-decoration:underline}
    list.tidy ln { color:#000}
    list.tidy ln a { color:#000}
    list.tidy ln a.time { display:inline-block; width:45px; font-family:'archivo_regular' !important}
    </style>`;
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


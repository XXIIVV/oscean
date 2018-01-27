function calendar_view()
{
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
    table.year tr td a {display: block;font-size: 11px;line-height: 25px;color: black;font-family: 'input_mono_medium'; text-transform:uppercase}
    table.year tr td.today { background:white}
    table.year tr td.event { background:#000}
    table.year tr td.event a { color:white}
    table.year tr td a.missing:after { content:"---"}
    table.year tr td:hover { background:white;}
    table.year tr td:hover a { text-decoration:underline; color:black}
    table.year tr td span.date { font-family:'input_mono_regular'}
    a.year { display:inline-block; margin-right:10px; font-size:11px; margin-bottom:15px; color:black; font-family:'input_mono_medium'}
    a.year.selected { text-decoration:underline}
    a.year:hover { text-decoration:underline}
    list.tidy ln { color:#000}
    list.tidy ln a { color:#000}
    list.tidy ln a.time { display:inline-block; width:45px; font-family:'archivo_regular' !important}
    </style>`;
  }

  this.cell = function(log,desamber,today,full_width = false)
  {
    return `<td ${full_width ? "colspan='26'" : ""} class='${today == desamber ? "today" : ""} ${log && log.is_event ? "event" : ""}'><a ${log ? "href='#"+log.term.to_url()+"'": ""} title='${new Desamber(desamber).to_gregorian()}' class='${!log ? "missing" : ""}'><span class='date'>${desamber}</span> ${log ? (log.sector ? log.sector.substr(0,1) : "")+""+log.value+""+log.vector : ""}</a></td>`
  }

  this.calendar_graph = function(year,logs)
  {
    var today = new Date().desamber();
    var y = year.toString().substr(2,2);
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

    return `<table class='year'>${html}</table>`;
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

  this.html = function()
  {
    var html = "";
    var target_year = parseInt(invoke.vessel.corpse.query());
    var logs = invoke.vessel.horaire.logs.slice()
    var current_year = target_year > 2000 ? new Date(target_year,0,1).getFullYear() : new Date().getFullYear();
    var each_day = {};

    for(id in logs){
      var log = logs[id];
      if(current_year != log.time.year){ continue; }
      each_day[log.time.toString()] = log;
    }

    var years = invoke.vessel.lexicon.find("calendar").children
    
    for(id in years){
      var year = years[id];
      html += `<a href='${year.name}' class='year ${year.name == current_year ? "selected" : ""}'>${year.name}</a>`
    }

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


function CalendarTemplate(id,rect,...params)
{
  TemplateNode.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {
    var year = parseInt(q.name);
    var html = "";
    
    html += this.calendar_graph(this.get_days(year,q.tables.horaire));
    html += this.event_graph(q.tables.horaire);

    return  {
      title: q.name.capitalize(),
      view:{
        header:{
          photo:'',
          info:{title:"",glyph:""},
          search: q.name
        },
        core:{
          sidebar:{
            bref:make_bref(q),
            navi:""
          },
          content:`${q.tables.lexicon.CALENDAR.long()}${html}`
        },
        style: `
          #content,#core,#header,#view,#sidebar { background:#72dec2}
          a.year { display:inline-block; margin-right:10px; font-size:11px; margin-bottom:15px; color:black; font-family:'input_mono_medium'}
          a.year.selected { text-decoration:underline}
          a.year:hover { text-decoration:underline}
          list.tidy ln { color:#000}
          list.tidy ln a { color:#000}
          list.tidy ln a.time { display:inline-block; width:45px; font-family:'archivo_regular' !important}
          table.horaire { width:100%; font-size:11px; font-family:'input_mono_regular'}
          table.horaire tr td { font-size:11px !important; border:1px solid black; padding:0px 20px; text-transform:uppercase}
          table.horaire tr td a { font-family:'input_mono_medium'}
          table.horaire tr td:hover { background:#fff !important; color:black !important; cursor:pointer}
          table.horaire tr td:hover a { text-decoration:underline; color:black !important}
          table.horaire tr td.event { color:white}
          table.horaire tr td.photo { background:black; color:white}
          table.horaire tr td.today { background:white}`
      }
    }
  }

  function make_bref(q,logs)
  {
    return `
    <h1>${q.name}</h1>
    <h2>
      <a onclick="Ø('query').bang('Calendar')">${q.name}</a><br />
    </h2>`
  }

  this.cell = function(log,desamber,today,full_width = false)
  {
    var content = log && log.value > 0 ? `${desamber.substr(2,3)}<a onclick='Ø("query").bang("${log.term}")'>${log ? (log.sector ? log.sector.substr(0,1) : "")+""+log.value+""+log.vector : ""}</a>` : desamber.substr(2,3)+"---";
    return `<td title='${new Desamber(desamber).to_gregorian()}' ${full_width ? "colspan='26'" : ""} class='${today == desamber ? "today" : ""} ${log && log.is_event ? "event" : ""} ${log && log.photo > 0 ? "photo" : ""}'>${content}</td>`
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

    return `<table class='horaire'>${html}</table>`;
  }

  this.event_graph = function(logs)
  {
    var html = "";

    for(var id in logs){
      var log = logs[id];
      if(!log.is_event){ continue; }
      html += `<ln><a class='time' onclick='Ø("query").bang("${log.time.year}")'>${log.time}</a> <a onclick='Ø("query").bang("${log.term.to_url()}")'>${log.name}</a> ${log.time.offset() > 0 ? log.time.offset_format() : ""}</ln>`
    }

    return "<list class='tidy' style='max-width:100%'>"+html+"</list>";
  }

  this.get_days = function(year,logs)
  {
    var current_year = year > 2000 ? new Date(year,0,1).getFullYear() : new Date().getFullYear();
    var days = {};

    for(id in logs){
      var log = logs[id];
      if(current_year != log.time.year){ continue; }
      days[log.time.toString()] = log;
    }
    return days;
  }

  function prepend(s,length,char = "0")
  {
    var p = "";
    while((p+s).length < length){
      p += char;
    }
    return p+s;
  }
}
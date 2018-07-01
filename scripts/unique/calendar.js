Ø("unique").seal("calendar",(q) => 
{
  function get_days(year,logs)
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

  function cell(log,desamber,today,full_width = false)
  {
    var content = log && log.value > 0 ? `${desamber.substr(2,3)}<a onclick='Ø("query").bang("${log.term}")'>${log ? (log.sector ? log.sector.substr(0,1) : "")+""+log.value+""+log.vector : ""}</a>` : desamber.substr(2,3)+"---";
    return `<td title='${new Desamber(desamber).to_gregorian()}' ${full_width ? "colspan='26'" : ""} class='${today == desamber ? "today" : ""} ${log && log.is_event ? "event" : ""} ${log && log.photo > 0 ? "photo" : ""} ${log ? log.sector : 'misc'}'>${content}</td>`
  }

  function style()
  {
    return `#content,#core,#header,#view,#sidebar,#photo { background:#ccc !important;}
      #content table.horaire { font-size:11px; font-family:'input_mono_regular'; width:100%; padding:0px; background:none}
      #content table.horaire tr > * { padding:0px 5px !important; }
      #content table.horaire tr td { font-size:11px !important; text-transform:uppercase; line-height:20px !important; border-radius:2px; text-align:center}
      #content table.horaire tr td:hover { background:#fff}
      #content table.horaire tr td a { font-family:'input_mono_medium'}
      #content table.horaire tr td.today { text-decoration:underline; background:#fff}
      #content table.horaire tr td.event { background:#000; color:white}
      #content table.horaire tr td.misc { color:#777}
      #content table.horaire tr th { line-height:20px !important; }
      #content list ln.head { line-height:30px !important; border-bottom:1.5px solid black; margin-bottom:15px !important; display:block}`
  }

  function calendar_graph(logs)
  {
    if(Object.keys(logs).length == 0){ return ''; }

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
        html_days += cell(logs[desamber],desamber,today);
        d += 1;
      }
      html += `<tr>${html_days}</tr>`
      m += 1
    }
    html += `<tr>${cell(logs[`${y}+01`],`${y}+01`,today,"year_day")}</tr>`;
    return `<table class='horaire'>${html}</table><hr style='border-bottom:1.5px solid black; margin-bottom:30px'/>`;
  }

  function event_graph(logs)
  {
    var html = "";

    var prev_y = 0;

    for(var id in logs){
      var log = logs[id];
      if(!log.is_event){ continue; }
      if(log.time.y != prev_y){ html += `<ln class='head'>20${log.time.y}</ln>`; prev_y = log.time.y; }
      html += `<ln>{{${log.name ? log.name : log.term+' '+log.task.capitalize()}|${log.term}}}</a> ${log.time.offset() > 0 ? log.time.offset_format() : log.time}</ln>`.to_markup()
    }

    return "<list class='tidy' style='max-width:100%'>"+html+"</list>";
  }

  function prepend(s,length,char = "0")
  {
    var p = "";
    while((p+s).length < length){
      p += char;
    }
    return p+s;
  }

  var year = parseInt(q.name) > 0 ? parseInt(q.name) : 2018;
  var html = "";
  var logs = get_days(year,q.tables.horaire)

  html += calendar_graph(logs);
  html += event_graph(q.tables.horaire);

  return html+`<style>${style()}</style>`
});
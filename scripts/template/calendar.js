function CalendarTemplate(id,rect,...params)
{
  TemplateNode.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {
    var year = parseInt(q.name);
    var html = "";
    var logs = this.get_days(year,q.tables.horaire)

    html += this.calendar_graph(logs);
    html += this.summary(q.tables.horaire)
    html += this.event_graph(q.tables.horaire);

    return  {
      title: q.name.capitalize(),
      view:{
        header:{
          photo:'',
          info:{title:"",glyph:""},
          menu:{search:q.name,activity:""}
        },
        core:{
          sidebar:{
            bref:`<h1>The {{Calendar}} is based on the {{Nataniev Time|Time}}.</h1><h2>{{${parseInt(q.name)-1}}}—{{${parseInt(q.name)+1}}}</h2>`.to_markup()
          },
          content:`${q.tables.lexicon.CALENDAR.long()}${html}`,
          navi:""
        },
        style: `
          #content,#core,#header,#view,#sidebar,#photo { background:#ccc !important;}
          table.horaire { font-size:11px; font-family:'input_mono_regular';}
          table.horaire tr > * { padding:0px 5px !important}
          table.horaire tr td { font-size:11px !important; text-transform:uppercase; line-height:20px !important;}
          table.horaire tr td:hover { background:#fff}
          table.horaire tr td a { font-family:'input_mono_medium'}
          table.horaire tr td.today { text-decoration:underline; background:#fff}
          table.horaire tr td.event { background:#000; color:white}
          table.horaire tr td.misc { color:#777}
          table.horaire tr th { line-height:20px !important; }
          list ln.head { line-height:30px !important; border-bottom:1.5px solid black; margin-bottom:15px !important; display:block}`
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
    return `<td title='${new Desamber(desamber).to_gregorian()}' ${full_width ? "colspan='26'" : ""} class='${today == desamber ? "today" : ""} ${log && log.is_event ? "event" : ""} ${log && log.photo > 0 ? "photo" : ""} ${log ? log.sector : 'misc'}'>${content}</td>`
  }

  this.summary = function(logs)
  {
    var html = ""

    var by_y = {}
    for(id in logs){
      var log = logs[id]
      var year = log.time.to_date().getFullYear()
      if(log.time.offset() > 0){ continue; }
      if(!by_y[year]){ by_y[year] = []; }
      by_y[year].push(log)
    }

    var horaires = {}

    for(id in by_y){
      horaires[id] = new Horaire(by_y[id])
    }

    html += `<tr><th></th><th colspan='2'>HDf</th><th colspan='2'>HDc</th><th colspan='2'>Efec</th><th colspan='2'>Efic</th><th colspan='2'>Out</th><th colspan='2'>Osc</th><th colspan='2'>Bal</th></tr>`

    var avrg = new Horaire(logs)

    function diff(a,b)
    {
      var offset = (a - b)
      return offset > 0 ? `<t style='color:white'>+${offset.toFixed(2)}</t>` : `<t style='color:#999'>${offset.toFixed(2)}</t>`
    }

    for(id in horaires){
      var year = horaires[id]
      html += `
      <tr>
        <th>${id}</th>
        <td>${year.fh > 0 ? `${year.fh}`.substr(0,4) : '—'}</td><td>${diff(year.fh,avrg.fh)}</td>
        <td>${year.ch > 0 ? `${year.ch}`.substr(0,4) : '—'}</td><td>${diff(year.ch,avrg.ch)}</td>
        <td>${year.efec > 0 ? `${year.efec}`.substr(0,4) : '—'}</td><td>${diff(year.efec,avrg.efec)}</td>
        <td>${year.efic > 0 ? `${year.efic}`.substr(0,4) : '—'}</td><td>${diff(year.efic,avrg.efic)}</td>
        <td>${year.focus > 0 ? `${year.focus}`.substr(0,4) : '—'}</td><td>${diff(year.focus,avrg.focus)}</td>
        <td>${year.osc > 0 ? `${year.osc}`.substr(0,4) : '—'}</td><td>${diff(year.osc,avrg.osc)}</td>
        <td>${year.balance > 0 ? `${year.balance}`.substr(0,4) : '—'}</td><td>${diff(year.balance,avrg.balance)}</td>
      </tr>`
      prev = year
    }

    return `<table class='horaire' width='740'>${html}</table><hr style='border-bottom:1.5px solid black; margin-bottom:30px'/>`
  }

  this.calendar_graph = function(logs)
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
        html_days += this.cell(logs[desamber],desamber,today);
        d += 1;
      }
      html += `<tr>${html_days}</tr>`
      m += 1
    }

    html += `<tr>${this.cell(logs[`${y}+01`],`${y}+01`,today,"year_day")}</tr>`;

    return `<table class='horaire'>${html}</table><hr style='border-bottom:1.5px solid black; margin-bottom:30px'/>`;
  }

  this.event_graph = function(logs)
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
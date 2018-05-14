function JournalTemplate(id,rect,...params)
{
  TemplateNode.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {
    var html = ""

    html += ActivityGraph(q.tables.horaire)

    // Find upcoming events
    var upcomings = find_upcomings(q.tables.horaire)
    var next_event = upcomings.reverse()[0]
    html += print_group([next_event],q.tables.lexicon)

    var groups = find_groups(q.tables.horaire)
    for(var id in groups){
      var group = groups[id]
      html += print_group(group,q.tables.lexicon)
    }
    return html
  }

  this.style = function()
  {
    return `
    yu#core { background:#000 !important; color:white;border-bottom:1px solid #333}
    yu#header photo { display:none}
    svg.graph { background:#000; padding: 45px 38px 60px; color:white;border-bottom:1px solid #333; display:block}
    svg.graph text { stroke:none; fill:#fff; font-size:11px; text-anchor: middle; font-family:'archivo_bold' }
    svg.graph rect { stroke:none }
    svg.graph rect:hover { fill:#a1a1a1 !important; cursor:pointer}
    svg.graph rect.audio { fill:#72dec2 }
    svg.graph rect.visual { fill:#ff726c }
    svg.graph rect.research { fill:#fff }
    svg.graph rect.misc { fill:#333 !important }
    svg.graph path { stroke-linecap:butt; stroke-dasharray:1,1; fill:none;stroke:black;stroke-width:15px }

    #content log { display:block; padding:15px; margin-bottom:1px; vertical-align:top; position:relative; padding-left:100px; font-size:14px; max-width: 700px; border-bottom:1px solid #333 }
    #content log .head { display: block; font-size:15px; line-height: 25px; }
    #content log .head a { font-family: 'archivo_bold' }
    #content log .head a:hover { text-decoration: underline; cursor:pointer; }
    #content log .head t { color:#999; display: inline-block; margin-left:5px; font-size:14px; }
    #content log .head t:hover { text-decoration: underline; cursor:pointer; }
    #content log svg.icon { cursor: pointer; background:black; width:50px; height:50px; border-radius:3px; display:inline-block; position:absolute; left:35px }
    #content log svg path { fill:none; }
    #content log svg:hover { background:#72dec2 !important; } 
    #content log p { font-size: 22px; margin-bottom: 20px; color:#ccc }
    #content log gallery { margin-bottom:15px; }
    #content log gallery photo { cursor: pointer; }
    #content log mini { margin-bottom: 0px; font-family: 'archivo_medium'; font-size:12px; }
    #content log mini a.tag { background:#333; line-height: 20px; color:#999; margin-right:5px; padding:0px 5px }
    #content log mini a.tag:before { content:"#"; color:#999;padding-right:2.5px;}
    #content log mini a:hover { background:black; color:white; }
    #content log.event { background:#191919 }
    #content log.event .head .topic:after { content: "Event";background: #72dec2;display: inline-block;margin-left: 5px;font-size:12px;padding:0px 10px;border-radius: 100px;line-height: 20px;position: absolute;right:20px;top:20px;color:black }

    `
  }

  function find_upcomings(logs)
  {
    var selection = []
    // Segment of time
    var count = 0
    for(var id in logs){
      var log = logs[id]
      if(count > 30){ break; }
      if(log.time.offset() < 0){ continue; }
      if(!log.is_event){ continue; }
      if(!log.term){ continue; }
      selection.push(log)
      count += 1
    }

    return selection
  }

  function find_groups(logs)
  {
    var selection = []
    // Segment of time
    var count = 0
    for(var id in logs){
      var log = logs[id]
      if(count > 42){ break; }
      if(log.time.offset() > 0){ continue; }
      if(!log.term){ continue; }
      selection.push(log)
      count += 1
    }

    var groups = []
    // Group logs
    var count = 0
    var group = []
    var prev  = null
    for(var id in selection){
      var log = selection[id]
      if(prev && prev.term != log.term){
        var pop = group.slice()
        groups.push(pop)
        group = []
      }
      group.push(log)
      prev = log
    }

    return groups
  }

  function print_group(group,lexicon)
  {
    var html = ""

    // Summarize
    var fh = 0
    var ch = 0
    var term = group[0].term
    var entry = lexicon[term.toUpperCase()]
    var photos = []
    var is_event = false
    var name = null

    for(id in group){
      var log = group[id];
      fh += log.value
      ch += log.vector
      is_event = log.is_event
      if(log.name && !name){
        name = log.name
      }
      if(log.photo){
        photos.push(log)
      }
    }

    html += `
    <log class='${is_event ? 'event' : ''}'>
      ${print_icon(entry)}
      <yu class='head'>
        <a class='topic' onclick="Ø('query').bang('${term}')">${term}</a>
        <t class='time' onclick="Ø('query').bang('2018')">${group[group.length-1].time.offset_format().capitalize()}${group.length > 1 ? ', for '+group.length+' days' : ''}</t>
      </yu>
      ${name ? '<p>'+name+'.</p>' : ''}
      ${print_media(photos)}
      ${print_horaire(entry.unde(),group[0].task,fh,ch)}
    </log>`

    return html
  }

  function print_horaire(unde,task,fh,ch)
  {
    return `<mini><a class='tag' onclick="Ø('query').bang('${unde.to_url()}')">${unde.to_url()}</a> <a class='tag'>${task}</a> ${fh > 0 ? fh+'fh' : ''}</mini>`
  }

  function print_icon(entry)
  {
    return `<svg onclick="Ø('query').bang('${entry.name}')" class='icon'><path transform="scale(0.15,0.15) translate(20,20)" d="${entry.glyph}" style='stroke-width:10;stroke:white'></path></svg>`
  }

  function print_media(logs)
  {
    if(logs.length < 1){ return "" }

    if(logs.length > 2){
      return `
      <gallery class='p3'>
        <photo style='background-image:url(media/diary/${logs[0].photo}.jpg)' onclick="Ø('query').bang('${logs[0].term}')"></photo>
        <photo style='background-image:url(media/diary/${logs[1].photo}.jpg)' onclick="Ø('query').bang('${logs[0].term}')"></photo>
        <photo style='background-image:url(media/diary/${logs[2].photo}.jpg)' onclick="Ø('query').bang('${logs[0].term}')"></photo>
      </gallery>`
    }

    if(logs.length > 1){
      return `
      <gallery class='p2'>
        <photo style='background-image:url(media/diary/${logs[0].photo}.jpg)' onclick="Ø('query').bang('${logs[0].term}')"></photo>
        <photo style='background-image:url(media/diary/${logs[1].photo}.jpg)' onclick="Ø('query').bang('${logs[0].term}')"></photo>
      </gallery>`
    }

    if(logs.length > 0){
      return `
      <gallery class='p1'>
        <photo style='background-image:url(media/diary/${logs[0].photo}.jpg)' onclick="Ø('query').bang('${logs[0].term}')"></photo>
      </gallery>`
    }
  }

  function make_preview(project,event,lexicon)
  {
    var p = project ? lexicon[project.toUpperCase()].bref() : null
    var e = event && event != project ? lexicon[event.toUpperCase()].bref() : null
    return `${p ? p : ''} ${e ? e : ''}`.trim()
  }

  function sort_projects(projects)
  {
    var a = []
    for(var id in projects){
      a.push([id,projects[id]])
    }
    a.sort(function(a, b) {
      return a[1] - b[1];
    });

    return a.reverse()
  }

  function make_events(events)
  {
    var html = ""

    for(var id in events){
      var event = events[id]
      html += `${event.name} on {{${event.time}|${event.term}}}. `.to_markup()
    }

    return html
  }

  function make_projects(projects,horaire)
  {
    var html = ""

    html += projects.length > 2 ? `Worked on {{${projects[0][0]}}} for ${projects[0][1]} hours, as well as {{${projects[1][0]}}}, {{${projects[2][0]}}} and ${projects.length-3} other projects for a total of {*${horaire.sum} hours*} ` : ''
    html += `— at ${(horaire.efec*10).toFixed(1)}% Effectiveness and ${(horaire.efic*10).toFixed(1)}% Efficacy.`;

    return html.to_markup()
  }

  function ActivityGraph(horaire,size = {width:700})
  {
    var h = {}
    for(id in horaire){
      var log = horaire[id];
      h[log.time.toString()] = log;
    }

    // Cells
    var html = ""
    var week = 0
    var cell = parseInt(size.width/52)
    while(week < 52){
      var x = parseInt(week * (cell+1))
      var day = 0
      html += week % 2 == 0 ? `<text x='${x+(cell/2)}' y='-15'>${new Date().desamber().to_offset(-(364 - (week*7))).m}</text>` : ''
      while(day < 7){
        var y = parseInt(day * (cell+1))
        var offset = 364 - (week*7)-(day)
        var desamber = new Date().desamber().to_offset(-offset).toString()
        var log = h[desamber]
        html += log && log.sector ? `<rect class='${log.sector}' x='${x}' y='${y}' width='${cell}' height='${cell}' rx="2" ry="2" title='${log.time}' onclick="Ø('query').bang('${log.term}')"></rect>` : ''
        html += log && log.photo ? `<circle cx='${x+(cell/2)}' cy='${y+(cell/2)}' r='2' style='fill:black; stroke:none'></circle>` : ''
        html += log && log.is_event ? `<circle cx='${x+(cell/2)}' cy='${y+(cell/2)}' r='2' style='fill:none; stroke:black; stroke-width:1.5px'></circle>` : ''
        day += 1
      }
      week += 1
    }

    // Get min/max
    var week = 0
    var min = 999
    var max = 0
    while(week < 52){
      var day = 0
      var value = 0
      while(day < 7){
        var offset = 364 - (week*7)-(day)
        var desamber = new Date().desamber().to_offset(-offset).toString()
        var log = h[desamber]
        if(log){ value += (log.value+log.vector)/2 }
        day += 1
      }
      min = value < min ? value : min
      max = value > max ? value : max
      week += 1
    }

    // Bar Graph
    var path = ""
    var week = 0
    var height = cell*2
    var origin = {x:cell/2,y:((cell+1)*7)+height-15}
    while(week < 52){
      var x = parseInt(week * (cell+1))
      var day = 0
      var value = 0
      while(day < 7){
        var y = parseInt(day * (cell+1))
        var offset = 364 - (week*7)-(day)
        var desamber = new Date().desamber().to_offset(-offset).toString()
        var log = h[desamber]
        if(log){ value += (log.value+log.vector)/2 }
        day += 1
      }
      var percent = (value-min)/(max-min)
      var y = height - (percent*height)
      week += 1
      path += `M${x+origin.x},${origin.y+height} L${x+origin.x},${parseInt(y+origin.y)} `
    }

    // Legend

    html += `<rect class="audio" x="0" y="150" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='40' y='160' style='text-anchor:left'>Audio</text>`
    html += `<rect class="visual" x="70" y="150" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='110' y='160' style='text-anchor:left'>Visual</text>`
    html += `<rect class="research" x="140" y="150" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='190' y='160' style='text-anchor:left'>Research</text>`

    html += `<rect class="misc" x="240" y="150" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <circle cx='${240+(cell/2)}' cy='${150+(cell/2)}' r='2' style='fill:none; stroke:white; stroke-width:1.5px'></circle>
    <text x='280' y='160' style='text-anchor:left'>Event</text>`
    html += `<rect class="misc" x="310" y="150" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <circle cx='${310+(cell/2)}' cy='${150+(cell/2)}' r='2' style='fill:#fff; stroke:none'></circle>
    <text x='350' y='160' style='text-anchor:left'>Diary</text>`
    
    return `<svg class='graph' style='max-width:${size.width+30}px; height:${(cell*8)+height}px; width:100%;'>${html}<path d="${path}"/></svg>`
  }
}
Ø("unique").seal("journal",(q) => 
{
  function find_next_event(logs)
  {
    var selection = []
    var count = 0
    for(var id in logs){
      var log = logs[id]
      if(count > 30){ break; }
      if(log.time.offset() <= 0){ continue; }
      if(!log.is_event){ continue; }
      if(!log.term){ continue; }
      selection.push(log)
      count += 1
    }
    return selection.reverse()[0]
  }

  function find_any(logs)
  {
    var selection = []
    var count = 0
    for(var id in logs){
      var log = logs[id]
      if(count > 42){ break; }
      if(log.time.offset() > 0){ continue; }
      if(!log.term){ continue; }
      selection.push(log)
      count += 1
    }
    return selection
  }

  function make_groups(logs)
  {
    var groups = []
    var count = 0
    var group = []
    var prev  = null
    for(var id in logs){
      var log = logs[id]
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
    <log class='${is_event ? 'event' : ''} ${group[0].sector}'>
      <svg onclick="Ø('query').bang('${entry.name}')" class='icon'>
        <path transform="scale(0.15,0.15) translate(20,20)" d="${entry.glyph()}"></path>
      </svg>
      <yu class='head'>
        <a class='topic' onclick="Ø('query').bang('${term}')">${term}</a>
        <t class='time' onclick="Ø('query').bang('2018')">${group.length > 1 ? `For ${group.length} days, from ${group[group.length-1].time} to ${group[0].time}` : group[group.length-1].time.offset_format()}</t>
      </yu>
      ${name ? '<p>'+name+'.</p>' : ''}
      ${print_media(photos)}
      <yu class='tags'>
        <a class='tag' onclick="Ø('query').bang('${entry.unde().to_url()}')">${entry.unde().to_url()}</a>
        <a class='tag'>${group[0].task}</a> ${fh > 0 ? '<t class="fh">'+fh+'</t>' : ''}
      </yu>
    </log>`

    return html
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

  function style()
  {
    return `

    yu#view { background:transparent; }
    yu#core { background-color:#000 !important; color:white;border-bottom:1px solid #333}
    yu#header { -webkit-filter: invert(1); filter: invert(1); }
    yu#header photo { display:none}
    #navi { -webkit-filter: invert(1); filter: invert(1); }
    #content log { display:block; padding:15px; margin-bottom:1px; vertical-align:top; position:relative; padding-left:100px; font-size:14px; max-width: 695px; border-bottom:1px solid #333 }
    #content log .head { display: block; font-size:15px; line-height: 25px; }
    #content log .head a { font-family: 'archivo_bold' }
    #content log .head a:hover { text-decoration: underline; cursor:pointer; }
    #content log .head t { color:#999; display: inline-block; margin-left:5px; font-size:14px; }
    #content log .head t:hover { text-decoration: underline; cursor:pointer; }
    #content log svg.icon { cursor: pointer; background:black; width:50px; height:50px; border-radius:3px; display:inline-block; position:absolute; left:35px }
    #content log svg.icon path { fill:none; stroke-width:10;stroke:white }
    #content log.audio svg:hover { background:#72dec2 !important; }
    #content log.visual svg:hover { background:#ffb545 !important; }
    #content log.research svg:hover { background:#ccc !important; }
    #content log.misc svg:hover { background:#333333 !important; }
    #content log p { font-size: 22px; margin-bottom: 20px; color:#ccc }
    #content log gallery { margin-bottom:15px; }
    #content log gallery photo { cursor: pointer; }
    #content log .tags { font-size:12px; font-family:'archivo_medium'; }
    #content log .tags .fh { float:right; color:#aaa }
    #content log .tags .fh:after { content:"fh"; font-family:'archivo_italic'; color:#777; padding-left:2px}
    #content log .tags a { color:#aaa; margin-right:10px}
    #content log .tags a:before { content:'#'; color:#777; padding-right:2px}
    #content log .tags a:hover { color:#fff}
    #content log.event .head .topic:after { content: "Event";background: #72dec2;display: inline-block;margin-left: 5px;font-size:12px;padding:0px 10px;border-radius: 100px;line-height: 20px;position: absolute;right:20px;top:20px;color:black }
    #content > p:first-child { display:none}`
  }

  var html = `${new ActivityViz(q.tables.horaire)}`

  // Find upcoming events
  html += print_group([find_next_event(q.tables.horaire)],q.tables.lexicon)
  // // Find any event
  var any = find_any(q.tables.horaire)
  var groups = make_groups(any)
  for(var id in groups){
    var group = groups[id]
    html += print_group(group,q.tables.lexicon)
  }
  return html+`<style>${style()}</style>`
});

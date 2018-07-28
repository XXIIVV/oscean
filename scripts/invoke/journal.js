Ø("invoke").seal("journal",(q) => 
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

  function find_page(logs,offset = 0,page = 42)
  {
    var selection = []
    var count = 0
    var from = page * offset;
    var to = page * (offset+1);
    for(var id in logs){
      var log = logs[id]
      if(log.time.offset() > 0 || !log.term){ continue; }
      count += 1
      if(count < from){ continue; }
      if(count > to){ break; }
      selection.push(log)
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
    var tags_html = ""

    // Summarize
    var fh = 0
    var ch = 0
    var term = group[0].term
    var entry = lexicon[term.toUpperCase()]
    var photos = []
    var tags = {}
    var is_event = false
    var name = null

    for(id in group){
      var log = group[id];
      fh += log.value
      ch += log.vector
      tags[log.task] += log.value
      is_event = log.is_event
      if(log.name && !name){
        name = log.name
      }
      if(log.photo){
        photos.push(log)
      }
    }

    tags_html += `<a class='tag'>${entry.unde().to_url()}</a>`
    for(id in Object.keys(tags)){
      tags_html += `<a class='tag'>${Object.keys(tags)[id]}</a> `
    }

    html += `
    <yu class='entry ${is_event ? 'event' : ''} ${group[0].sector}'>
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
        ${tags_html} ${fh > 0 ? '<t class="fh">'+fh+'</t>' : ''}
      </yu>
    </yu>`

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
    #content yu.entry { display: block;padding: 15px 45px 15px;margin-bottom: 1px;vertical-align: top;position: relative;padding-left: 100px;font-size: 14px;max-width: 665px;border-bottom: 1px solid #333;min-height: 50px }
    #content yu.entry:hover svg { opacity:0.6;}
    #content yu.entry .head { display: block; font-size:15px; line-height: 30px; }
    #content yu.entry .head a { font-family: 'archivo_bold' }
    #content yu.entry .head a:hover { text-decoration: underline; cursor:pointer; }
    #content yu.entry .head t { color:#999; display: inline-block; margin-left:5px; font-size:14px; }
    #content yu.entry .head t:hover { text-decoration: underline; cursor:pointer; }
    #content yu.entry svg:hover { opacity: 1.0}
    #content yu.entry svg.icon { cursor: pointer; background:black; width:50px; height:50px; border-radius:3px; display:inline-block; position:absolute; left:35px }
    #content yu.entry svg.icon path { fill:none; stroke-width:10;stroke:white }
    #content yu.entry.audio svg:hover { background:#72dec2 !important; }
    #content yu.entry.visual svg:hover { background:#ffb545 !important; }
    #content yu.entry.research svg:hover { background:#ccc !important; }
    #content yu.entry.misc svg:hover { background:#333333 !important; }
    #content yu.entry p { font-size: 22px; margin-bottom: 20px; color:#ccc }
    #content yu.entry gallery { margin-bottom:15px; }
    #content yu.entry gallery photo { cursor: pointer; }
    #content yu.entry .tags { font-size:12px; font-family:'archivo_medium'; }
    #content yu.entry .tags .fh { float:right; color:#aaa }
    #content yu.entry .tags .fh:after { content:"fh"; font-family:'archivo_italic'; color:#777; padding-left:2px}
    #content yu.entry .tags a { color:#aaa; margin-right:5px}
    #content yu.entry .tags a:before { content:'#'; color:#777; padding-right:2px}
    #content yu.entry .tags a:hover { color:#fff}
    #content yu.entry.event .head .topic:after { content: "Event";background: #72dec2;display: inline-block;margin-left: 5px;font-size:12px;padding:0px 10px;border-radius: 100px;line-height: 20px;position: absolute;right:45px;top:20px;color:black }
    #content > p:first-child { display:none}
    #content yu.pagination a { display: block;line-height: 60px;text-align: center;max-width: 810px;font-family: 'archivo_bold';font-size:12px}
    #content yu.pagination a:hover { text-decoration:underline}
    `
  }

  // Clear cache
  var html = `${new ActivityViz(q.tables.horaire)}`

  // Find upcoming events
  html += print_group([find_next_event(q.tables.horaire)],q.tables.lexicon)
  // // Find any event
  var page = parseInt(q.params) > 0 ? parseInt(q.params) : 0
  var any = find_page(q.tables.horaire,page)
  var groups = make_groups(any)
  for(var id in groups){
    var group = groups[id]
    html += print_group(group,q.tables.lexicon)
  }
  return html+`<style>${style()}</style>`
});

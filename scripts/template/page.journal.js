function JournalTemplate(id,rect,...params)
{
  TemplateNode.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {
    var html = ""

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
    for(id in group){
      var log = group[id];
      fh += log.value
      ch += log.vector
      is_event = log.is_event
      if(log.photo){
        photos.push(log)
      }
    }

    // 3 days ago for 3 days

    html += `
    <log class='${is_event ? 'event' : ''}'>
      ${print_icon(entry)}
      <yu class='head'>
        <a class='topic' onclick="Ø('query').bang('${term}')">${term}</a>
        <t class='time' onclick="Ø('query').bang('2018')">${group[0].time.offset_format().capitalize()}${group.length > 1 ? ', for '+group.length+' days' : ''}</t>
      </yu>
      ${log.name ? '<p>'+log.name+'.</p>' : ''}
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
    return `<svg onclick="Ø('query').bang('${entry.name}')" style='background:black; width:50px; height:50px; border-radius:3px; display:inline-block; position:absolute; left:15px'><path transform="scale(0.15,0.15) translate(20,20)" d="${entry.glyph}" style='stroke-width:10;stroke:white'></path></svg>`
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
}
function JournalTemplate(id,rect,...params)
{
  TemplateNode.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {
    var groups = find_groups(q.tables.horaire)
    var html = q.result.long()
    for(var id in groups){
      var group = groups[id]
      var sorted_projects = sort_projects(group.projects)
      html += `<h2>${id}${group.events.length > 0 ? ': '+group.events[0].term : ''}</h2>`
      html += make_photos(group.photos)
      html += `<p>${make_events(group.events)}${make_projects(sorted_projects,group.horaire)}</p>`
      html += `<p>${make_preview(sorted_projects[0] ? sorted_projects[0][0] : null,group.events[0] ? group.events[0].term : null,q.tables.lexicon)}</p>`
    }
    return html
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

  function make_photos(photos)
  {
    var html = ""

    if(photos.length > 2){
      return `
      <gallery class='p3'>
        <photo style='background-image:url(media/diary/${photos[0]}.jpg)'></photo>
        <photo style='background-image:url(media/diary/${photos[1]}.jpg)'></photo>
        <photo style='background-image:url(media/diary/${photos[2]}.jpg)'></photo>
      </gallery>`
    }

    if(photos.length > 1){
      return `
      <gallery class='p2'>
        <photo style='background-image:url(media/diary/${photos[0]}.jpg)'></photo>
        <photo style='background-image:url(media/diary/${photos[1]}.jpg)'></photo>
      </gallery>`
    }

    if(photos.length > 0){
      return `
      <gallery class='p1'>
        <photo style='background-image:url(media/diary/${photos[0]}.jpg)'></photo>
      </gallery>`
    }

    return ""
  }

  function find_groups(logs)
  {
    var h = {}

    var count = 0
    for(var id in logs){
      var log = logs[id]
      if(log.time.offset() > 0){ continue; }
      if(!log.term){ continue; }
      var group = parseInt(count/28)
      if(group > 4){ break; }
      if(!h[group]){ h[group] = []}
      h[group].push(log);
      count += 1
    }

    var groups = {}
    for(id in h){
      var group = h[id]
      groups[`From ${group[0].time} to ${group[group.length-1].time}`] = parse(group)
    }
    return groups
  }

  function parse(group)
  {
    var render = {projects:{},horaire:new Horaire(group),photos:[],events:[]}
    for(id in group){
      var log = group[id];
      render.projects[log.term] = render.projects[log.term] ? render.projects[log.term]+log.value : log.value
      if(log.photo){ render.photos.push(log.photo) }
      if(log.is_event){ render.events.push(log) }
    }
    return render
  }
}
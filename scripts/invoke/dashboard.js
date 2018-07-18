Ø("invoke").seal("dashboard",(q) => 
{
  var html = ""

  html += `${new StatusViz(q.tables.horaire)}`
  html += `${new ActivityViz(q.tables.horaire,{size:{width:700},theme:"pale"})}`
  html += `${new ForecastViz(q.tables.horaire)}`

  // Upcomign events

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
    return selection
  }

  var upcoming = find_next_event(q.tables.horaire)

  html += "<list>"
  for(id in upcoming){
    var event = upcoming[id]
    html += `${event}`
  }
  html += "</list>"

  html += '<table>'
  for(id in q.tables.issues){
    var issues = q.tables.issues[id];
    html += `<tr><th>{{${id.capitalize()}}}</th><td>`.to_markup()
    for(i in issues){
      html += `${issues[i]}<br />`.to_markup();
    }
    html += '</td></tr>'
  }
  html += '</table>'

  return html
});

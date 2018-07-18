Ø("invoke").seal("dashboard",(q) => 
{
  var html = ""

  html += `${new StatusViz(q.tables.horaire)}`
  html += `${new ActivityViz(q.tables.horaire,{size:{width:700},theme:"pale"})}`
  html += `${new ForecastViz(q.tables.horaire)}`

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

Ø("invoke").seal("dashboard",(q) => 
{
  var html = ""

  return "<p>Under development.</p>"

  // Last 365 Days
  var a = []
  for(id in q.tables.horaire){
    var log = q.tables.horaire[id];
    var offset = log.time.offset();
    if(offset > 0){ continue; }
    if(offset < -365){ break; }
    a.push(log)
  }

  html += `${new ForecastViz(a)}`
  
  return html
});

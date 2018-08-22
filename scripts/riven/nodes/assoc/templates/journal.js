function JournalTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element

  this.answer = function(q,upcoming = false)
  {
    var all_logs = q.target == "journal" ? q.tables.horaire : q.result.logs;

    // Collect only the last 366 logs
    var logs = []
    for(id in all_logs){
      var log = all_logs[id];
      if(!log.term){ continue; }
      if(log.time.offset > 0 && !upcoming){ continue; }
      if(log.time.offset < -366){ continue; }
      logs[logs.length] = log
    }

    if(logs.length < 1){
      return `<p>There is no recent activity to the {{${q.result.name.capitalize()}}} project, go {{back|${q.result.name.capitalize()}}}.</p>`.to_markup()
    }

    // Build journals
    var journals = {}
    for(id in logs){
      var log = logs[id];
      if(Object.keys(journals).length > 16){ break; }
      if(!journals[log.term]){ journals[log.term] = new Journal(); }
      journals[log.term].push(log)
    }

    var html = ''

    for(id in journals){
      var journal = journals[id];
      html += `${journal}`
    }

    return `${new ActivityViz(logs)}${new StatusViz(logs)}${html}<style>.graph.status { margin-bottom:0px !important }</style>`
  }
}
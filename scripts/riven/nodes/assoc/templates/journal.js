function JournalTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element

  this.answer = function(q,upcoming = false)
  {
    let all_logs = q.target == "journal" ? q.tables.horaire : q.result.logs;

    // Collect only the last 366 logs
    let logs = []
    for(id in all_logs){
      let log = all_logs[id];
      if(!log.term){ continue; }
      if(log.time.offset > 0 && !upcoming){ continue; }
      if(log.time.offset < -366){ continue; }
      logs[logs.length] = log
    }

    if(logs.length < 1){
      return `<p>There is no recent activity to the {(${q.result.name.capitalize()})} project, go {back(${q.result.name.capitalize()})}.</p>`.to_curlic()
    }

    // Build journals

    let html = ''
    let i = 0
    for(id in logs){
      if(i > 14){ break; }
      let log = logs[id];
      if(!log.photo){ continue; }
      html += `${log}`
      i += 1
    }

    return `${new ActivityViz(logs)}${new StatusViz(logs)}${html}<style>.graph.status { margin-bottom:0px !important }</style>`
  }
}
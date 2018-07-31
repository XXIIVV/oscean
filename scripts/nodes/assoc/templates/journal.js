function JournalTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element

  this.next_event = function()
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
    return selection.length > 0 ? selection.reverse()[0] : ''
  }

  this.answer = function(q,upcoming = false)
  {
    var logs = q.target == "journal" ? q.tables.horaire : q.result.logs;
    var html = ""

    var journals = {}
    for(id in logs){
      var log = logs[id];
      if(!log.term){ continue; }
      if(log.time.offset() > 0 && !upcoming){ continue; }
      if(Object.keys(journals).length > 16){ break; }
      if(!journals[log.term]){ journals[log.term] = new Journal(); }
      journals[log.term].push(log)
    }

    html += `${new ActivityViz(logs)}`
    html += `${new StatusViz(logs)}`

    for(id in journals){
      var journal = journals[id];
      html += `${journal}`
    }

    return html
  }
}
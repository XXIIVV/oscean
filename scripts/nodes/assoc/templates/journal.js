function JournalTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element

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

  this.answer = function(q)
  {
    var logs = q.target == "journal" ? q.tables.horaire : q.result.logs;
    var html = ""

    html += new ActivityViz(logs);
    html += find_next_event(q.tables.horaire).toString()

    var count = 0
    var prev = null;
    for(id in logs){
      var log = logs[id]
      if(count > 30){ break; }
      if(log.time.offset() > 0){ continue; }
      if(!log.term || log.value < 1){ continue; }
      if(prev && log.term && log.term == prev){ continue; }
      html += `${log}`
      count += 1
      prev = log.term
    }

    return html
  }
}
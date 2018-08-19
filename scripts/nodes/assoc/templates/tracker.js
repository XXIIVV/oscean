function TrackerTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element

  // Services

  function find_available(q)
  {
    var used = []
    for(id in q.tables.horaire){
      var log = q.tables.horaire[id]
      if(!log.photo){ continue; }
      used.push(log.photo)
    }
    var available = 1
    while(available < 999){
      if(used.indexOf(available) < 0){ return available; }
      available += 1
    }
  }

  function on_this_day(q)
  {
    var today = new Date().desamber();
    var a = []
    for(id in q.tables.horaire){
      var log = q.tables.horaire[id]
      if(!log.is_event){ continue; }
      if(!log.name){ continue; }
      if(log.time.offset >= 0){ continue; }
      if(log.time.doty != today.doty){ continue; }
      a.push(log)
    }
    return a;
  }

  this.answer = function(q)
  {
    console.info("Next Available:",find_available(q))
    console.info("On This Day:",on_this_day(q))

    var logs = q.target == "tracker" ? q.tables.horaire : q.result.logs;

    var html = ""

    html += `<style>
    table td.perfect { background:#000; border-radius:2px}
    table td.good { background:#316067; border-radius:2px}
    table td.fair { background:#51a196; border-radius:2px}
    table td.poor { background:#72dec2; border-radius:2px}
    </style>`

    html += `<table>`
    for(id in q.tables.lexicon){
      var term = q.tables.lexicon[id]
      var r = term.rating()
      html += `<tr>`
      html += `
      <td class='${r.status}'>{{${term.name.capitalize()}}}</b></td>
      <td>${r.score} ${term.incoming.length}/${term.outgoing.length} ${term && term.latest_log ? term.latest_log.time.offset : ''}</td>
      `.to_markup()
      for(i in r.points){
        html += `<td title='${i}'>${r.points[i] ? '•' : ''}</td>`  
      }
      html += `</tr>`
    }
    html += `</table>`

    return html
  }
}
Ø("invoke").seal("status",(q) => 
{
  var html = ""
  var progress = {sum:0,count:0}
  var ratings = {}

  // Service
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
      if(used.indexOf(available) < 0){ console.log(`Next Available:${available}`); break; }
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
      if(log.time.offset() >= 0){ continue; }
      if(log.time.doty != today.doty){ continue; }
      a.push(log)
    }

    var html = "";

    if(a.length > 0){
      html += "<code>"
      for(id in a){
        var log = a[id];
        html += `<comment>${today.y - log.time.y}y ago today</comment> ${log.name}\n`
      }
      html += "</code>"
    }
    return html;
  }

  find_available(q)

  html += on_this_day(q)

  for(id in q.tables.lexicon){
    var term = q.tables.lexicon[id];
    var rating = term.rating().status
    if(!ratings[rating]){ ratings[rating] = []; }
    ratings[rating].push(term)
  }

  for(rating in ratings){
    html += `<tr><th>${rating} — ${ratings[rating].length}</th></tr>`
    for(id in ratings[rating]){
      var term = ratings[rating][id];
      var r = term.rating()
      var html_rating = ""
      for(i in r.points){
        html_rating += `<td title='${i}'>${r.points[i] ? '•' : ''}</td>`
      }
      progress.sum += r.score
      progress.count += 1
      html_rating += `<td>${term.incoming.length > 1 ? '>'+term.incoming.length : ''}</td><td>${term.outgoing.length > 1 ? term.outgoing.length+'>' : ''}</td>`
      html += `<tr><td>{{${term.name.capitalize()}}}</b></td><td>${r.score}</td>${html_rating}</tr>`.to_markup()
    }
  }
  return `<table class='rating'>${html}</table>`
});

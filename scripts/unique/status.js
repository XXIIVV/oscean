function MAKE_STATUS(q)
{
  function make_links(lexicon)
  {
    var h = {outgoing:{},incoming:{}}
    // Outgoing
    for(id in lexicon){
      var term = lexicon[id]
      h.outgoing[term.name] = find_links(term.dict.BREF,term.dict.LONG)
    }
    // Incoming
    for(name in h.outgoing){
      var a = h.outgoing[name]
      for(id in a){
        var link = a[id]
        if(!h.incoming[link]){ h.incoming[link] = [] }
        h.incoming[link].push(name)
      }
    }
    return h
  }

  function find_links(bref,long)
  {
    var a = []
    var parts = bref.toString().split("{{")
    for(id in parts){
      var part = parts[id];
      if(part.indexOf("}}") == -1){ continue; }
      var content = part.split("}}")[0];
      if(content.substr(0,1) == "$"){ continue; }
      var target = content.indexOf("|") > -1 ? content.split("|")[1] : content;
      var name = content.indexOf("|") > -1 ? content.split("|")[0] : content;
      var external = (target.indexOf("https:") > -1 || target.indexOf("http:") > -1 || target.indexOf("dat:") > -1);
      if(external){ continue; }
      a.push(target.toUpperCase())
    }

    var parts = long ? long.join("\n").toString().split("{{") : []
    for(id in parts){
      var part = parts[id];
      if(part.indexOf("}}") == -1){ continue; }
      var content = part.split("}}")[0];
      if(content.substr(0,1) == "$"){ continue; }
      var target = content.indexOf("|") > -1 ? content.split("|")[1] : content;
      var name = content.indexOf("|") > -1 ? content.split("|")[0] : content;
      var external = (target.indexOf("https:") > -1 || target.indexOf("http:") > -1 || target.indexOf("dat:") > -1);
      if(external){ continue; }
      a.push(target.toUpperCase())
    }
    return a
  }

  function rate(term,links)
  {
    var points = {}

    var logs = term.logs

    points['long'] = term.dict.LONG && term.dict.LONG.length > 0
    points['logs'] = term.logs.length > 0
    points['photo'] = term.diaries.length > 0
    points['outgoing'] = links.outgoing && links.outgoing[term.name].length > 1
    points['incoming'] = links.incoming && links.incoming[term.name] && links.incoming[term.name].length > 1
    points['glyph'] = term.glyph != ""
    points['links'] = Object.keys(term.links).length > 0

    return points
  }

  var links = make_links(q.tables.lexicon)

  // Print
  var html = ""
  var progress = {sum:0,count:0}
  for(id in q.tables.lexicon){
    var term = q.tables.lexicon[id];
    var rating = rate(term,links)
    var html_rating = ""
    var s = 0
    for(id in rating){
      html_rating += `<td title='${id}'>${rating[id] ? '•' : ''}</td>`
      s += rating[id] ? 1 : 0
    }
    var score = (s/Object.keys(rating).length)
    var summary = score < 0.4 ? 'poor' : score < 0.7 ? 'fair' : score < 0.9 ? 'good' : ''
    progress.sum += score
    progress.count += 1
    html_rating += `<td class='${summary}'>${summary == 'poor' ? '<b>'+summary+'</b>' : summary}</td>`
    html += `<tr><td><b>${term.name.capitalize()}</b></td>${html_rating}</tr>`
  }
  return `<table class='rating'>${html}</table><p>The current progress of the Nataniev improvement project, currently affecting ${progress.count} projects, is of <b>${((progress.sum/progress.count)*100).toFixed(2)}%</b>.</p>`
}

Ø("unique").seal("status",MAKE_STATUS);

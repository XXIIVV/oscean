function StatusTemplate(id,rect,...params)
{
  TemplateNode.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template

  this.answer = function(q)
  {
    var lexicon = q.tables.lexicon
    var horaire = q.tables.horaire
    var lexicon_logs = this.make_lexicon_logs(horaire);
    var links = this.make_links(lexicon)

    return `
      ${this.make_status(lexicon,lexicon_logs,links)}
      ${this.make_issues(lexicon,horaire,lexicon_logs,links)}
      `
  }

  this.make_issues = function(lexicon,horaire,lexicon_logs,links)
  {
    var html = ""

    var h = {}

    // Broken links
    for(name in lexicon){
      for(id in links.outgoing[name]){
        var target = links.outgoing[name][id]
        if(lexicon[target]){ continue; }
        if(!h[name]){ h[name] = [] }
        h[name].push(`redlink(${target})`)
      }
    }

    for(id in horaire){
      var term = horaire[id].term.toUpperCase()
      var name = horaire[id].time
      if(lexicon[term] || term == ""){ continue; }
      if(!h[name]){ h[name] = [] }
      h[name].push(`redlink(${term})`)
    }

    // Print
    for(name in h){
      var issues = h[name]
      for(id in issues){
        html += `<tr><td><b>${name.capitalize()}</b></td><td>${issues[id]}</td></tr>`
      }
    }

    return `<table><tr><th>ISSUES</th></tr>${html}</table>`
  }

  this.make_status = function(lexicon,lexicon_logs,links)
  {
    // Build cats
    var cats = {}
    for(id in lexicon){
      var term = lexicon[id]
      if(!cats[term.type]){ cats[term.type] = [] }
      cats[term.type].push(term);
    }

    // Print
    var html = ""
    var progress = {sum:0,count:0}
    for(id in cats){
      var cat = cats[id]
      html += `<tr><th>${id.toUpperCase()}</th><th></th></tr>`
      for(i in cat){
        var term = cat[i];
        var rating = this.rate(term,lexicon_logs,links)
        var html_rating = ""
        var s = 0
        for(id in rating){
          html_rating += `<td title='${id}'>${rating[id] ? '•' : ''}</td>`
          s += rating[id] ? 1 : 0
        }
        var score = (s/Object.keys(rating).length)
        var summary = score < 0.4 ? 'poor' : score < 0.7 ? 'fair' : score < 0.9 ? 'good' : 'perfect'
        progress.sum += score
        progress.count += 1
        html_rating += `<td class='${summary}'>${summary}</td>`
        html += `<tr><td><b>${term.name.capitalize()}</b></td>${html_rating}</tr>`
      }
    }
    return `<table class='rating'>${html}</table><p>The current progress of the Nataniev improvement project, currently affecting ${progress.count} projects, is of <b>${((progress.sum/progress.count)*100).toFixed(2)}%</b>.</p>`
  }

  this.rate = function(term,lexicon_logs,links)
  {
    var points = {}

    var logs = lexicon_logs[term.name]

    points['long'] = term.dict.LONG && term.dict.LONG.length > 0
    points['logs'] = logs && logs.length > 0
    points['photo'] = logs && this.find_diaries(logs).length > 0
    points['outgoing'] = links.outgoing && links.outgoing[term.name].length > 1
    points['incoming'] = links.incoming && links.incoming[term.name] && links.incoming[term.name].length > 1
    points['glyph'] = term.glyph != ""
    points['links'] = Object.keys(term.links).length > 0

    return points
  }

  this.make_lexicon_logs = function(horaire)
  {
    var h = {}
    for(id in horaire){
      var log = horaire[id]
      var name = log.term.toUpperCase()
      if(!h[name]){ h[name] = []; }
      h[name].push(log)
    }
    return h;
  }

  this.make_links = function(lexicon)
  {
    var h = {outgoing:{},incoming:{}}

    // Outgoing
    for(id in lexicon){
      var term = lexicon[id]
      h.outgoing[term.name] = this.find_links(term.dict.BREF,term.dict.LONG)
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

  this.find_diaries = function(logs)
  {
    var a = []
    for(id in logs){
      var log = logs[id];
      if(!log.photo){ continue; }
      a.push(log)
    }
    return a
  }

  this.find_links = function(bref,long)
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
  
  this.style = function()
  {
    return `
    table.rating { width: 600px;margin-bottom:45px}
    table.rating tr:hover { background:#fff}
    table.rating td.poor { background:#ff726c}
    table.rating td.fair { background:yellow}
    table.rating td.good { background:#72dec2}
    `
  }
}

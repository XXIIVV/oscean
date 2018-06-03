function StatusTemplate(id,rect,...params)
{
  TemplateNode.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.logs_per_term = {}
  this.links_outgoing = {}
  this.links_incoming = {}

  this.answer = function(q)
  {
    var lexicon = q.tables.lexicon
    var horaire = q.tables.horaire

    // Build logs
    for(id in horaire){
      var log = horaire[id]
      if(!this.logs_per_term[log.term.toUpperCase()]){ this.logs_per_term[log.term.toUpperCase()] = []; }
      this.logs_per_term[log.term.toUpperCase()].push(log)
    }

    // Build links
    for(id in lexicon){
      var term = lexicon[id]
      this.links_outgoing[term.name] = this.find_links(term.dict.BREF,term.dict.LONG)
    }

    for(name in this.links_outgoing){
      var a = this.links_outgoing[name]
      for(id in a){
        var link = a[id]
        if(!this.links_incoming[link]){ this.links_incoming[link] = [] }
        this.links_incoming[link].push(name)
      }
    }

    // Sort by type
    var cats = {}
    for(id in lexicon){
      var term = lexicon[id]
      if(!cats[term.type]){ cats[term.type] = [] }
      cats[term.type].push(term);
    }
    return this.table(cats)
  }

  this.table = function(cats)
  {
    var html = ""

    for(id in cats){
      var cat = cats[id]
      html += `<tr><th>${id.toUpperCase()}</th><th></th></tr>`
      for(i in cat){
        var term = cat[i];
        var rating = this.rate(term)
        html += `<tr><td><b>${term.name.capitalize()}</b></td>${this.make_rating(rating)}</tr>`
      }
    }
    return `<table class='rating'>${html}</table>`
  }

  this.make_rating = function(rating)
  {
    var html = ""
    var s = 0
    for(id in rating){
      html += `<td title='${id}'>${rating[id] ? '•' : ''}</td>`
      s += rating[id] ? 1 : 0
    }
    var score = (s/Object.keys(rating).length)
    var summary = score < 0.4 ? 'poor' : score < 0.7 ? 'fair' : score < 0.9 ? 'good' : 'perfect'

    return `${html}<td class='${summary}'>${summary}</td>`
  }

  this.rate = function(term)
  {
    var points = {}

    var logs = this.logs_per_term[term.name]

    points['long'] = term.dict.LONG && term.dict.LONG.length > 0
    points['logs'] = logs && logs.length > 0
    points['photo'] = logs && this.find_diaries(logs).length > 0
    points['outgoing'] = this.links_outgoing && this.links_outgoing[term.name].length > 1
    points['incoming'] = this.links_incoming && this.links_incoming[term.name] && this.links_incoming[term.name].length > 1
    points['glyph'] = term.glyph != ""
    points['links'] = Object.keys(term.links).length > 0

    return points
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

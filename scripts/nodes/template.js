function TemplateNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.parser

  this.cache = null;

  this.receive = function(q)
  {
    var result = q.result;
    var type = result && result.type ? result.type.toLowerCase() : "page"

    if(q.name.length == 4 && parseInt(q.name) > 2005){ type = "calendar"}

    var assoc = this.signal(type);

    if(!assoc){
      console.warn(`Missing template: ${type}`)
      assoc = this.signal("page");
    }
    
    this.send(assoc.answer(q))
    this.label = `template:${assoc.id}`

    setTimeout(()=>{ Ø("view").el.className = "ready" },100)
  
    // Install Dom
    document.body.appendChild(this.signal("view").answer())
  }

  this.find_logs = function(name,logs)
  {
    var a = []
    for(id in logs){
      var log = logs[id];
      if(log.term.toUpperCase() == name){ a.push(log) }
    }
    return a
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

  this.find_photo = function(logs)
  {
    for(id in logs){
      var log = logs[id];
      if(!log.photo){ continue; }
      if(!log.is_featured){ continue; }
      return log
    }
    for(id in logs){
      var log = logs[id];
      if(!log.photo){ continue; }
      return log
    }
    return null
  }

  this.find_siblings = function(parent,lexicon)
  {
    var a = []
    for(id in lexicon){
      var term = lexicon[id];
      if(!term.unde() || !parent || parent.toUpperCase() != term.unde().toUpperCase()){ continue; }
      a.push(term)
    }
    return a  
  }

  this.find_children = function(name,lexicon)
  {
    var a = []
    for(id in lexicon){
      var term = lexicon[id];
      if(!term.unde() || name != term.unde().toUpperCase()){ continue; }
      a.push(term)
    }
    return a    
  }

  this.make_navi = function(term,lexicon)
  {
    var html = ""
    var portal = this.find_portal(term,lexicon);

    if(!portal){ console.log("No portal found"); return "" }

    html += "<table width='100%'>"
    html += `<tr><th width='100'><svg id="glyph"><path transform="scale(0.175,0.175) translate(-50,-50)" d="${portal.glyph}"></path></svg></th><th colspan='3'><h2>The ${portal.name.capitalize()} Portal</h2><p>${portal.bref()}</p></th></tr>`

    var d1 = this.find_children(portal.name,lexicon)
    for(id in d1){
      var d1c = d1[id];
      var d2 = this.find_children(d1c.name,lexicon)
      var html_child = ``
      for(id in d2){
        var d2c = d2[id]
        html_child += d2c.name == term.name ? `{*${d2c.name.capitalize()}*} ` :`{{${d2c.name.capitalize()}}} `
        var d3 = this.find_children(d2c.name,lexicon)
        if(d3.length > 0){
          html_child = html_child.trim()+"("
          for(id in d3){
            var d3c = d3[id]
            html_child += d3c.name == term.name ? `{*${d3c.name.capitalize()}*} ` : `{{${d3c.name.capitalize()}}} `
          }
          html_child = html_child.trim()+") "
        }
      }
      html += `<tr><th></th><th width='100'>{{${d1c.name.capitalize()}}}</th><td>${html_child}</td></tr>`.to_markup()
    }
    html += "</table>"
    return html
  }

  this.find_portal = function(term,lexicon)
  {
    if(!lexicon[term.unde().toUpperCase()]){ console.log("Parent is missing"); return "" }

    var portal = null
    var parent = lexicon[term.unde().toUpperCase()]
    if(term.type && term.type.toLowerCase() == "portal"){
      portal = term
    }
    else if(parent.type && parent.type.toLowerCase() == "portal"){
      portal = parent
    }
    else{
      var parent_parent = lexicon[parent.unde().toUpperCase()]
      if(parent_parent.type && parent_parent.type.toLowerCase() == "portal"){
        portal = parent_parent
      }
      else{
        var parent_parent_parent = lexicon[parent_parent.unde().toUpperCase()]
        if(parent_parent_parent.type && parent_parent_parent.type.toLowerCase() == "portal"){
          portal = parent_parent_parent
        }
      }
    }
    return portal;
  }
}



function on_scroll()
{
  var info_el = document.getElementById("info")
  var scroll = document.body.scrollTop;

  // Info
  if(scroll > 0){
    if(info_el.className != "ghost"){
      info_el.className = "ghost"
    }
  }
  else{
    if(info_el.className == "ghost"){
      info_el.className = ""
    }
  }

  // Logo/Search
  var header_el = document.getElementById("header")
  var logo_el = document.getElementById("logo")
  var menu_el = document.getElementById("menu")
  if(scroll > header.offsetHeight - 110){
    if(logo_el.className != "sticky"){ logo_el.className = "sticky" }
    if(menu_el.className != "sticky"){ menu_el.className = "sticky" }
  }
  else{
    if(logo_el.className == "sticky"){ logo_el.className = "" }
    if(menu_el.className == "sticky"){ menu_el.className = "" }
  }
}

window.addEventListener("scroll", on_scroll);
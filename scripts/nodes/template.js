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

  this.style = function()
  {
    return ''
  }

  this.make_table = function(term,lexicon,depth = 3, selection = null)
  {
    if(depth <= 0){ return "" }
    var children = this.find_children(term.name,lexicon)
    if(children.length == 0){ return ""}

    var html = ""

    if(depth == 2){
      for(id in children){
        var child = children[id];
        html += selection && child.name == selection.name ?  `<t class='depth${depth}'>{*${child.name.capitalize()}*}${this.make_table(child,lexicon,depth-1,selection)}</t> `.to_markup() : `<t class='depth${depth}'>{{${child.name.capitalize()}}}${this.make_table(child,lexicon,depth-1,selection)}</t> `.to_markup()
      }
      return html
    }

    if(depth == 1){
      for(id in children){
        var child = children[id];
        html += selection && child.name == selection.name ? `<t class='depth${depth}'>{*${child.name.capitalize()}*}</t> `.to_markup() : `<t class='depth${depth}'>{{${child.name.capitalize()}}}</t> `.to_markup()
      }
      return children.length > 0 ? `(${html.trim()})` : ''
    }
    html += "<table width='100%'>"
    for(id in children){
      var child = children[id];
      html += `<tr class='head'><th class='${selection && child.name == selection.name ? 'selected' : ''}'>{{${child.name.capitalize()}}}</th><td>${this.make_table(child,lexicon,depth-1,selection)}</td></tr>`.to_markup()
    }
    html += "</table>"
    return html
  }

  this.make_navi = function(term,lexicon)
  {
    var html = ""
    var portal = this.find_portal(term,lexicon);

    if(!portal){ console.log("No portal found"); return "" }

    html += `<svg id="glyph"><path transform="scale(0.175,0.175) translate(-50,-125)" d="${portal.glyph}"></path></svg>`
    html += `<tr><td>${this.make_table(portal,lexicon,3,term)}</td></tr>`
    html += "</table>"
    return html
  }

  this.make_horaire = function(logs)
  {
    var horaire = new Horaire(logs);
    return horaire.sum > 30 ? `<mini class='horaire'>{{<b>${horaire.sum.toFixed(0)}</b>+|Horaire}} <b>${horaire.fh.toFixed(2)}</b>HDf <b>${horaire.ch.toFixed(2)}</b>HDc <t class='right'>{{:edit|https://github.com/XXIIVV/Oscean/edit/master/scripts/database/lexicon.tome}} {{:talk|https://github.com/XXIIVV/Oscean/issues}}</t><hr/></mini>`.to_markup() : `<mini class='horaire'><t class='right'>{{:edit|https://github.com/XXIIVV/Oscean/edit/master/scripts/database/lexicon.tome}} {{:talk|https://github.com/XXIIVV/Oscean/issues}}</t><hr/></mini>`.to_markup()
  }

  this.find_portal = function(term,lexicon)
  {
    if(!lexicon[term.unde().toUpperCase()]){ console.log("Parent is missing"); return "" }

    var portal = null
    var parent = lexicon[term.unde().toUpperCase()]
    if(term.type && term.type.toLowerCase() == "portal"){
      portal = term
    }
    else if(parent.is_portal){
      portal = parent
    }
    else{
      var parent_parent = lexicon[parent.unde().toUpperCase()]
      if(parent_parent.is_portal){
        portal = parent_parent
      }
      else{
        var parent_parent_parent = lexicon[parent_parent.unde().toUpperCase()]
        if(parent_parent_parent.is_portal){
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
  var scroll = window.scrollY;

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
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
      return log
    }
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
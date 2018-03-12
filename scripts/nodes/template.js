function TemplateNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.parser

  this.cache = null;

  this.receive = function(q)
  {
    var result = q.result;
    var type = result && result.type ? result.type.toLowerCase() : "page"
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
      if(!term.unde() || parent.toUpperCase() != term.unde().toUpperCase()){ continue; }
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
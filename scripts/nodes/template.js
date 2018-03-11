function TemplateNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.parser

  this.cache = null;

  this.receive = function(q)
  {
    var result = q.result;
    var type = result.type ? result.type.toLowerCase() : "[age"
    var assoc = this.signal(type);

    if(!assoc){
      console.warn(`Missing template: ${type}`)
      assoc = this.signal("page");
    }
    
    console.log(assoc)
    this.send(assoc.answer(q))
    this.label = `template:${assoc.id}`
  
    // Install Dom
    document.body.appendChild(this.signal("view").answer())
  }
}
function TemplateNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.parser

  this.cache = null;

  this.receive = function(q)
  {
    var result = q.result;
    var type = result.type.toLowerCase()
    var assoc = this.signal(type ? type : "page");

    if(!assoc){
      console.warn(`Missing template: ${type}`)
      assoc = this.signal("page");
    }
    
    this.send(assoc.answer(q))
    this.label = `template:${assoc.id}`
  
    // Install Dom
    document.body.appendChild(this.signal("view").answer())
  }
}
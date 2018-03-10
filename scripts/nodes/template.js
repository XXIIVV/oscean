function TemplateNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.parser

  this.cache = null;

  this.receive = function(q)
  {
    console.log(q)
    // var assoc = this.signal(q.type ? q.type.slice(0, -1) : "page");  
    // var payload = assoc.answer(q)

    // this.send(payload)
    // this.label = `template:${assoc.id}`
  
    // // Install Dom
    // document.body.appendChild(this.signal("view").answer())
  }
}
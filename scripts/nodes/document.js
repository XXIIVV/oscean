function DocumentNode(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.render
  
  this.receive = function(content)
  {
    document.title = content.title
    this.label = `document=${content.title}`
  }
}
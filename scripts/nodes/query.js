function QueryNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.entry
  this.label = "query"

  this.bang = function(target = window.location.hash.substring(1).replace(/[^0-9a-z]/gi," ").trim().toLowerCase())
  {
    target = target ? target : "home"
    this.label = `query:${target}`
    window.scrollTo(0,0);
    this.send(target)
  }
}
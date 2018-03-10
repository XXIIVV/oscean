function QueryNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.entry
  this.label = "query"

  this.bang = function(target = null)
  {
    var hash = window.location.hash.substring(1).replace(/[^0-9a-z]/gi," ").trim().toLowerCase()
    if(hash == ""){
      hash = "home";
    }
    this.label = `query:${hash}`
    window.scrollTo(0,0);
    this.send(target ? target : hash)
  }
}
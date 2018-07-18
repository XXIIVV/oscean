function DatabaseNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.database

  this.cache = null;

  this.receive = function(q)
  {
    this.cache = this.cache ? this.cache : this.request();
    this.send(this.request(this.cache))
  }
}
function LietalNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.router

  this.answer = function(q)
  {
    var db = this.request();

    console.log(db)
    return "hey"
  }
}
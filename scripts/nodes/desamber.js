function DesamberNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.value

  this.answer = function(q)
  {
    return new Date().desamber();
  }
}
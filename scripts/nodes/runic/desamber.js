function DesamberNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z M60,120 L60,120 L240,120 M120,120 L120,120 L120,240 M120,180 L120,180 L240,180 M180,180 L180,180 L180,240"

  this.answer = function(q)
  {
    return new Date().desamber();
  }
}
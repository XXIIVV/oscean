function EntaloneralieNode(id,rect,...params)
{
  DomNode.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z M60,120 L60,120 L240,120 M120,120 L120,120 L120,240 M120,180 L120,180 L240,180 M180,180 L180,180 L180,240"

  this.clock = new Entaloneralie()
  this.el.appendChild(this.clock.el);
  this.el.setAttribute("onclick",`Ø("query").bang("Time")`)

  this.update = function()
  {
    this.clock.update(25,25);
  }

  setInterval(()=>{ this.update() },8640/2)
}
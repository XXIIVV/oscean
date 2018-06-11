function BuildContentNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.builder

  this.cache = null;

  this.answer = function(q)
  {
    if(!q.result){
      return this.signal('missing').answer(q)
    }
    if(q.result.type == "unique"){
      return this.signal('unique').answer(q)
    }
    if(q.result.type){
      return q.result.type == "special" ? this.signal('special').answer(q) : this.signal('type').answer(q)
    }
    return this.request(q).default
  }
}
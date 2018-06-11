function IndentalNode(id,rect,type)
{
  Node.call(this,id,rect);

  this.type = type;
  this.glyph = NODE_GLYPHS.table

  this.answer = function(q)
  {
    if(!DATABASE[this.id]){
      console.warn(`Missing /database/${this.id}.js`)
      return null;
    }
    if(this.cache){
      return this.cache;
    }

    this.label = this.type ? `${this.id}=${this.type.name}` : `${this.id}`;
    this.cache = new Indental(DATABASE[this.id]).parse(this.type)
    return this.cache;
  }
}

var DATABASE = {};
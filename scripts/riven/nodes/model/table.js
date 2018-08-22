function TableNode(id,rect,parser,type)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.table

  this.cache = null;

  this.parser = parser;
  this.type = type;

  this.answer = function(q)
  {
    if(!DATABASE[this.id]){ console.warn(`Missing /database/${this.id}`); return null; }

    this.cache = this.cache ? this.cache : new this.parser(DATABASE[this.id]).parse(this.type);

    return this.cache;
  }
}
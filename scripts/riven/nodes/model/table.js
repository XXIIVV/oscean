'use strict';

function TableNode(id,rect,parser,type)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z M120,120 L120,120 L180,120 M120,180 L120,180 L180,180 M120,150 L120,150 L180,150"

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
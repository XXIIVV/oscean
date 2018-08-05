function DatabaseNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.database

  this.cache = null;

  this.answer = function(q)
  {
    if(!this.cache){
      this.cache = this.request(this.cache);
      this.send(this.cache); // Send to Ø(MAP), for filtering.
    }

    return this.cache;
  }
}

var DATABASE = {};
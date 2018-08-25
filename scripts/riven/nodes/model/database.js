function DatabaseNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.database

  this.cache = null;
  this.index = {};

  this.answer = function(q)
  {
    if(!this.cache){
      this.cache = this.request(this.cache);
      this.send(this.cache); // Send to Ø(MAP), for filtering.
      this.build();
    }
    return this.cache;
  }

  this.build = function()
  {
    var time = performance.now();
    for(var id in this.cache){
      var db = this.cache[id];
      for(var i in db){
        var el = db[i]
        if(!el.name){ continue; }
        if(!el.index){ continue; }
        this.index[el.name.toUpperCase().to_alpha()] = el
      }
    }
    console.info(this.id,`Indexed ${Object.keys(this.index).length} searchables, in ${(performance.now() - time).toFixed(2)}ms.`)
  }

  this.find = function(q)
  {
    return this.index[q.toUpperCase()];
  }
}

var DATABASE = {};
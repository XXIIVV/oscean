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
    let time = performance.now();
    for(let id in this.cache){
      let db = this.cache[id];
      for(let i in db){
        let el = db[i]
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

let DATABASE = {};
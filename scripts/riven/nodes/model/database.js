'use strict';

function DatabaseNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z M60,150 L60,150 L240,150 M60,105 L60,105 L240,105 M60,195 L60,195 L240,195 "

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
        if(el.index){ count.indexed += 1; }
        this.index[el.name.toUpperCase().to_alpha()] = el
        count.any += 1
      }
    }
    console.info(this.id,`Collected ${count.any} searchables, ${count.indexed} indexed, in ${(performance.now() - time).toFixed(2)}ms.`)
  }

  this.find = function(q,deep = false)
  {
    let r = this.index[q.toUpperCase()]
    return r && r.index ? r : r && deep ? r : null;
  }
}

let DATABASE = {};
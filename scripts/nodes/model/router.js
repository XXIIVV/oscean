function RouterNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.router

  this.archives = {}

  this.cache = {target:null,params:null,tables:null,result:null};

  this.receive = function(q)
  {
    this.cache.target = q.indexOf(":") > -1 ? q.split(":")[0].replace(/\+/g," ") : q.replace(/\+/g," ")
    this.cache.params = q.indexOf(":") > -1 ? q.split(":")[1] : null
    this.cache.tables = this.request("database").database;
    this.cache.result = find(this.cache.target.toUpperCase(),this.cache.tables)
    
    this.send(this.cache)
  }

  function find(key,db)
  {
    if(parseInt(key) > 0){ return null; }

    // Try first level
    for(var id in db){
      var table = db[id]
      if(table[key]){
        return table[key]
      }
    }

    // Try in glossary
    for(var id in db.glossary){
      var list = db.glossary[id]
      if(list.indexOf(key) > -1){
        return list;
      }
    }

    return null
  }
}
function RouterNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.router

  this.cache = null;

  this.receive = function(q)
  {
    var q = q.toUpperCase();
    var db = this.request("database").database;
    var type = find(q,db)

    this.cache = {
      name:q,
      type:type,
      result:db[type] ? db[type][q] : null,
      tables:db
    }
    this.label = `router:${type}/${q}`
    this.send(this.cache)
  }

  function find(key,db)
  {
    if(parseInt(key) > 0){ return null; }
    
    for(id in db){
      var table = db[id]
      if(table[key]){
        return id
      }
    }
    return null
  }
}
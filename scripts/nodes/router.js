function RouterNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.router

  this.receive = function(q)
  {
    var q = q.toUpperCase();
    var db = this.request("database").database;

    var type = find(q,db)

    this.label = `router:${type}/${q}`
    this.send({
      name:q,
      type:type,
      result:db[type] ? db[type][q] : null,
      tables:db
    })
  }

  function find(key,db)
  {
    for(id in db){
      var table = db[id]
      if(table[key]){
        return id
      }
    }
    return null
  }
}
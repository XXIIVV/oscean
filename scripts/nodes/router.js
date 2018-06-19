function RouterNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.router

  this.receive = function(q)
  {
    var target = q.indexOf(":") > -1 ? q.split(":")[0].replace(/\+/g," ") : q.replace(/\+/g," ")
    var params = q.indexOf(":") > -1 ? q.split(":")[1] : null
    var db = this.request("database").database;
    var data = find(target.toUpperCase(),db)

    this.label = `${this.id}|${target}|${params}`

    console.log(this.id,`${data ? data.type : '?'}->${target}[${params}]`);

    this.send({
      name:target,
      type:data ? data.type : null,
      result:data ? data.result : null,
      params:params,
      tables:db
    })
  }

  function find(key,db)
  {
    if(parseInt(key) > 0){ return null; }
    
    for(id in db){
      var table = db[id]
      if(table[key]){
        return {type:id,result:table[key]}
      }
    }
    return {type:null,result:null}
  }
}
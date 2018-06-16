function RouterNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.router

  this.receive = function(q)
  {
    var target = q.indexOf(":") > -1 ? q.split(":")[0] : q.replace(/\+/g," ")
    var params = q.indexOf(":") > -1 ? q.split(":")[1] : null
    var db = this.request("database").database;
    var data = find(target.toUpperCase(),db)

    this.label = `${this.id}|${target}|${params}`

    console.log(this.id,`${data.type}->${target}[${params}]`);

    this.send({
      name:target,
      type:data.type,
      result:data.result,
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
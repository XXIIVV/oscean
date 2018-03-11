function OperationNode(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.entry
  
  this.request = function(q)
  {
    var operator = q.split(" ")[0].replace("$","").trim();
    var params = q.replace("$"+operator,"").trim()

    console.log(this,operator,params,this.signal(operator))

    params = params != operator ? params : null
    return this.signal(operator) ? this.signal(operator).answer(params) : `Unknown operator:(${operator})`
  }
}
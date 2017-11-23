function Lexicon(memory)
{
  this.memory = memory;

  this.find = function(key = "Home")
  {
    key = !key ? "Home" : key
    return new Term(key,this.memory.find(key));
  }

  this.find_any = function(key,value)
  {
    var results = this.memory.find_any(key,value)
    var a = [];
    for(id in results){
      var entry = new Term(id,results[id]);
      a.push(entry)
    }
    return a;
  }
}

invoke.vessel.seal("corpse","lexicon");
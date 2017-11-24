function Lexicon(memory)
{
  this.memory = memory;
  this.terms = {};

  this.start = function()
  {
    // Create terms
    for(name in this.memory.hash){
      var entry = new Term(name,this.memory.hash[name]);
      this.terms[name.toLowerCase()] = entry;
    }
    console.log("Added "+Object.keys(this.terms).length+" terms.")
    
    for(name in this.terms){
      var term = this.terms[name];
      var parent = term.memory.unde ? this.terms[term.memory.unde.toLowerCase()] : null;
      // Connect parents/children
      if(parent){
        term.parent = this.terms[term.memory.unde.toLowerCase()];
        parent.children.push(term);
      }
      else{
        console.warn("Missing parent:("+term.memory.unde+" for "+term.name+")")
      }
    }
  }
  
  this.find = function(key = "Home")
  {
    key = !key ? "Home" : key
    return this.terms[key.toLowerCase()]
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
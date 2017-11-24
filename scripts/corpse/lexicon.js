function Lexicon(memory)
{
  this.memory = memory;
  this.terms = {};

  this.start = function()
  {
    this.add_terms();
    this.connect_terms();
  }

  this.add_terms = function()
  {
    for(name in this.memory.hash){
      var entry = new Term(name,this.memory.hash[name]);
      this.terms[name.toLowerCase()] = entry;
    }
    console.info("Added "+Object.keys(this.terms).length+" terms.")
  }

  this.connect_terms = function()
  {
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

  this.inject_log = function(log)
  {
    if(!log.term){ return; }
    if(!this.terms[log.term.toLowerCase()]){ console.warn("Missing term",log.term); return; }
    this.terms[log.term.toLowerCase()].logs.push(log)
  }
  
  this.find = function(key = "Home")
  {
    key = !key ? "Home" : key;
    return this.terms[key.toLowerCase()] ? this.terms[key.toLowerCase()] : new MissingTerm(key);
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
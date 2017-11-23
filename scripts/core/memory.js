function Memory(raw)
{
  this.raw = raw;
  this.hash = {};

  this.parse = function(raw = this.raw)
  {
    var prev_key = null;
    var prev_attr = null;
    var lines = raw.split("\n");
    for(id in lines){

      var indent = lines[id].search(/\S|$/) ; 
      var line = lines[id].trim(); 
      var line_lc = line.toLowerCase();
      if(line == ""){ continue; }

      if(indent == 0){
        this.hash[line_lc] = {}
        prev_key = line_lc;
      }
      else if(indent == 2){
        if(line.indexOf(" : ") > -1){
          var parts = line.split(" : ")
          this.hash[prev_key][parts[0].toLowerCase()] = parts[1];
        }
        else if(prev_key && this.hash[prev_key]){
          this.hash[prev_key][line_lc] = []
          prev_attr = line_lc;  
        }
      }
      else if(indent == 4){
        if(line.indexOf(" : ") > -1){
          var parts = line.split(" : ")
          this.hash[prev_key][prev_attr][parts[0].toLowerCase()] = parts[1];
        }
        else if(prev_key && prev_attr && this.hash[prev_key][prev_attr]){
          this.hash[prev_key][prev_attr].push(line)
        }
      }
      else{
        console.warn("Indent:"+indent, line)
      }
    }
  }

  this.find = function(key)
  {
    return this.hash[key.toLowerCase()]
  }

  this.find_any = function(key,value)
  {
    var h = {};
    for(name in this.hash){
      var entry = this.hash[name];
      if(!entry[key] || entry[key].toLowerCase() != value.toLowerCase()){ continue; }
      h[name] = entry
    }
    return h;
  }

  this.parse(this.raw);
}

invoke.seal("core","memory");
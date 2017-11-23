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
      var indent = lines[id].search(/\S|$/)
      var line = lines[id].trim();  
      if(line == ""){ continue; }
      if(indent == 0){
        this.hash[line] = {}
        prev_key = line;
      }
      if(indent == 2){
        if(line.indexOf(" : ") > -1){
          var parts = line.split(" : ")
          this.hash[prev_key][parts[0]] = parts[1];
        }
        else if(prev_key && this.hash[prev_key]){
          this.hash[prev_key][line] = []
          prev_attr = line;  
        }
      }
      if(indent == 4){
        if(line.indexOf(" : ") > -1){
          var parts = line.split(" : ")
          this.hash[prev_key][prev_attr][parts[0]] = parts[1];
        }
        else if(prev_key && prev_attr && this.hash[prev_key][prev_attr]){
          this.hash[prev_key][prev_attr].push(line)
        }
      }
    }
  }

  this.parse(this.raw);
}

invoke.seal("core","memory");
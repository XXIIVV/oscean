function List(raw)
{
  this.raw = raw;
  this.key = null
  this.array = [];

  this.parse = function(raw = this.raw)
  {
    var lines = raw.trim().split("\n");
    this.key = this.parse_key(lines[0]);
    lines = lines.slice(1);
    
    for(id in lines){
      var entry = {};
      for(i in this.key){
        var k = this.key[i];
        entry[i] = lines[id].substr(k.from,k.to).trim();
      }
      this.array.push(entry);
    }
  }

  this.parse_key = function(raw)
  {
    var parts = raw.split(" ")
    var distance = 0;
    var keys = {};
    var prev = null
    for(id in parts){
      var part = parts[id].toLowerCase();
      if(part != ""){
        keys[part] = {from:distance,to:0};
        if(keys[prev]){ keys[prev].to = distance - keys[prev].from - 1; }
        prev = part;
      }
      distance += part == "" ? 1 : part.length+1;
    }
    return keys;
  }

  this.find = function(key,value)
  {
    var a = [];
    for(id in this.array){
      var entry = this.array[id];
      if(entry[key].toLowerCase() == value.toLowerCase() || value == "*"){
        a.push(entry);
      }
    }
    return a;
  }

  this.parse(this.raw);
}

invoke.seal("core","list");
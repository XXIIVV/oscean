function Tablatal(data)
{
  this.data = data;

  this.parse = function(type)
  {
    var a = [];
    var lines = this.data.trim().split("\n")
    var key = make_key(lines[0]);
    for(id in lines){
      if(id == 0 || lines[id].trim() == ""){ continue; }
      var entry = {};
      for(i in key){
        entry[i] = lines[id].substr(key[i].from,key[i].to).trim();
      }
      a.push(type ? new type(entry) : entry);
    }
    return a
  }

  function make_key(raw)
  {
    var parts = raw.split(" ")
    var distance = 0;
    var key = {};
    var prev = null
    for(id in parts){
      var part = parts[id].toLowerCase();
      if(part != ""){
        key[part] = {from:distance,to:0};
        if(key[prev]){ key[prev].to = distance - key[prev].from - 1; }
        prev = part;
      }
      distance += part == "" ? 1 : part.length+1;
    }
    return key;
  }
}
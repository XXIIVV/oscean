function Tablatal(data)
{
  this.data = data;

  this.parse = function(type)
  {
    let a = [];
    let lines = this.data.trim().split("\n")
    let key = make_key(lines[0]);
    for(let id in lines){
      if(id == 0 || lines[id].trim() == ""){ continue; }
      let entry = {};
      for(let i in key){
        entry[i] = lines[id].substr(key[i].from,key[i].to).trim();
      }
      a[a.length] = type ? new type(entry) : entry;
    }
    return a
  }

  function make_key(raw)
  {
    let parts = raw.split(" ")
    let distance = 0;
    let key = {};
    let prev = null
    for(let id in parts){
      let part = parts[id].toLowerCase();
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
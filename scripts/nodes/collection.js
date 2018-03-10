function CollectionNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.database

  this.answer = function(q)
  {
    if(!DATABASE[this.id]){
      console.warn(`Missing /database/${this.id}.js`)
      return null;
    }
    if(this.cache){
      return this.cache;
    }
    this.cache = parse(DATABASE[this.id])
    return this.cache;
  }

  function parse(data)
  {
    var a = [];
    var lines = data.trim().split("\n")
    var key = make_key(lines[0]);
    for(id in lines){
      var entry = {};
      for(i in key){
        entry[i] = lines[id].substr(key[i].from,key[i].to).trim();
      }
      a.push(entry);
    }
    console.log("list","parsed "+a.length+" entries")
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

var DATABASE = {};
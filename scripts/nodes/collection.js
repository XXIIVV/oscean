function CollectionNode(id,rect,type)
{
  Node.call(this,id,rect);

  this.type = type;
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

    this.label = this.type ? `${this.id}=${this.type.name}` : this.id;
    this.cache = parse(DATABASE[this.id],this.type)
    return this.cache;
  }

  function parse(data,type)
  {
    var a = [];
    var lines = data.trim().split("\n")
    var key = make_key(lines[0]);
    for(id in lines){
      if(id == 0){ continue; }
      var entry = {};
      for(i in key){
        entry[i] = lines[id].substr(key[i].from,key[i].to).trim();
      }
      a.push(type ? new type(entry) : entry);
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
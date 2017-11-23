function Term(name,memory)
{
  this.name = name;
  this.memory = memory;
  this.diaries = [];
  this.diary = null;
  this.children = [];

  this.start = function()
  {
    this.logs = invoke.vessel.horaire.find("term",this.name.toLowerCase() == "home" ? "*" : this.name);
    this.diaries = this.find_diaries();
    this.children = this.memory ? invoke.vessel.lexicon.find_any("unde",this.name) : [];

    this.parent = this.memory ? invoke.vessel.lexicon.find(this.memory.unde) : null; 
    this.bref = this.memory && this.memory.bref ? new Runic().markup(this.memory.bref) : "Missing";
    this.long = this.memory && this.memory.long ? new Runic(this.memory.long).html : "Missing";
  }

  this.find_diaries = function()
  {
    var a = [];
    for(id in this.logs){
      var log = this.logs[id];
      if(log.photo){
        a.push(log);
      }
    }
    return a;
  }

  this.view = function()
  {
    return "Hello"
  }

  this.sidebar = function()
  {
    var html = "";


    if(this.parent && this.parent.name != this.name){
      this.parent.start();
      html += "<ln><a class='parent' href='"+this.parent.name+"'>"+this.parent.name.capitalize()+"</a></ln>"
      for(id in this.parent.children){
        var term = this.parent.children[id]
        html += "<ln><a class='sibling "+(term.name.toLowerCase() == this.name.toLowerCase() ? 'active' : '')+"' href='"+term.name+"'>"+term.name.capitalize()+"</a></ln>"
        if(term.name.toLowerCase() == this.name.toLowerCase()){
          for(id in this.children){
            var term = this.children[id];
            html += "<ln><a href='"+term.name+"'>"+term.name.capitalize()+"</a></ln>"
          }
        }
      }
    }
    return "<list>"+html+"</list>";
  }

  this.location = function()
  {
    if(this.parent){
      if(this.parent.name != this.name){
        return (this.parent.name+"/")+this.name;
      }
    }
    return this.name
  }

  this.theme = function()
  {
    if(this.diaries.length < 1){ return "no"; }    
    return "si";
  }

  this.photo = function()
  {
    if(this.diaries.length < 1){ return ""; }
    return "url(media/diary/"+this.diaries[0].photo+".jpg)";
  }
}

invoke.vessel.seal("corpse","term");
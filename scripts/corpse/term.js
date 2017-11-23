function Term(name,memory)
{
  this.name = name;
  this.memory = memory;
  this.type = memory.type;
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

  // Elements

  this.view = function()
  {
    if(!this.type){ return ""; }
    if(this["_"+this.type.toLowerCase()]){
      return this["_"+this.type.toLowerCase()]();
    }
    console.warn("Missing view:",this.type)
    return "";
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
            html += "<ln><a class='children' href='"+term.name+"'>"+term.name.capitalize()+"</a></ln>"
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

  this.preview = function()
  {
    var html = "";

    html += "<a href='"+this.name+"'><photo style='background-image:"+this.photo()+"'></photo></a>"
    html += "<p>"+this.bref+"</p>";
    return "<yu class='term'>"+html+"</yu>";
  }

  // Views

  this._portal = function()
  {
    var html = ""
    for(id in this.children){
      var term = this.children[id];
      term.start();
      html += term.preview();
    }
    return html;
  }
}

invoke.vessel.seal("corpse","term");
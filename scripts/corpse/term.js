function Term(name,memory)
{
  this.name = name;
  this.diaries = [];
  this.children = [];
  this.parent = null;
  this.logs = [];

  if(memory){
    this.memory = memory;
    this.type = memory.type;
    this.bref = this.memory.bref ? new Runic().markup(this.memory.bref) : "Missing";
    this.long = this.memory.long ? new Runic(this.memory.long).html() : "";
    this.links = this.memory.link ? this.memory.link : [];
    this.flag = this.memory.flag ? this.memory.flag : [];
  }
  
  this.start = function()
  {
    this.diaries = this.find_diaries();
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

  this.activity = function()
  {
    if(this.logs.length < 2){ return ""; }

    var html = "";
    var from = this.logs[this.logs.length-1];
    var to = this.logs[0];

    html += from.time.toString() != to.time.toString() ? `${from.time.toString()}—${to.time.toString()}` : to.time.toString();

    return `<yu class='activity'>${html}</yu>`;
  }

  this.outgoing = function()
  {
    if(!this.links || this.links.length < 1){ return ""; }
    var html = ""
    for(id in this.links){
      var link = this.links[id]
      html += "<ln><a href='"+link+"'>"+this.format_link(link)+"</a></ln>"
    }
    return `<list class='outgoing'>${html}</list>`;
  }

  this.navi = function()
  {
    var html = "";
    if(this.parent && this.parent.name != this.name){
      this.parent.start();
      html += "<ln class='parent'><a href='"+this.parent.name+"'>"+this.parent.name.capitalize()+"</a></ln>"
      for(id in this.parent.children){
        var term = this.parent.children[id]
        html += "<ln class='sibling "+(term.name.toLowerCase() == this.name.toLowerCase() ? 'active' : '')+"'>"+term.bref+"</ln>"
        if(term.name.toLowerCase() == this.name.toLowerCase()){
          for(id in this.children){
            var term = this.children[id];
            html += "<ln class='children'>"+term.bref+"</ln>"
          }
        }
      }
    }
    return `<list class='navi'>${html}</list>`;
  }

  this.h2 = function()
  {
    var html = "";

    html += this.activity();
    html += `<a href='${this.parent.name}'>${this.parent.name}</a>`;
    html += this.outgoing();

    return html;
  }

  this.h3 = function()
  {
    return this.navi();
  }

  this.theme = function()
  {
    if(this.diaries.length < 1 || this.flag.indexOf("no_photo") > -1){ return "no_photo"; }    
    return this.diary().theme;
  }

  this.diary = function()
  {
    if(this.diaries.length < 1){ return null; }
    
    for(id in this.diaries){
      if(this.diaries[id].is_featured){ return this.diaries[id]; }
    }
    return this.diaries[0];
  }

  this.photo = function()
  {
    if(this.diaries.length < 1){ return ""; }

    return "url(media/diary/"+this.diary().photo+".jpg)";
  }

  this.photo_info = function()
  {
    if(this.diaries.length < 1){ return ""; }

    var log = this.diary();

    return `<b>${log.name}</b> — <a href='Desamber' class='local'>${log.time}</a>`
  }

  this.preview = function()
  {
    var html = "";

    html += this.photo() ? "<a href='"+this.name+"' style='background-image:"+this.photo()+"' class='photo'></a>" : ""
    html += "<p>"+this.bref+"</p>";
    return "<yu class='term'>"+html+"</yu>";
  }

  this.format_link = function(path)
  {
    if(path.indexOf("itch.io") > -1){ return "Itch.io"}
    if(path.indexOf("github") > -1){ return "Github"}
    if(path.indexOf("itunes") > -1){ return "iTunes"}
    if(path.indexOf("youtu") > -1){ return "Youtube"}
    if(path.indexOf("bandcamp") > -1){ return "Bandcamp"}
    if(path.indexOf("drive.google") > -1){ return "Google Drive"}

    return "Website"
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

  this._docs = function()
  {
    var content = invoke.vessel.storage[this.name];
    if(!content){ return "Missing:"+this.name; }
    return content.html();
  }

  this._special = function()
  {
    var content = invoke.vessel.storage[this.name];
    if(!content){ return "Missing:"+this.name; }
    return content.html();
  }

  this._diary = function()
  {
    var html = "";

    for(id in this.diaries){
      var diary = this.diaries[id];
      html += "<img src='media/diary/"+diary.photo+".jpg'/>"
    }
    return html;
  }

  this._calendar = function()
  {
    var content = invoke.vessel.storage.calendar;
    if(!content){ return "Missing:"+this.name; }
    return content.html();
  }
}

function MissingTerm(name)
{
  Term.call(this,name)

  this.bref = "Sorry! There are no pages found for "+this.name+" in this Lexicon."
  this.long = "<p>If you think that this is an error, contact <a href='https://twitter.com/neauoire'>@aliceffekt</a>.</p>";
}

invoke.vessel.seal("corpse","term");

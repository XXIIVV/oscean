function Term(name,memory)
{
  this.name = name;
  this.diaries = [];
  this.diary = null;
  this.children = [];
  this.parent = null;
  this.logs = [];

  if(memory){
    this.memory = memory;
    this.type = memory.type;
    this.bref = this.memory.bref ? new Runic().markup(this.memory.bref) : "Missing";
    this.long = this.memory.long ? new Runic(this.memory.long).html : "";
    this.links = this.memory.link ? this.memory.link : [];
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

  this.sidebar = function()
  {
    var html = "";

    if(this.links){
      var link_html = ""
      for(id in this.links){
        var link = this.links[id]
        link_html += "<ln><a href='"+link+"'>"+this.format_link(link)+"</a></ln>"
      }
      html += "<list>"+link_html+"</list>"
    }

    if(this.parent && this.parent.name != this.name){
      var tree_html = ""
      this.parent.start();
      tree_html += "<ln><a class='parent' href='"+this.parent.name+"'>"+this.parent.name.capitalize()+"</a></ln>"
      for(id in this.parent.children){
        var term = this.parent.children[id]
        tree_html += "<ln><a class='sibling "+(term.name.toLowerCase() == this.name.toLowerCase() ? 'active' : '')+"' href='"+term.name+"'>"+term.name.capitalize()+"</a></ln>"
        if(term.name.toLowerCase() == this.name.toLowerCase()){
          for(id in this.children){
            var term = this.children[id];
            tree_html += "<ln><a class='children' href='"+term.name+"'>"+term.name.capitalize()+"</a></ln>"
          }
        }
      }
      html += "<list>"+tree_html+"</list>"
    }
    return html;
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

    html += "<a href='"+this.name+"' style='background-image:"+this.photo()+"' class='photo'></a>"
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
    return content.html;
  }

  this._archive = function()
  {
    var html = "";
    for(id in this.children){
      var c1 = this.children[id];
      html += "<h2>{{"+c1.name+"}}</h2>"
      html += "<p>"+c1.bref+"</p>"
      if(c1.children.length < 1){ continue; }
      html += "<list>"
      for(i in c1.children){
        var c2 = c1.children[i];
        html += "<ln>"+c2.bref+"</ln>"
      }
      html += "</list>"
    }
    return new Runic().markup(html)
  }
}

function MissingTerm(name)
{
  Term.call(this,name)

  this.bref = "Sorry! There are no pages found for "+this.name+" in this Lexicon."
  this.long = "<p>If you think that this is an error, contact <a href='https://twitter.com/neauoire'>@aliceffekt</a>.</p>";
}

invoke.vessel.seal("corpse","term");

function Runic(raw)
{
  this.raw = raw;

  this.runes = {
    "&":{tag:"p"},
    "-":{tag:"list",sub:"ln",stash:true},
    "#":{tag:"code",sub:"ln",stash:true},
    "?":{tag:"note"},
    ":":{tag:"info"},
    "*":{tag:"h2"},
    "=":{tag:"h3"},
    "+":{tag:"hs"},
    "|":{tag:"tr",sub:"td",rep:true},
    "»":{tag:"tr",sub:"th",rep:true},
    ">":{tag:""}
  }    

  this.markup = function(html)
  {
    html = html.replace(/{_/g,"<i>").replace(/_}/g,"</i>")
    html = html.replace(/{\*/g,"<b>").replace(/\*}/g,"</b>")

    var parts = html.split("{{")
    for(id in parts){
      var part = parts[id].split("}}")[0];
      var target = part.indexOf("|") > -1 ? part.split("|")[1] : "/"+part;
      var name = part.indexOf("|") > -1 ? part.split("|")[0] : part;
      html = html.replace("{{"+part+"}}","<a href='"+target+"'>"+name+"</a>")
    }

    return html;
  }

  this.parse = function(raw = this.raw)
  {
    if(!raw){ return ""; }

    var html = "";
    var lines = raw;
    var lines = !Array.isArray(raw) ? raw.split("\n") : raw;

    for(id in lines){
      var rune = this.runes[lines[id].substr(0,1)];
      var trail = lines[id].substr(1,1);
      var line = this.markup(lines[id].substr(2));
      if(!line || line.trim() == ""){ continue; }
      if(!rune){ return "Unknown rune:("+rune+")"; }
      if(trail != " "){ console.warn("Runic","Non-rune["+trail+"] at:"+id+"("+line+")"); continue; }
      html += this.render(line,rune);
    }
    html += this.render();
    return html;
  }

  // Render

  this.stash = [];
  this.prev = null;

  this.render = function(line = "",rune = null)
  {
    // Append to Stash
    if(this.stash.length > 0){
      if(rune && this.stash[0].rune.tag == rune.tag){
        this.stash.push({line:line,rune:rune});return "";
      }
      else{
        var print = this.pop_stash(); this.stash = []; return print;
      }
    }
    // New Stash
    if(rune && rune.stash && this.stash.length == 0){
      this.stash.push({line:line,rune:rune}); return "";
    }
    // Default
    return rune ? "<"+rune.tag+">"+line+"</"+rune.tag+">" : "";
  }

  this.pop_stash = function(stash = this.stash)
  {
    var html = ""
    for(id in stash){
      html += "<"+stash[0].rune.sub+">"+stash[id].line+"</"+stash[0].rune.sub+">\n";
    }
    return "<"+stash[0].rune.tag+">"+html+"</"+stash[0].rune.tag+">";
  }

  this.html = this.parse(raw);
}

invoke.seal("core","runic");
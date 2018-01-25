function Runic(raw)
{
  this.raw = raw;

  this.runes = {
    "&":{tag:"p",class:""},
    "~":{tag:"list",sub:"ln",class:"parent",stash:true},
    "-":{tag:"list",sub:"ln",class:"",stash:true},
    "#":{tag:"code",sub:"ln",class:"",stash:true},
    "?":{tag:"note",class:""},
    ":":{tag:"info",class:""},
    "*":{tag:"h2",class:""},
    "=":{tag:"h3",class:""},
    "+":{tag:"hs",class:""},
    "|":{tag:"tr",sub:"td",class:"",stash:true},
    ">":{tag:"",class:""}
  }    

  this.markup = function(html)
  {
    html = html.replace(/{_/g,"<i>").replace(/_}/g,"</i>")
    html = html.replace(/{\*/g,"<b>").replace(/\*}/g,"</b>")
    html = html.replace(/{\#/g,"<code class='inline'>").replace(/\#}/g,"</code>")

    var parts = html.split("{{")
    for(id in parts){
      var part = parts[id].split("}}")[0];
      var target = part.indexOf("|") > -1 ? part.split("|")[1] : "/"+part;
      var name = part.indexOf("|") > -1 ? part.split("|")[0] : part;
      var external = (target.indexOf("https:") > -1 || target.indexOf("http:") > -1 || target.indexOf("dat:") > -1)
      html = html.replace(`{{${part}}}`,`<a target='${external ? "_blank" : "_self"}'href='${external ? target : target.to_url()}' class='${external ? "external" : "local"}'>${name}</a>`)
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
      var char = lines[id].substr(0,1).trim().toString()
      var rune = this.runes[char];
      var trail = lines[id].substr(1,1);
      var line = this.markup(lines[id].substr(2));
      if(!line || line.trim() == ""){ continue; }
      if(!rune){ console.log("Unknown rune:"+char,lines[id]); }
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
      if(rune && this.stash[0].rune.tag == rune.tag && rune.stash){
        this.stash.push({line:line,rune:rune}); return "";
      }
      else{
        var print = this.pop_stash(); this.stash = []; return print+(rune ? "<"+rune.tag+" class='"+rune.class+"'>"+line+"</"+rune.tag+">" : "");
      }
    }
    // New Stash
    if(rune && rune.stash && this.stash.length == 0){
      this.stash.push({line:line,rune:rune}); return "";
    }
    // Default
    return rune ? (rune.tag ? "<"+rune.tag+" class='"+rune.class+"'>"+line+"</"+rune.tag+">" : line) : "";
  }

  this.pop_stash = function(stash = this.stash)
  {
    var html = ""
    for(id in stash){
      html += "<"+stash[0].rune.sub+" class='"+stash[id].rune.class+"'>"+stash[id].line+"</"+stash[0].rune.sub+">\n";
    }
    return "<"+stash[0].rune.tag+" class='"+stash[0].rune.class+"'>"+html+"</"+stash[0].rune.tag+">";
  }

  this.html = function()
  {
    return this.parse(raw);
  }

  this.toString = function()
  {
    return this.html();
  }
}

invoke.seal("core","runic");

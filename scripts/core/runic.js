function Runic(raw)
{
  this.raw = raw;

  this.runes = {
    "&":{tag:"p",class:""},
    "~":{tag:"list",sub:"ln",class:"parent",stash:true},
    "-":{tag:"list",sub:"ln",class:"",stash:true},
    "#":{tag:"code",sub:"ln",class:"",stash:true},
    "%":{tag:"img"},
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
      var part = parts[id];
      if(part.indexOf("}}") == -1){ continue; }
      var content = part.split("}}")[0];
      if(content.substr(0,1) == "$"){ html = html.replace(`{{${content}}}`, this.operation(content)); continue; }
      var target = content.indexOf("|") > -1 ? content.split("|")[1] : content;
      var name = content.indexOf("|") > -1 ? content.split("|")[0] : content;
      var external = (target.indexOf("https:") > -1 || target.indexOf("http:") > -1 || target.indexOf("dat:") > -1);
      var redlink = !external && !invoke.vessel.lexicon.has_term(target); if(redlink){ console.warn("broken link",target,html); }
      html = html.replace(`{{${content}}}`,`<a target='${external ? "_blank" : "_self"}' href='${external ? target : target.to_url()}' class='${external ? "external" : "local"} ${redlink ? "redlink" : ""}'>${name}</a>`)
    }

    return html;
  }

  this.operation = function(val)
  {
    val = val.replace("$","").trim();

    if(val == "desamber"){
      return new Date().desamber();
    }
    if(val == "clock"){
      return new Date().clock();
    }
    if(val.split(" ")[0] == "lietal"){
      return invoke.vessel.lietal.construction(val.replace("lietal","").trim());
    }
    return `((${val}))`
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
      if(!rune){ console.log(`Unknown rune:${char} : ${line}`); }
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
    // Special
    if(rune && rune.tag == "img"){ return `<img src='media/${line}'/>`; }

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

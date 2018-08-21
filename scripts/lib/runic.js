function Runic(raw,tables)
{
  this.tables = tables;
  this.raw = raw;

  this.runes = {
    // Basics
    "&":{tag:"p",class:""},
    "-":{tag:"list",sub:"ln",class:"",stash:true},
    "=":{tag:"list",sub:"ln",class:"mini",stash:true},
    "!":{tag:"table",sub:"tr",wrap:"th",class:"outline",stash:true},
    "|":{tag:"table",sub:"tr",wrap:"td",class:"outline",stash:true},
    "#":{tag:"code",sub:"ln",class:"",stash:true},
    "*":{tag:"h2",class:""},
    "+":{tag:"hs",class:""},
    ">":{tag:"",class:""},
    // Complex
    "$":{tag:"",class:""},
    "%":{},
    "@":{tag:"quote",class:""},
    ":":{tag:"info",class:""},
    "?":{tag:"note",class:""},
  }

  this.stash = {
    rune : "",
    all : [],
    add : function(rune,item){
      this.rune = this.copy(rune)
      this.all.push({rune:rune,item:item});
    },
    pop : function(){
      var copy = this.copy(this.all);
      this.all = [];
      return copy;
    },
    is_pop : function(rune){
      return this.all.length > 0 && rune.tag != this.rune.tag;
    },
    length: function()
    {
      return this.all.length;
    },
    copy : function(data){ 
      return JSON.parse(JSON.stringify(data)); 
    }
  }

  this.parse = function(raw = this.raw)
  {
    if(!raw){ return ""; }

    var html = "";
    var lines = raw;
    var lines = !Array.isArray(raw) ? raw.toString().split("\n") : raw;

    for(id in lines){
      var char = lines[id].substr(0,1).trim().toString()
      var rune = this.runes[char];
      var trail = lines[id].substr(1,1);
      var line = lines[id].substr(2).to_markup();

      if(!line || line.trim() == ""){ continue; }
      if(!rune){ console.log(`Unknown rune:${char} : ${line}`); continue; }
      if(trail != " "){ console.warn("Runic",`Non-rune[${trail}] at:${id}(${line})`); continue; }

      if(this.stash.is_pop(rune)){ html += this.render_stash(); }

      // Complex
      if(char == "$"){ html += `<p>${Ø("operation").request(line).to_markup()}</p>`; continue; }
      if(char == "%"){ html += this.media(line); continue; }
      if(char == "@"){ html += this.quote(line); continue; }
      if(char == ":"){ html += this.info(line); continue; }

      if(rune.stash === true){ this.stash.add(rune,line) ; continue; }
      html += this.render(line,rune);
    }
    if(this.stash.length() > 0){ html += this.render_stash(); }
    return html;
  }

  this.render_stash = function()
  {
    var rune = this.stash.rune;
    var stash = this.stash.pop();

    var html = "";
    for(id in stash){
      var rune = stash[id].rune;
      var line = stash[id].item;
      html += rune.wrap ? `<${rune.sub}><${rune.wrap}>${line.replace(/\|/g,`</${rune.wrap}><${rune.wrap}>`).trim()}</${rune.wrap}></${rune.sub}>` : `<${rune.sub}>${line}</${rune.sub}>`;  
    }
    return `<${rune.tag} class='${rune.class}'>${html}</${rune.tag}>`
  }

  this.render = function(line = "",rune = null)
  {
    if(rune && rune.tag == "img"){ return `<img src='media/${line}'/>`; }
    if(rune && rune.tag == "table"){ return "HEY"; }

    return rune ? (rune.tag ? `<${rune.tag} class='${rune.class}'>${line}</${rune.tag}>` : line) : "";
  }

  this.media = function(val)
  {
    var service = val.split(" ")[0];
    var id = val.split(" ")[1];

    if(service == "itchio"){ return `<iframe frameborder="0" src="https://itch.io/embed/${id}?link_color=000000" width="600" height="167"></iframe>`; }
    if(service == "bandcamp"){ return `<iframe style="border: 0; width: 600px; height: 274px;" src="https://bandcamp.com/EmbeddedPlayer/album=${id}/size=large/bgcol=ffffff/linkcol=333333/artwork=small/transparent=true/" seamless></iframe>`; }
    if(service == "youtube"){ return `<iframe width="100%" height="380" src="https://www.youtube.com/embed/${id}?rel=0" style="max-width:700px" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`; }
    if(service == "custom"){ return `<iframe src='${id}' style='width:100%;height:350px;'></iframe>`; }
    return `<img src='media/${service}' class='${id}'/>`
  }

  this.quote = function(content)
  {
    var parts = content.split(" | ")
    var text = parts[0].trim()
    var author = parts[1]
    var source = parts[2]
    var link = parts[3]

    return `
    <quote>
      ${text.length > 1 ? '<p class=\'text\'>'+text.to_markup()+'</p>' : ''}
      ${author ? `<p class='attrib'>${author}${source && link ? `, {{${source}|${link}}}`.to_markup() : source ? `, <b>${source}</b>` : ''}</p>` : ''}
    </quote>`
  }

  this.info = function(content)
  {
    var key = content.split("|")[0].trim()
    var term = this.tables.lexicon[key.toUpperCase()]
    var log = term.logs[0]
      
    return log ? `<info><svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" baseProfile="full" version="1.1"><g transform='scale(0.1)'><path d='${term.glyph()}'/></g></svg><t class='key'>{{${key.capitalize()}}}</t><t class='val'>${log.name ? log.name : log.task.capitalize()}</t><t class='offset'>${log.time.ago()}, <b>${log.time}</b></t></info>`.to_markup() : ''
  }

  this.toString = function()
  {
    return this.parse();
  }
}

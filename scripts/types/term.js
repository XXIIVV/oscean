function Term(name,dict)
{
  this.name = name;
  this.diaries = [];
  this.children = [];
  this.parent = null;
  this.logs = [];

  if(dict){
    this.dict = dict;
    this.type = dict.TYPE;
    this.links = this.dict.LINK ? this.dict.LINK : [];
    this.flag = this.dict.FLAG ? this.dict.FLAG : [];
  }
  
  this.start = function()
  {
    if(dict){
      this.bref = this.dict.BREF ? this.dict.BREF.to_markup() : "Missing";
    }
    this.diaries = this.find_diaries();
  }

  this.bref = function()
  {
    return this.dict && this.dict.BREF ? this.dict.BREF.to_markup() : ''
  }

  this.long = function()
  {
    return new Runic(this.dict.LONG).html()
  }

  this.unde = function()
  {
    return this.dict.UNDE
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

    html += from.time.toString() != to.time.toString() ? `${from.time.toString()}—<a href='/${to.time.year}'>${to.time.toString()}</a>` : `<a href='/${to.time.year}'>${to.time.toString()}</a>`;

    return `<yu class='activity'>${html}</yu>`;
  }

  this.navi = function()
  {
    var html = "";
    if(this.parent && this.parent.name != this.name){
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
    html += this.parent ? `<a href='${this.parent.name.to_url()}'>${this.parent.name}</a>` : "";
    html += this.outgoing();

    return html;
  }

  this.h3 = function()
  {
    return this.navi();
  }

  this.theme = function()
  {
    if(this.dict.flag){ return this.dict.flag.toLowerCase(); }
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

    return `media/diary/${this.diary().photo}.jpg`;
  }

  this.photo_info = function()
  {
    if(this.diaries.length < 1){ return ""; }

    var log = this.diary();

    return `<b>${log.name}</b> — <a href='${log.time.year}' class='local'>${log.time}</a>`
  }

  this.preview = function()
  {
    return `<yu class='term'>${this.diary() ? "<a href='"+this.name.to_url()+"'><img src='media/diary/"+this.diary().photo+".jpg'/></a>" : ""}<p>${this.bref}</p></yu>`;
  }

  this.format_link = function(path)
  {
    if(path.indexOf("itch.io") > -1){ return "Itch.io"}
    if(path.indexOf("github") > -1){ return "Github"}
    if(path.indexOf("itunes") > -1){ return "iTunes"}
    if(path.indexOf("youtu") > -1){ return "Youtube"}
    if(path.indexOf("bandcamp") > -1){ return "Bandcamp"}
    if(path.indexOf("drive.google") > -1){ return "Google Drive"}
    if(path.indexOf("producthunt") > -1){ return "ProductHunt"}
    if(path.indexOf("twitter") > -1){ return "Twitter"}
    if(path.indexOf("patreon") > -1){ return "Patreon"}

    return "Website"
  }

  // Views

  this._portal = function()
  {
    var html = ""
    for(id in this.children){
      var term = this.children[id];
      html += term.preview();
    }
    return html;
  }

  this._index = function()
  {
    var html = ""
    for(id in this.children){
      var term = this.children[id];
      html += term.diary() ? `<img src='media/diary/${ term.diary().photo}.jpg'/>` : '';
      html += `<h2 class='book'><a href='${term.name.to_url()}'>${term.name}</a></h2><hs>${term.bref}</hs>${term.long}`
      if(term.children.length > 0){
        html += "<quote>"
        for(id2 in term.children){
          var subterm = term.children[id2];
          html += subterm.diary() ? `<img src='media/diary/${ subterm.diary().photo}.jpg'/>` : '';
          html += `<h3 class='book'>${parseInt(id)+1}.${parseInt(id2)+1} ${subterm.name}</h3><p>${subterm.bref}</p>${subterm.long}`
        }  
        html += "</quote>"
      }
      
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
      if(diary.photo == this.diary().photo){ continue; }
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

  this.monitor = function()
  {
    if(this.logs.length < 10){ return ""; }
    var data = invoke.vessel.horaire.parse(this.logs)
    return `<yu id='monitor'>— <b>${data.sum}</b>FHS <b>${data.fh.toFixed(2)}</b>HDF <b>${data.ch.toFixed(2)}</b>HDC <b>${data.efec.toFixed(2)}</b>EFEC <b>${data.efic.toFixed(2)}</b>EFIC</yu>`
  }
}

function MissingTerm(name)
{
  Term.call(this,name)

  this.similarity = function(a,b){
    var val = 0
    for (i = 0; i < a.length; ++i) { val += b.indexOf(a.substr(i)) > -1 ? 1 : 0; }
    for (i = 0; i < b.length; ++i) { val += a.indexOf(b.substr(i)) > -1 ? 1 : 0; }
    a = a.split('').sort().join('');
    b = b.split('').sort().join('');
    for (i = 0; i < a.length; ++i) { val += b.indexOf(a.substr(i)) > -1 ? 1 : 0; }
    for (i = 0; i < b.length; ++i) { val += a.indexOf(b.substr(i)) > -1 ? 1 : 0; }
    return val
  }

  this.find_similar = function(target,list)
  {
    var similar = []
    for(key in list){
      var word = list[key]
      similar.push({word:word,value:this.similarity(target,word)});
    }
    return similar.sort(function(a, b) {
      return a.value - b.value;
    }).reverse();
  }

  html = ""
  
  var dict = Object.keys(invoke.vessel.lexicon.terms);
  var sorted = this.find_similar(name,dict);

  this.photo = () => { return "url(media/diary/92.jpg)"; };
  this.photo_info = () => { return new Date().desamber().toString(); };
  this.theme = () => { return "no_photo"; }
  this.bref = ""
  this.long = `<p>There were no pages found for \"${this.name}\", did you perhaps mean <a href='/${sorted[0].word.to_url()}'>${sorted[0].word}</a> or <a href='/${sorted[1].word.to_url()}'>${sorted[1].word}</a>?</p><p>If you think that a page should exist here, please contact <a href='https://twitter.com/neauoire'>@neauoire</a>, or add it as a <a href='https://github.com/XXIIVV/oscean/blob/master/scripts/dict/lexicon.js' target='_blank'>Pull Request</a>.</p>`;
}
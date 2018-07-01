function LietalNode(id,rect,...params)
{
  Node.call(this,id,rect,params);

  this.glyph = NODE_GLYPHS.value

  this.dict = null;

  this.answer = function(q)
  {
    if(!this.dict){
      this.dict = make_dict(this.request().dictionaery)
    }
    return this.id == "deconstruct" ? this.deconstruct(q) : this.translate(q,this.id)
  }

  this.translate = function(q,direction = "en_li")
  {
    var parts = q.replace(/\./g," ' ").split(" ");
    var s = "";
    for(id in parts){
      var part = parts[id];
      if(part == "["){ part = "push"; }
      if(part == "]"){ part = "pop"; }
      if(part == "&"){ part = "together"; }
      if(part == "|"){ part = "choice"; }
      if(part == ";"){ part = "position"; }
      if(part.substr(0,1) == "!"){ s += `${part.replace("!","")} `; continue; }
      if(part.substr(0,1) == "~"){ s += `${part.replace("~",".")} `; continue; }
      s += part != "'" ? ` ${this.convert(part,direction)} ` : part;
    }
    s = s.replace(/  /g,' ')
    return `<t class='lietal'>${this.format(s)}</t>`;
  }

  this.format = function(str)
  {
    str = str.replace(/ \' /g,"\'")
    str = str.replace(/ \./g,".")

    // Capitalize all sentences
    var html = ""
    var sentences = str.split(". ")
    for(id in sentences){
      var sentence = sentences[id].trim()
      html += `${sentence.charAt(0).toUpperCase() + sentence.slice(1)}${sentences.length > 1 ? '.' : ''} `
    }

    return html.trim();
  }

  this.vowel = function(v)
  {
    if(v == "a"){ return "ä"; }
    if(v == "e"){ return "ë"; }
    if(v == "i"){ return "ï"; }
    if(v == "o"){ return "ö"; }
    if(v == "u"){ return "ü"; }
    if(v == "y"){ return "ÿ"; }
    return "?"
  }

  this.adultspeak = function(childspeak)
  {
    childspeak = childspeak.toLowerCase();

    if(childspeak.length == 2){
      var c = childspeak.substr(0,1);
      var v = childspeak.substr(1,1);
      return v+c;
    }
    if(childspeak.length == 4){
      var c1 = childspeak.substr(0,1);
      var v1 = childspeak.substr(1,1);
      var c2 = childspeak.substr(2,1);
      var v2 = childspeak.substr(3,1);
      
      if(c1 == c2 && v1 == v2){
        return c1+this.vowel(v1);
      }
      else if(c1 == c2){
        return c1+v1+v2;
      }
      else if(v1 == v2){
        return c1+this.vowel(v1)+c2;
      }
    }
    if(childspeak.length == 6){
      return this.adultspeak(childspeak.substr(0,2))+this.adultspeak(childspeak.substr(2,4));
    }
    if(childspeak.length == 8){
      return this.adultspeak(childspeak.substr(0,4))+this.adultspeak(childspeak.substr(4,4));
    }
    return childspeak
  }

  this.convert = function(word,direction = "li_en")
  {
    if(word == '\''){ return word; }

    dict = direction == "li_en" ? this.dict.li_en : this.dict.en_li;
    word = word.toUpperCase();
    return dict[word] ? (direction == "en_li" ? this.adultspeak(dict[word]) : dict[word]) : word;
  }

  this.construction = function(childspeak)
  {
    childspeak = childspeak.toLowerCase();

    if(childspeak.length == 2){
      return `${this.convert(childspeak.substr(0,2))}`;
    }
    if(childspeak.length == 4){
      return `${this.convert(childspeak.substr(0,2))}(${this.convert(childspeak.substr(2,2))})`;
    }
    if(childspeak.length == 6){
      return `${this.convert(childspeak.substr(0,2)+childspeak.substr(2,2))}(${this.convert(childspeak.substr(4,2))})`;
    }

    return "(??)"
  }

  this.deconstruct = function(childspeak)
  {
    if(childspeak == "*"){
      return this.table();
    }
    return `<b>${this.adultspeak(childspeak).capitalize()}</b> : ${this.construction(childspeak).toLowerCase()} <comment># ${this.convert(childspeak).capitalize()}</comment>`
  }

  this.table = function()
  {
    var html = ""
    var dict = this.dict["li_en"]

    for(li in dict){
      var en = dict[li].trim();
      if(en == "" || li.length < 4){ continue; }
      var co = this.construction(li)
      var as = this.adultspeak(li)
      html += `<tr><td><b>${as.capitalize()}</b></td><td>${en.capitalize()}</td><td>${co != en ? co.toLowerCase() : '*'}</td></tr>`
    }
    return `<table>${html}</table>`
  }

  function make_dict(dictionaery)
  {
    var h = {en_li:{},li_en:{}};

    for(id in dictionaery){
      var value = dictionaery[id]
      h.li_en[value.lietal] = value.english;
      h.en_li[value.english] = value.lietal;
    }
    return h
  }
}
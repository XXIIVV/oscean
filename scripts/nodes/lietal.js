function LietalNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.value

  this.dict = null;

  this.answer = function(q)
  {
    if(!this.dict){
      this.dict = make_dict(this.request().dictionaery)
    }
    return this.translate(q)
  }

  this.translate = function(q)
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
      s += part != "'" ? ` <t title='${part}'>${this.convert(part,"en_li")}</t> ` : part;
    }
    return `<t class='lietal'>${s.replace(/ \' /g,"\'").trim()}</t>`;
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
    return dict[word] ? (direction == "en_li" ? this.adultspeak(dict[word]) : dict[word]) : "("+word+")";
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
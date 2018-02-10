function Lietal(dict)
{
  this.dict = {en_li:{},li_en:{}};

  for(id in dict.array){
    var value = dict.array[id]
    this.dict.li_en[value.lietal] = value.english;
    this.dict.en_li[value.english] = value.lietal;
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
      if(c1 == c2){
        return c1+v1+v2;
      }
      if(v1 == v2){
        if(v1 == "a"){ return c1+"ä"+c2; }
        if(v1 == "e"){ return c1+"ë"+c2; }
        if(v1 == "i"){ return c1+"ï"+c2; }
        if(v1 == "o"){ return c1+"ö"+c2; }
        if(v1 == "u"){ return c1+"ü"+c2; }
        if(v1 == "y"){ return c1+"ÿ"+c2; }
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

  this.deconstruct = function(childspeak)
  {
    childspeak = childspeak.toLowerCase();

    if(childspeak.length == 2){
      var p1 = childspeak.substr(0,2);
      return `${this.adultspeak(childspeak)} <comment>&lt;${this.convert(p1)}&gt;</comment> {*${this.convert(childspeak)}*}`;
    }
    if(childspeak.length == 4){
      var p1 = childspeak.substr(0,2);
      var p2 = childspeak.substr(2,2);
      return `${this.adultspeak(childspeak)} <comment>&lt;${this.convert(p1)}(${this.convert(p2)})&gt;</comment> {*${this.convert(childspeak)}*}`;
    }
    if(childspeak.length == 6){
      var p1 = childspeak.substr(0,2);
      var p2 = childspeak.substr(2,2);
      var p3 = childspeak.substr(4,2);
      return `${this.adultspeak(childspeak)} <comment>&lt;${this.convert(p1+p2)}(${this.convert(p3)})&gt;</comment> {*${this.convert(childspeak)}*}`;
    }
    return "??"
  }

  this.construction = function(q)
  {
    var parts = q.replace(/\./g," ' ").split(" ");
    var s = "";
    for(id in parts){
      var part = parts[id];
      s += this.convert(part,"en_li")+" ";
    }
    return "<b>"+s.replace(/ \' /g,"\'").trim()+"</b>";
  }
}

invoke.vessel.seal("corpse","lietal");
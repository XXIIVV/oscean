function Aeth(data = {},name = null)
{
  Entry.call(this,name ? name : data.name,data);

  this.childspeak = name ? name : data.name;
  this.adultspeak = adultspeak(name ? name : data.name)
  this.index = false;

  this.to_english = function()
  {
    var r = Ø('database').find(this.name)
    return r && r.data.english ? r.data.english.toLowerCase() : null
  }

  this.to_deconstruction = function()
  {
    var html = ""

    ae1 = new Aeth(null,this.name.substr(0,2))
    ae2 = new Aeth(null,this.name.substr(2,2))

    html += `${ae1.adultspeak}:<b>${ae1.to_english()}</b> + ${ae2.adultspeak}:<b>${ae2.to_english()}</b> = ${this.adultspeak}:<b>${this.to_english()}</b>`
    return html
  }

  function adultspeak(cs)
  {
    var childspeak = cs.toLowerCase();
    var vowels = {"a":"ä","e":"ë","i":"ï","o":"ö","u":"ü","y":"ÿ"}

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
        return c1+vowels[v1];
      }
      else if(c1 == c2){
        return c1+v1+v2;
      }
      else if(v1 == v2){
        return c1+vowels[v1]+c2;
      }
    }
    if(childspeak.length == 6){
      return adultspeak(childspeak.substr(0,2))+adultspeak(childspeak.substr(2,4));
    }
    if(childspeak.length == 8){
      return adultspeak(childspeak.substr(0,4))+adultspeak(childspeak.substr(4,4));
    }
    return childspeak
  }

  this.toString = function()
  {
    var en = this.to_english()
    return `<p>{*${this.name.capitalize()}*}${this.name.toLowerCase() != this.adultspeak.toLowerCase() ? ', or '+this.adultspeak.capitalize() : ''} is a {(Lietal)} word${en ? ' that translates to \"'+en+'\" in {(English)}' : ''}.</p>`.to_curlic()
  }
}
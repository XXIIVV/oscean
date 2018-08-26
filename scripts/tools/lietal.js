function Aeth(data)
{
  if(!Array.isArray(data)){ data = {name:data}}

  Entry.call(this,data.name,data);

  this.childspeak = data.name;
  this.adultspeak = adultspeak(data.name)

  this.to_english = function()
  {
    return "??"
  }

  this.toString = function()
  {
    return "LIETAL TERM"
  }

  function adultspeak(cs)
  {
    return ""
    let childspeak = cs.toLowerCase();
    let vowels = {"a":"ä","e":"ë","i":"ï","o":"ö","u":"ü","y":"ÿ"}

    if(childspeak.length == 2){
      let c = childspeak.substr(0,1);
      let v = childspeak.substr(1,1);
      return v+c;
    }
    if(childspeak.length == 4){
      let c1 = childspeak.substr(0,1);
      let v1 = childspeak.substr(1,1);
      let c2 = childspeak.substr(2,1);
      let v2 = childspeak.substr(3,1);
      
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
}
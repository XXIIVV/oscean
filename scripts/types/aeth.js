'use strict';

function Aeth(data = {},name = null)
{
  Entry.call(this,name ? name : data.name,data);
  
  this.consonant = this.name.substr(0,1)
  this.vowel = this.name.substr(1,1)
  this.childspeak = name ? name : data.name;
  this.adultspeak = adultspeak(name ? name : data.name)
  this.index = false;
  
  this.type = function()
  {
    return Ø('database').find(`${this.consonant}Y`,true).to_english()
  }
  
  this.to_english = function()
  {
    if(this.data && this.data.english){ return this.data.english.toLowerCase(); }
    
    let r = Ø('database').find(this.name,true)
    return r && r.data.english ? r.data.english.toLowerCase() : null
  }

  this.to_deconstruction = function()
  {
    let html = ""

    let ae1 = new Aeth(null,this.name.substr(0,2))
    let ae2 = new Aeth(null,this.name.substr(2,2))
    
    html += `${ae1.adultspeak}:<b>${ae1.type()}.${ae1.to_english()}</b>&#40;${ae2.adultspeak}:<b>${ae2.type()}.${ae2.to_english()}</b>&#41; = ${this.adultspeak}:<b>${this.type()}.${this.to_english()}</b>`
    return html
  }

  function adultspeak(cs)
  {
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
      
      // Complex
      if(v1 == "i" && v2 == "a" && c1 == c2){
        return "e"+c1;
      }
      else if(v1 == "a" && v2 == "o" && c1 == c2){
        return "u"+c1;
      }
      else if(v1 == "i" && v2 == "a"){
        return c1+"e"+c2;
      }
      else if(v1 == "a" && v2 == "o"){
        return c1+"u"+c2;
      }

      // Basics
      if(c1 == c2 && v1 == v2){
        return vowels[v1]+c1;
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
    let en = this.to_english()
    return `<p>{*${this.name.capitalize()}*}${this.name.toLowerCase() != this.adultspeak.toLowerCase() ? ', or '+this.adultspeak.capitalize() : ''} is a {(Lietal)} word${en ? ' that translates to \"'+en+'\" in {(English)}' : ''}.</p>`.to_curlic()
  }
}

function Construction(str)
{
  this.str = str;
  
  this.prepare = function(str)
  {
    return str.replace(/\'/g," ' ").replace(/\,/g," , ").replace(/\?/g," ? ").replace(/\!/g," ! ");
  }

  this.complete = function(html)
  {
    return html.replace(/ \' /g,"'").replace(/ \, /g,", ").replace(/ \? /g,"? ").replace(/ \! /g,"! ").trim();
  }

  this.find = function(target,adultspeak = true)
  {
    var d = Ø('database').cache.dictionaery;
    for(let id in d){
      if(d[id].to_english() == target.toLowerCase()){
        return adultspeak ? d[id].adultspeak : d[id].childspeak;
      }
    }
    return target
  }
  
  this.to_septambres = function()
  {
    return new Septambres(this.toString(false));
  }
  
  this.toString = function(adultspeak = true)
  {
    let html = ''
    let str = this.prepare(this.str);
    let parts = str.split(' ');
    for(let id in parts){
      var part = parts[id];
      html += `${this.find(part,adultspeak)} `
    }
    return this.complete(html);
  }
}
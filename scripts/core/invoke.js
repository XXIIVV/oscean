function Invoke(name)
{
  this.name = name;
  this.path = "";
  this.requirements = {core:["corpse","memory","list","runic","desamber"],main:[name]};
  this.includes = {};
  this.is_owner = false;
  this.vessel = null;
  this.storage = {};

  this.summon = function()
  {
    for(var cat in this.requirements){
      this.includes[cat] = [];
    }
    // Install

    for(var cat in this.requirements){
      this.includes[cat] = [];
      for(var id in this.requirements[cat]){
        var name = this.requirements[cat][id]
        invoke.install_script(cat+"/"+name);
      }
    }
  }

  this.install_script = function(name)
  {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = "scripts/"+name+'.js';
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  this.seal = function(type,name,payload = null)
  {
    console.log("seal."+type,name)
    if(payload){ this.storage[name] = payload; }
    this.includes[type].push(name);
    this.verify();
  }

  this.verify = function()
  {
    var remaining = [];

    for(var cat in this.requirements){
      for(var id in this.requirements[cat]){
        var name = this.requirements[cat][id]
        if(this.includes[cat].indexOf(name) < 0){ remaining.push(name); }
      }
    }

    if(remaining.length == 0){
      this.start();
    }
  }

  this.start = function()
  {
    this.vessel = new window[this.name.capitalize()]();
    this.vessel.summon();
  }
}

String.prototype.capitalize = function()
{
  return this.charAt(0).toUpperCase() + this.slice(1);
}
function Invoke(name,version = "100")
{
  this.name = name;
  this.version = version;
  this.path = "";
  this.requirements = {core:["corpse","memory","list","runic","desamber","clock","keyboard"],main:[name]};
  this.includes = {};
  this.vessel = null;
  this.storage = {};

  this.summon = function()
  {
    console.log("invk","summoning "+invoke.name+" v"+invoke.version); 

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
    s.src = "scripts/"+name+'.js?version='+this.version;
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  this.seal = function(type,name,payload = null)
  {
    console.log("seal",type+"/"+name+" "+this.remaining().length);

    if(payload){ this.storage[name] = payload; }
    this.includes[type].push(name);
    this.verify();
  }

  this.verify = function()
  {
    if(this.remaining().length == 0){
      console.log("core","ready "+this.name)
      this.start();
    }
  }

  this.remaining = function()
  {
    var remaining = [];

    for(var cat in this.requirements){
      for(var id in this.requirements[cat]){
        var name = this.requirements[cat][id]
        if(this.includes[cat].indexOf(name) < 0){ remaining.push(name); }
      }
    }
    return remaining;
  }

  this.start = function()
  {
    this.vessel = new window[this.name.capitalize()]();
    this.keyboard = new Keyboard();
    this.clock = new Clock();
    this.vessel.summon();
  }
}

String.prototype.capitalize = function()
{
  return this.charAt(0).toUpperCase() + this.slice(1);
}

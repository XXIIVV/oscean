function Invoke(name)
{
  this.name = name;
  this.path = "";
  this.requirements = {style:["reset","fonts","main"],core:["vessel","corpse"],main:[name]};
  this.includes = {core:[],main:[]};
  this.is_owner = false;
  this.vessel = null;

  this.install = function()
  {
    for(var id in this.requirements.style){
      var name = this.requirements.style[id];
      this.install_style(name);
    }
    for(var id in this.requirements.core){
      var name = this.requirements.core[id];
      this.install_script("core/"+name);
    }
    for(var id in this.requirements.main){
      var name = this.requirements.main[id];
      this.install_script("main/"+name);
    }
  }

  this.install_style = function(name, is_user_side)
  {
    var href = "links/"+name+'.css';
    var s = document.createElement('link');
    s.rel = 'stylesheet';
    s.type = 'text/css';
    s.href = href;
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  this.install_script = function(name)
  {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = "scripts/"+name+'.js';
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  this.seal = function(type,name)
  {
    console.log("Seal:"+type,name)
    this.includes[type].push(name);
    this.verify();
  }

  this.verify = function()
  {
    var remaining = [];

    for(id in this.requirements.core){
      var name = this.requirements.core[id];
      if(this.includes.core.indexOf(name) < 0){ remaining.push(name); }
    }
    for(id in this.requirements.main){
      var name = this.requirements.main[id];
      if(this.includes.main.indexOf(name) < 0){ remaining.push(name); }
    }

    if(remaining.length == 0){
      this.start();
    }
  }

  this.start = function()
  {
    console.info("Start")
    var vessel_name = this.name.capitalize();
    this.vessel = new window[vessel_name]();
    this.vessel.start();
  }
}

String.prototype.capitalize = function()
{
  return this.charAt(0).toUpperCase() + this.slice(1);
}
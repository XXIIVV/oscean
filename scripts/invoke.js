function Invoke(name,version = "100")
{
  this.name = name;
  this.version = version;
  this.path = "";
  this.requirements = {core:["corpse","memory","list","runic","desamber","clock","keyboard"],main:[name]};
  this.includes = {};
  this.vessel = null;
  this.storage = {};

  this.el = document.createElement('div'); 

  this.setup = function()
  {
    this.el.id = "invoke_status"; 
    this.el.style.position = "fixed"; 
    this.el.style.height = "2px";  
    this.el.style.backgroundColor = "#72dec2"; 
    this.el.style.width = "0vw"; 
    this.el.style.zIndex = "9000"; 
    this.el.style.left = "0px"; 
    this.el.style.top = "0px"; 
    this.el.style.transition = "width 500ms; opacity 150md";

    document.body.appendChild(this.el);
    this.summon();
  }

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
    s.src = "scripts/"+name+'.js?version='+this.version;
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  this.seal = function(type,name,payload = null)
  {
    console.log("seal",`${type}/${name} -> ${parseInt(this.progress() * 100)}%`);

    if(payload){ this.storage[name] = payload; }

    this.includes[type].push(name);
    this.verify();
  }

  this.verify = function()
  {
    if(this.remaining().length == 0){
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

  this.progress = function()
  {
    var sum = 0;
    for(var cat in this.requirements){
      sum += this.requirements[cat].length;
    }
    var ratio = 1 - ((this.remaining().length-1)/sum)
    var perc  = parseInt(ratio * 100);
    var el = document.getElementById("invoke_status");

    el.style.width = `${perc}vw`;
    document.title = `Loading.. ${perc}%`;

    el.style.opacity = ratio == 1 ? 0 : 1;

    return ratio;
  }

  this.start = function()
  {
    this.progress();
    this.vessel = new window[this.name.capitalize()]();
    this.keyboard = new Keyboard();
    this.clock = new Clock();
    this.vessel.summon();
  }

  this.log = function(cat,msg)
  {
    var el = document.getElementById("invoke_status");
    el.textContent += `${cat} : ${msg}\n`;
  }
}

String.prototype.capitalize = function()
{
  return this.charAt(0).toUpperCase() + this.slice(1);
}

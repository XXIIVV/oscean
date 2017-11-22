function Invoke(name)
{
  this.path = "";
  this.requirements = {style:["reset","fonts","main"],script:["corpse"]};
  this.includes = {script:[]};
  this.is_owner = false;

  this.install = function()
  {
    for(var id in this.requirements.script){
      var name = this.requirements.script[id];
      this.install_script(name);
    }
    for(var id in this.requirements.style){
      var name = this.requirements.style[id];
      this.install_style(name);
    }
    this.install_style("custom", true);
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

  this.confirm = function(type,name)
  {
    console.log("Included:",type,name)
    this.includes[type].push(name);
    this.verify();
  }

  this.verify = function()
  {
    var remaining = [];

    for(id in this.requirements.script){
      var name = this.requirements.script[id];
      if(this.includes.script.indexOf(name) < 0){ remaining.push(name); }
    }

    if(remaining.length == 0){
      this.start();
    }
  }
}

String.prototype.capitalize = function()
{
  return this.charAt(0).toUpperCase() + this.slice(1);
}
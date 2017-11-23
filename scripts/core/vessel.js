function Vessel()
{
  this.requirements = {};
  this.includes = {};

  this.install = function()
  {
    console.log("Install",this.name)

    for(var cat in this.requirements){
      this.includes[cat] = [];
      for(var id in this.requirements[cat]){
        invoke.install_script("main/"+cat+"/"+this.requirements[cat][id]);
      }
    }
  }

  this.seal = function(type,name)
  {
    console.log("seal("+this.name+")."+type,name)
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
    this.vessel.install();
  }

  this.start = function()
  {
    console.log("Idle.")
  }
}

invoke.seal("core","vessel");
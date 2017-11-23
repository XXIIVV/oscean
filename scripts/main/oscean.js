function Oscean()
{
  Vessel.call(this);
  
  this.requirements = {corpse:["header","footer"]};

  this.name = "oscean";
  this.corpse = null;

  this.start = function()
  {
    console.log("Start")
    this.corpse = new Corpse(this);
    this.corpse.install();
  }
}

invoke.seal("main","oscean");
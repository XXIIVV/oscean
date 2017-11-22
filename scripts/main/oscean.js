function Oscean()
{
  Vessel.call(this);
  
  this.name = "Oscean";
  this.requirements = ["corpse"];
  this.corpse = null;

  this.start = function()
  {
    this.corpse = new Corpse(this);
    this.corpse.install();
  }
}

invoke.seal("main","oscean");
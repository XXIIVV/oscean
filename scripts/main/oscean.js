function Oscean()
{
  Invoke.call(this);
  
  this.requirements = {corpse:["header","footer"]};

  this.name = "oscean";
  this.corpse = null;

  this.start = function()
  {
    this.corpse = new Corpse(this);
    this.corpse.install();
  }
}

invoke.seal("main","oscean");
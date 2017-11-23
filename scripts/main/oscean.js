function Oscean()
{
  Invoke.call(this);
  
  this.requirements = {corpse:["layout"],dict:["lexicon"]};

  this.name = "oscean";
  this.corpse = null;

  this.start = function()
  {
    this.corpse = new Layout(this);
    this.corpse.install();
  }
}

invoke.seal("main","oscean");
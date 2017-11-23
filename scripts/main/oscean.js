function Oscean()
{
  Invoke.call(this);
  
  this.requirements = {corpse:["layout","lexicon","term"],dict:["lexicon"]};

  this.name = "oscean";
  this.corpse = null;

  this.start = function()
  {
    this.lexicon = new Lexicon($LEXICON);

    this.corpse = new Layout(this);
    this.corpse.install();
  }
}

invoke.seal("main","oscean");
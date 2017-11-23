function Oscean()
{
  Invoke.call(this);
  
  this.requirements = {corpse:["layout","lexicon","term","horaire","log"],dict:["lexicon"],list:["horaire"]};

  this.name = "oscean";
  this.corpse = null;

  this.start = function()
  {
    this.lexicon = new Lexicon($LEXICON);
    this.horaire = new Horaire($HORAIRE);

    this.corpse = new Layout(this);
    this.corpse.install();
  }
}

invoke.seal("main","oscean");
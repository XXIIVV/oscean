function Oscean()
{
  Invoke.call(this);
  
  this.requirements = {
    corpse:["layout","lexicon","term","horaire","log"],
    dict:["lexicon"],
    list:["horaire"],
    docs:["directory","nutrition","aesthetics","russian","japanese","nomad","glossary","tiers","biases","discography","lietal","blue"],
    special:["horaire","calendar","home","death"]
  };

  this.name = "oscean";
  this.corpse = null;

  this.start = function()
  {
    this.horaire = new Horaire($HORAIRE);
    this.lexicon = new Lexicon($LEXICON);

    this.lexicon.start();
    this.horaire.start();

    this.corpse = new Layout(this);
    this.corpse.install();
  }
}

invoke.seal("main","oscean");
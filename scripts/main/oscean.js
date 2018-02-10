function Oscean()
{
  Invoke.call(this);
  
  this.requirements = {
    corpse:["layout","lexicon","term","horaire","log","lietal"],
    dict:["lexicon"],
    list:["horaire","dictionaery"],
    docs:["directory","russian","japanese","discography","blue","glossary","biases","tiers"],
    special:["horaire","calendar","home","death","portal","status","lietal","dictionaery"]
  };

  this.name = "oscean";
  this.corpse = null;

  this.start = function()
  {
    this.horaire = new Horaire($HORAIRE);
    this.lexicon = new Lexicon($LEXICON);
    this.lietal  = new Lietal($DICTIONAERY);

    this.lexicon.add_terms();
    this.lexicon.connect_terms();
    this.horaire.add_logs();
    this.horaire.connect_logs();
    this.horaire.find_available();
    this.lexicon.start_terms();

    this.corpse = new Layout(this);
    this.corpse.install();
  }
}

invoke.seal("main","oscean");
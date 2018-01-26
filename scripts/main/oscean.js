function Oscean()
{
  Invoke.call(this);
  
  this.requirements = {
    corpse:["layout","lexicon","term","horaire","log"],
    dict:["lexicon"],
    list:["horaire"],
    docs:["directory","russian","japanese","discography","lietal","blue"],
    special:["horaire","calendar","home","death"]
  };

  this.name = "oscean";
  this.corpse = null;

  this.start = function()
  {
    this.horaire = new Horaire($HORAIRE);
    this.lexicon = new Lexicon($LEXICON);

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
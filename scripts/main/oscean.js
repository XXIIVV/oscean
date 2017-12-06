function Oscean()
{
  Invoke.call(this);
  
  this.requirements = {
    corpse:["layout","lexicon","term","horaire","log","monitor"],
    dict:["lexicon"],
    docs:["directory","nutrition","aesthetics","russian","japanese","nomad","oceanism","glossary","tiers","biases","offline","fransset","home","lietal","blue"],
    list:["horaire"]
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

  this.query = function()
  {
    var parts = window.location.pathname.split("/"); console.log(parts[parts.length-1])
    var hash = window.location.hash.replace("#","");
    return hash;
  }
}

invoke.seal("main","oscean");
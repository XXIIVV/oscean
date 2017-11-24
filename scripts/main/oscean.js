function Oscean()
{
  Invoke.call(this);
  
  this.requirements = {corpse:["layout","lexicon","term","horaire","log"],dict:["lexicon"],docs:["directory","nutrition","aesthetics","russian","japanese"],list:["horaire"]};

  this.name = "oscean";
  this.corpse = null;

  this.start = function()
  {
    this.lexicon = new Lexicon($LEXICON);
    this.horaire = new Horaire($HORAIRE);

    this.corpse = new Layout(this);
    this.corpse.install();
  }

  this.query = function()
  {
    var parts = window.location.pathname.split("/"); console.log(parts[parts.length-1])
    var hash = window.location.hash.replace("#","");
    return hash;
  }

  this.exists = function(url)
  {
    if(url){
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send();
        return req.status==200;
    } else {
        return false;
    }
  }
}

invoke.seal("main","oscean");
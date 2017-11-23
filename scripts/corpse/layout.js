function Layout(host)
{
  Corpse.call(this,host);

  this.hd.appendChild(this.h1 = document.createElement('h1'));
  this.hd.appendChild(this.h2 = document.createElement('h2'));
  this.md.appendChild(this.m1 = document.createElement('m1'));
  this.md.appendChild(this.m2 = document.createElement('m2'));

  this.start = function()
  {
    this.load("Oquonie");
  }

  this.load = function(key)
  {
    var term = this.host.lexicon.find(key) ; term.start();

    this.h1.innerHTML = "<a href=''>"+term.parent.name+"</a>/<a>"+term.name+"</a>";
    this.h2.innerHTML = term.bref;
    this.m1.innerHTML = term.long;
    this.m2.innerHTML = "<br />"+term.logs.length+" logs";
  }
}

invoke.vessel.seal("corpse","layout");
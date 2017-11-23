function Layout(host)
{
  Corpse.call(this,host);

  // Header
  this.hd.appendChild(this.h1 = document.createElement('h1'));
  this.hd.appendChild(this.photo = document.createElement('photo'));
  this.hd.appendChild(this.logo = document.createElement('a'));
  this.hd.appendChild(this.search = document.createElement('input'));
  // Body
  this.md.appendChild(this.md_wr = document.createElement('wr'));
  this.md_wr.appendChild(this.m1 = document.createElement('m1'));
  this.md_wr.appendChild(this.m2 = document.createElement('m2'));
  // Footer
  this.fd.appendChild(this.fd_wr = document.createElement('wr'));

  this.start = function()
  {
    this.load(invoke.vessel.query());
  }

  this.load = function(key)
  {
    var term = this.host.lexicon.find(key) ; term.start();

    this.search.setAttribute("placeholder",term.parent.name+"/"+term.name)
    this.h1.innerHTML = term.bref;
    if(term.diaries[0]){
      this.photo.style.backgroundImage = "url(media/diary/"+term.diaries[0].photo+".jpg)";
    }
    this.m1.innerHTML = term.long;
    this.m2.innerHTML = "<br />"+term.logs.length+" logs "+term.diaries.length+" diaries";

    this.fd_wr.innerHTML = "Footer";
  }
}

invoke.vessel.seal("corpse","layout");
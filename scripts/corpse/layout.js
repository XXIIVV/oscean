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

  this.search.addEventListener('keydown', function(event) {
    if(event.key === "Enter"){ invoke.vessel.corpse.validate(); }
  });

  this.start = function()
  {
    this.load(invoke.vessel.query());
    this.fd_wr.innerHTML = "<a href='' class='icon twitter'></a><a href='https://github.com/neauoire' class='icon github'></a><a href='Rotonde' class='icon rotonde'></a><a href='Nataniev' class='icon nataniev'></a><a href='Devine+lu+linvega'>Devine Lu Linvega</a> © 2006—2017<br/>BY-NC-SA 4.0<hr />";
  }

  this.load = function(key)
  {
    var term = this.host.lexicon.find(key.replace(/\+/g," ")) ; term.start();

    window.scrollTo(0,0);
    window.location = "#"+key;

    document.title = term.name;

    this.search.setAttribute("placeholder",term.parent ? (term.parent.name+"/")+term.name : term.name)
    this.logo.setAttribute("href",term.parent ? term.parent.name : "Home")
    this.h1.innerHTML = term.bref;
    if(term.diaries[0]){
      this.hd.className = 'si'
      this.photo.style.backgroundImage = "url(media/diary/"+term.diaries[0].photo+".jpg)";
    }
    else{
      this.hd.className = 'no';
    }
    this.md_wr.innerHTML = term.long;
  }

  this.link = function(target)
  {
    var name = target.replace("/","").trim();

    // External
    if(target.indexOf("http") > -1){
      window.open(target,'_blank');
    }
    else{
      this.load(name)
    }
  }

  this.validate = function()
  {
    var name = this.search.value.replace("/","").trim();
    this.load(name);
    this.search.value = "";
    this.search.blur();
  }

  window.onclick = function(e){ if(e.target.localName == "a"){ e.preventDefault(); invoke.vessel.corpse.link(e.target.getAttribute("href"));} };
}

invoke.vessel.seal("corpse","layout");
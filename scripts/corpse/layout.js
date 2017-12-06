function Layout(host)
{
  Corpse.call(this,host);

  this.monitor = new Monitor();
  // Header
  this.hd.appendChild(this.photo = document.createElement('photo'));
  this.hd.appendChild(this.icon = document.createElement('icon'));
  this.hd.appendChild(this.logo = document.createElement('a'));
  this.hd.appendChild(this.search = document.createElement('input'));
  this.hd.appendChild(this.h1 = document.createElement('h1'));
  this.hd.appendChild(this.h2 = document.createElement('h2'));
  // Body
  this.md.appendChild(this.md_wr = document.createElement('wr'));
  this.md_wr.appendChild(this.m1 = document.createElement('m1'));
  this.md_wr.appendChild(this.m2 = document.createElement('m2'));
  this.md_wr.appendChild(this.m3 = document.createElement('m3'));
  this.md_wr.appendChild(this.monitor.el);
  this.md_wr.appendChild(this.hr = document.createElement('hr'));
  // Footer
  this.fd.appendChild(this.fd_wr = document.createElement('wr'));

  this.search.addEventListener('keydown', function(event) {
    if(event.key === "Enter"){ invoke.vessel.corpse.validate(); }
  });

  this.start = function()
  {
    this.load(invoke.vessel.query());
    this.fd_wr.innerHTML = "<a href='' class='icon twitter'></a><a href='https://github.com/neauoire' class='icon github'></a><a href='Rotonde' class='icon rotonde'></a><a href='Nataniev' class='icon nataniev'></a><yu id='clock'></yu><a href='Devine+lu+linvega'>Devine Lu Linvega</a> © 2006—2017<br/>BY-NC-SA 4.0<hr />";
    this.clock = new Clock();
    this.clock.start()
  }

  this.load = function(key)
  {
    this.prev = this.term;
    
    if(this.term && key.toLowerCase() == this.term.name.toLowerCase()){ console.log("Already here",key); return; }

    this.el.style.opacity = 0;
    window.location = "#"+key;
    
    var c = invoke.vessel.corpse;
    c.term = c.host.lexicon.find(key.replace(/\+/g," "));
    c.term.start();
    c.photo.style.backgroundImage = c.term.photo();
    c.monitor.update(c.term.logs);
    document.title = c.term.name;

    setTimeout(function(){ 
      c.el.style.opacity = 1;
      window.scrollTo(0,0);
      c.search.setAttribute("value",c.term.name)
      c.logo.setAttribute("href",c.term.parent ? c.term.parent.name : "Home")
      c.h1.innerHTML = c.term.bref;
      c.h2.innerHTML = c.term.h2();
      c.hd.className = c.term.theme();
      c.icon.style.backgroundImage = "url('media/badge/nataniev.svg')";
      c.m1.innerHTML = c.term.long;
      c.m2.innerHTML = c.term.view();
      c.m3.innerHTML = c.term.tree();

      var icon_name = c.term.name.toLowerCase().replace(/\ /g,".");
      var img = new Image();
      img.src = "media/badge/"+icon_name+".svg";
      img.onload = function(){
        if(img.naturalHeight == 0){ return; }
        invoke.vessel.corpse.icon.style.backgroundImage = "url('media/badge/"+icon_name+".svg')";
      }
    },250)
  }

  this.link = function(target)
  {
    var name = target.replace("/","").trim();

    // External
    if(target.match(/^http|^dat/)){
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
    this.search.blur();
  }

  this.on_scroll = function()
  {
    var offset = window.scrollY * 0.75;
    this.logo.style.top = parseInt(30 - offset)+"px";
    this.search.style.top = parseInt(60 - offset)+"px";
  }

  window.onclick = function(e){ if(e.target.localName == "a"){ e.preventDefault(); invoke.vessel.corpse.link(e.target.getAttribute("href"));} };
  window.onscroll = function(){ invoke.vessel.corpse.on_scroll(); };
}

invoke.vessel.seal("corpse","layout");

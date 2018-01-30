function Layout(host)
{
  Corpse.call(this,host);

  // Header
  this.hd.appendChild(this.links = document.createElement('div'));
  this.hd.appendChild(this.photo = document.createElement('photo'));
  this.hd.appendChild(this.photo_info = document.createElement('info'));
  this.hd.appendChild(this.logo = document.createElement('a')); 
  this.hd.appendChild(this.search = document.createElement('input'));

  this.sd.appendChild(this.h1 = document.createElement('h1'));
  this.sd.appendChild(this.h2 = document.createElement('h2'));
  this.sd.appendChild(this.icon = document.createElement('icon'));
  this.sd.appendChild(this.h3 = document.createElement('h3'));
  // Body
  this.md.appendChild(this.md_wr = document.createElement('wr'));
  this.md_wr.appendChild(this.m1 = document.createElement('m1'));
  this.md_wr.appendChild(this.m2 = document.createElement('m2'));
  this.md_wr.appendChild(this.m3 = document.createElement('m3'));
  this.md.appendChild(this.hr = document.createElement('hr'));
  // Footer
  this.fd.appendChild(this.fd_wr = document.createElement('wr'));

  this.search.setAttribute("autocomplete","off");
  this.search.setAttribute("autocorrect","off");
  this.search.setAttribute("autocapitalize","off");
  this.search.setAttribute("spellcheck","off");

  this.logo.setAttribute("href", "Home")

  this.start = function()
  {
    this.load(this.query());
    this.links.innerHTML = "<a href='https://twitter.com/neauoire' class='icon twitter external'></a><a href='https://github.com/neauoire' class='icon github external'></a><a href='Rotonde' class='icon rotonde'></a>";
    this.fd_wr.innerHTML = `<yu id='clock'></yu><a href='Devine+lu+linvega'>Devine Lu Linvega</a> © ${invoke.vessel.horaire.logs[invoke.vessel.horaire.logs.length-1].time}—${invoke.vessel.horaire.logs[0].time}<br/>BY-NC-SA 4.0 <span style='color:#ccc'>build${invoke.version}</span><hr />`;
    this.clock = new Clock();
    this.clock.start()
  }

  this.load = function(key)
  {
    this.prev = this.term;
    

    if(this.term && key.toLowerCase() == this.term.name.toLowerCase()){ console.log("Already here",key); return; }


    this.el.style.opacity = 0;
    this.search.value = key.replace(/\+/g," ");
    window.location = "#"+key;
    
    var c = invoke.vessel.corpse;
    c.term = c.host.lexicon.find(key.replace(/\+/g," "));
    c.photo.style.backgroundImage = c.term.photo();
    c.photo_info.innerHTML = c.term.photo_info();
    c.m1.innerHTML = "";
    c.m2.innerHTML = "";
    c.m3.innerHTML = "";
    document.title = c.term.name;

    setTimeout(function(){ 

      if(c.term){ c.set_theme(c.term.theme()); }
      c.el.style.opacity = 1;
      window.scrollTo(0,0);
      c.search.setAttribute("value",c.term.name)
      
      c.h1.innerHTML = c.term.bref;
      c.h2.innerHTML = c.term.h2();
      c.h3.innerHTML = c.term.h3();
      c.hd.className = c.term.theme();
      c.icon.style.backgroundImage = "url('media/badge/nataniev.svg')";
      c.m1.innerHTML = c.term.long;
      c.m2.innerHTML = c.term.view();

      var icon_name = c.term.name.toLowerCase().replace(/\ /g,".");
      var img = new Image();
      img.src = "media/badge/"+icon_name+".svg";
      img.onload = function(){
        if(img.naturalHeight == 0){ return; }
        invoke.vessel.corpse.icon.style.backgroundImage = "url('media/badge/"+icon_name+".svg')";
      }
    },250)
  }

  this.set_theme = function(mode)
  {
    this.el.className = mode;
  }

  this.link = function(target)
  {
    var name = target.replace(/^\//g,"").trim();

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
    var name = invoke.vessel.corpse.search.value.replace("/","").trim();
    invoke.vessel.corpse.load(name);
    invoke.vessel.corpse.search.blur();
  }

  this.on_scroll = function()
  {
    var offset = window.scrollY * 0.75;
    this.logo.style.top = parseInt(30 - offset)+"px";
    this.search.style.top = parseInt(60 - offset)+"px";
    this.links.style.top = parseInt(60 - offset)+"px";
  }

  this.search_focus = function(event)
  {
    event.preventDefault();
    invoke.vessel.corpse.search.value = "";
    invoke.vessel.corpse.search.focus();
    window.scrollTo(0,0)
  }
  
  window.onscroll = function(){ invoke.vessel.corpse.on_scroll(); };

  invoke.keyboard.add_event("Enter",this.validate,this.search);
  invoke.keyboard.add_event("Tab",this.search_focus);
}

invoke.vessel.seal("corpse","layout");

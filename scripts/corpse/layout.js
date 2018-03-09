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
  this.logo.id = "logo"
  this.search.id = "search"

  this.start = function()
  {
    this.load(this.query());
    this.fd_wr.innerHTML = `
    <a href='https://twitter.com/neauoire' class='icon twitter external'></a><a href='https://github.com/neauoire' class='icon github external'></a><a href='Rotonde' class='icon rotonde'></a>
    <yu id='clock'></yu><a href='Devine+lu+linvega'>Devine Lu Linvega</a> © ${invoke.vessel.horaire.logs[invoke.vessel.horaire.logs.length-1].time}—${invoke.vessel.horaire.logs[0].time}<br/>BY-NC-SA 4.0 <span style='color:#ccc'>build${invoke.version}</span><hr />`;
    this.clock = new Clock();
    this.clock.start()
  }

  this.load = function(key = this.location)
  {
    this.location = key;
    this.prev = this.term;    
    if(this.term && key.toLowerCase() == this.term.name.toLowerCase()){ console.log("Already here",key); return; }
    this.term = this.host.lexicon.find(key.replace(/\+/g," "));
    this.unload();
    setTimeout(() => { this.reload(key) },250);
  }

  this.unload = function()
  {
    this.el.style.opacity = 0;

    document.title = "Loading..";
    this.search.value = "Transiting..";
    this.m1.innerHTML = "";
    this.m2.innerHTML = "";
    this.m3.innerHTML = "";
    this.icon.className = "hide";
    this.photo.className = "hide";
    this.photo.style.backgroundImage = "";
    this.photo_info.innerHTML = "";
    this.icon.style.backgroundImage = "url('media/badge/nataniev.svg')";
  }

  this.reload = function(key)
  {
    document.title = this.term.name.capitalize();
    window.scrollTo(0,0);
    this.search.value = this.term.name;

    this.h1.innerHTML = this.term.bref;
    this.h2.innerHTML = this.term.h2();
    this.h3.innerHTML = this.term.h3();
    this.hd.className = this.term.theme();
    this.m1.innerHTML = this.term.long;
    this.m2.innerHTML = this.term.view();

    this.load_icon();
    this.load_photo();

    if(this.term){ 
      this.set_theme(this.term.theme()); 
    }

    this.el.style.opacity = 1;
    setTimeout(()=>{ window.history.replaceState({}, key, key.to_url()); },3000)
  }

  this.load_icon = function(icon_path = this.term.name.to_path())
  {
    var img = new Image();
    img.src = `media/badge/${icon_path}.svg`;
    img.onload = function(){
      if(img.naturalHeight == 0){ return; }
      invoke.vessel.corpse.icon.style.backgroundImage = `url('media/badge/${icon_path}.svg')`;
      invoke.vessel.corpse.icon.className = "show";
      setTimeout(() => { invoke.vessel.corpse.icon.className = "show"; },1000)
    }
  }

  this.load_photo = function(photo_path = this.term.photo())
  {
    var img = new Image();
    img.src = photo_path;
    img.onload = function(){
      if(img.naturalHeight == 0){ return; }
      invoke.vessel.corpse.photo.style.backgroundImage = `url(${photo_path})`;
      invoke.vessel.corpse.photo_info.innerHTML = invoke.vessel.corpse.term.photo_info();
      invoke.vessel.corpse.photo.className = "show";
    }
  }

  this.set_theme = function(mode)
  {
    this.el.className = mode;
  }

  this.link = function(target,force_external = false)
  {
    var name = target.replace(/^\//g,"").trim();
    // External
    if(target.match(/^http|^dat/)){
      window.open(target,'_blank');
    }
    else if(force_external){
      window.open("#"+target,'_blank');
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

  this.search_unfocus = function(event)
  {
    event.preventDefault();
    invoke.vessel.corpse.search.value = invoke.vessel.corpse.location;
    invoke.vessel.corpse.search.blur();
    window.scrollTo(0,0)
  }

  this.refresh = function(event)
  {
    if(document.activeElement.nodeName == "INPUT"){ return; }
    invoke.vessel.corpse.load();
    event.preventDefault();
  }

  this.hash_location = function(event)
  {
    console.log(invoke.vessel.corpse.location)
    window.location = `index.html#${invoke.vessel.corpse.location}`
  }
  
  window.onscroll = function(){ invoke.vessel.corpse.on_scroll(); };

  invoke.keyboard.add_event("Enter",this.validate,this.search);
  invoke.keyboard.add_event("Tab",this.search_focus);
  invoke.keyboard.add_event("Escape",this.search_unfocus);
  invoke.keyboard.add_event("r",this.refresh);
  invoke.keyboard.add_event("`",this.hash_location);
}

invoke.vessel.seal("corpse","layout");

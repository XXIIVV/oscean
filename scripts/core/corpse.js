String.prototype.to_url = function()
{
  return this.toLowerCase().replace(/ /g,"+").replace(/[^0-9a-z\+]/gi,"").trim();
}

function Corpse(host)
{
  this.host = host;
  this.styles = [];
  this.el = document.createElement('yu'); this.el.id = this.host.name;

  this.el.appendChild(this.hd = document.createElement('yu')); this.hd.id = "hd";
  this.el.appendChild(this.sd = document.createElement('yu')); this.sd.id = "sd";
  this.el.appendChild(this.md = document.createElement('yu')); this.md.id = "md";
  this.el.appendChild(this.fd = document.createElement('yu')); this.fd.id = "fd";

  this.install = function()
  {
    document.body.appendChild(this.el);

    for(var id in this.styles){
      this.install_style(this.styles[id]);
    }

    this.start();
  }

  this.install_style = function(name, is_user_side)
  {
    console.log("crps","style/"+name);

    var href = "links/"+name+'.css';
    var s = document.createElement('link');
    s.rel = 'stylesheet';
    s.type = 'text/css';
    s.href = href;
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  this.start = function()
  {
    
  }

  this.to_html = function()
  {
    return "--"
  }

  this.query = function()
  {
    var parts = window.location.pathname.split("/");
    var hash = window.location.hash.replace("#","");
    return hash;
  }

  this.load = function()
  {
    // replace
  }

  this.history = [];

  this.on_change = function()
  {
    if(this.query() == this.history[this.history.length-2]){
      this.load(this.query());
    }
    this.history.push(this.query());
  }

  window.onclick = function(e){ 
    if(e.target && e.target.className.indexOf("external") == -1){
      if(e.target.localName == "a"){ invoke.vessel.corpse.link(e.target.getAttribute("href").to_url()); e.preventDefault();  } 
      if(e.target.offsetParent && e.target.offsetParent.localName == "a"){ e.preventDefault(); invoke.vessel.corpse.link(e.target.offsetParent.getAttribute("href"));}  
    }
  };

  window.addEventListener("hashchange", () => { this.on_change(); });
}

invoke.seal("core","corpse");
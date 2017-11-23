function Corpse(host)
{
  this.host = host;
  this.styles = ["reset","fonts","main"];
  this.el = document.createElement('yu'); this.el.id = this.host.name;
  this.hd_el = document.createElement('yu'); this.hd_el.id = "hd";
  this.md_el = document.createElement('yu'); this.md_el.id = "md";
  this.fd_el = document.createElement('yu'); this.fd_el.id = "fd";

  this.install = function()
  {
    document.body.appendChild(this.el);
    this.el.appendChild(this.hd_el);
    this.el.appendChild(this.md_el);
    this.el.appendChild(this.fd_el);

    for(var id in this.styles){
      this.install_style(this.styles[id]);
    }
  }

  this.install_style = function(name, is_user_side)
  {
    var href = "links/"+name+'.css';
    var s = document.createElement('link');
    s.rel = 'stylesheet';
    s.type = 'text/css';
    s.href = href;
    document.getElementsByTagName('head')[0].appendChild(s);
  }
}

invoke.seal("core","corpse");
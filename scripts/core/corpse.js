function Corpse(host)
{
  this.host = host;
  this.styles = ["reset","fonts","main"];
  this.el = document.createElement('yu'); this.el.id = this.host.name;
  this.header = document.createElement('yu'); this.header.id = "hd";
  this.md_el = document.createElement('yu'); this.md_el.id = "md";
  this.footer = document.createElement('yu'); this.footer.id = "fd";

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
    return "hello"
  }
}

invoke.seal("core","corpse");
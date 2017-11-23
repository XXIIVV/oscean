function Corpse(host)
{
  this.host = host;
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
  }
}

invoke.seal("core","corpse");
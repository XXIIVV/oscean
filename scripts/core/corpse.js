function Corpse(host)
{
  this.host = host;
  this.el = document.createElement('yu'); this.el.id = this.host.name

  this.install = function()
  {
    document.body.appendChild(this.el);

    console.log("Install corpse")
  }
}

invoke.seal("core","corpse");
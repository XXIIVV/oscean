function Layout(host)
{
  Corpse.call(this,host);

  this.start = function()
  {
    this.el.innerHTML = "Hello"
  }
}

invoke.vessel.seal("corpse","layout");
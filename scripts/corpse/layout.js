function Layout(host)
{
  Corpse.call(this,host);

  this.start = function()
  {
    console.log(this.host.lexicon.find("Home"));
  }
}

invoke.vessel.seal("corpse","layout");
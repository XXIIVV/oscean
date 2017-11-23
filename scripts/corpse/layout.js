function Layout(host)
{
  Corpse.call(this,host);

  this.start = function()
  {
    this.load("Oquonie")
  }

  this.load = function(key)
  {
    var term = this.host.lexicon.find(key)
    console.log(term)
  }
}

invoke.vessel.seal("corpse","layout");
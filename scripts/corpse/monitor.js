function Monitor(logs)
{
  this.el = document.createElement('yu');

  this.update = function(logs)
  {
    console.log(logs[0].time.ago)
  }
}

invoke.vessel.seal("corpse","monitor");

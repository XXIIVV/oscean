function Horaire(list)
{
  this.list = list;

  this.find = function(key,value)
  {
    return new Log(this.list.find(key,value));
  }
}

invoke.vessel.seal("corpse","horaire");
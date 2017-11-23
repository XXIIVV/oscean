function Log(list)
{
  this.list = list;

  this.photo = this.list.pict ? parseInt(this.list.pict) : null;
}

invoke.vessel.seal("corpse","log");
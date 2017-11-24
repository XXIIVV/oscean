function Log(list)
{
  this.list = list;
  this.term = this.list.term;

  this.photo = this.list.pict ? parseInt(this.list.pict) : null;
}

invoke.vessel.seal("corpse","log");
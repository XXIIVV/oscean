function Log(list)
{
  this.list = list;
  this.term = this.list.term;
  this.time = new Desamber(this.list.date);
  this.value = parseInt(this.list.code.slice(3))
  this.sector = ["misc","audio","visual","research"][parseInt(this.list.code.slice(2).substr(0,1))]

  this.photo = this.list.pict ? parseInt(this.list.pict) : null;
}

invoke.vessel.seal("corpse","log");
function Term(name,memory)
{
  this.name = name;
  this.memory = memory;

  this.start = function()
  {
    this.logs = invoke.vessel.horaire.find("term",this.name);
    this.parent = invoke.vessel.lexicon.find(this.memory.unde);
    this.bref = new Runic().markup(this.memory.bref);
    this.long = new Runic(this.memory.long).html;
  }
}

invoke.vessel.seal("corpse","term");
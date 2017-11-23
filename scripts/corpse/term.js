function Term(name,memory)
{
  this.name = name;
  this.memory = memory;
  this.logs = invoke.vessel.horaire.find("term",this.name);
}

invoke.vessel.seal("corpse","term");
function Lexicon(memory)
{
  this.memory = memory;

  this.find = function(key)
  {
    return new Term(this.memory.find(key));
  }
}

invoke.vessel.seal("corpse","lexicon");
function Term(name,memory)
{
  this.name = name;
  this.memory = memory;
  this.diaries = [];
  this.diary = null;

  this.start = function()
  {
    this.logs = invoke.vessel.horaire.find("term",this.name);
    this.diaries = this.find_diaries();

    this.parent = this.memory ? invoke.vessel.lexicon.find(this.memory.unde) : null;
    this.bref = new Runic().markup(this.memory.bref);
    this.long = new Runic(this.memory.long).html;
  }

  this.find_diaries = function()
  {
    var a = [];
    for(id in this.logs){
      var log = this.logs[id];
      if(log.photo){
        a.push(log);
      }
    }
    return a;
  }
}

invoke.vessel.seal("corpse","term");
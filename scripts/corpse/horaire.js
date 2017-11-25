function Horaire(list)
{
  this.list = list;
  this.logs = [];

  this.start = function()
  {
    this.add_logs();
    this.connect_logs();
  }

  this.add_logs = function()
  {
    for(id in this.list.array){
      this.logs.push(new Log(this.list.array[id]))
    }
    console.info("Added "+this.logs.length+" logs.")
  }

  this.connect_logs = function()
  {
    for(id in this.logs){
      var log = this.logs[id];
      invoke.vessel.lexicon.inject_log(log);
      invoke.vessel.lexicon.terms.home.logs.push(log);
    }
  }

  this.find = function(key,value)
  {
    var a = this.list.find(key,value);
    var array = [];
    for(id in a){
      array.push(new Log(a[id]))
    }
    return array;
  }
}

invoke.vessel.seal("corpse","horaire");
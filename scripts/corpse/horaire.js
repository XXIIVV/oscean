function Horaire(list)
{
  this.list = list;
  this.logs = [];

  this.add_logs = function()
  {
    for(id in this.list.array){
      this.logs.push(new Log(this.list.array[id]))
    }
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

  this.find_available = function()
  {
    var photos = {};
    for(id in this.logs){
      var log = this.logs[id];
      photos[log.photo] = log.time;
    }
    var i = 1;
    while(i < 999){
      if(!photos[i]){
        console.log("Available Id:",i);
        return;
      }
      i += 1;
    }
  }

  this.recent = function()
  {
    var a = [];
    for(id in this.logs){
      var log = this.logs[id];
      if(log.time.offset() > 0){ continue; }
      if(a.length > 365){ break; }
      a.push(log);
    }
    return a;
  }

  this.yearly = function(y)
  {
    var a = []
    for(id in this.logs){
      var log = this.logs[id];
      var year = log.time.year;
      if(year != y){ continue; }
      a.push(log);
    }
    return a;
  }

  this.parse = function(logs = this.logs)
  {
    var h = {fh:0,ch:0,topics:{}};

    for(id in logs){
      var log = logs[id];
      h.fh += log.value;
      h.ch += log.vector;
      if(log.term != ""){
        if(!h.topics[log.term]){ h.topics[log.term] = {fh:0,ch:0,count:0}; }
        h.topics[log.term].fh += log.value;
        h.topics[log.term].ch += log.vector;
        h.topics[log.term].count += 1;
      }
    }

    var efec_sum = 0
    var efic_sum = 0
    for(id in h.topics){
      h.topics[id].hdf = h.topics[id].fh/h.topics[id].count;
      h.topics[id].hdc = h.topics[id].ch/h.topics[id].count;
      efec_sum += h.topics[id].hdf
      efic_sum += h.topics[id].hdc
    }

    return {
      fh:(h.fh/logs.length),
      ch:(h.ch/logs.length),
      efec:(efec_sum/Object.keys(h.topics).length),
      efic:(efic_sum/Object.keys(h.topics).length),
      sum:h.fh,
      count:logs.length
    }
  }
}

invoke.vessel.seal("corpse","horaire");
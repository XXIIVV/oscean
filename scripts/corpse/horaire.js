function Horaire(list)
{
  this.list = list;
  this.logs = [];

  this.start = function()
  {
    this.add_logs();
    this.connect_logs();
    this.find_available();
  }

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
      efic:(efic_sum/Object.keys(h.topics).length)
    }
  }
}

invoke.vessel.seal("corpse","horaire");
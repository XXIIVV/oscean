function Log(list)
{
  this.list = list;
  this.term = this.list.term;
  this.name = this.list.name;
  this.text = this.list.text;
  this.time = new Desamber(this.list.date);

  this.code = this.list.code;
  this.rune = this.code.substr(0,1);
  this.sector = ["misc","audio","visual","research"][parseInt(this.code.substr(1,1))]
  this.value  = parseInt(this.code.substr(2,1)) > 0 ? parseInt(this.code.substr(2,1)) : 0;
  this.vector = parseInt(this.code.substr(3,1)) > 0 ? parseInt(this.code.substr(3,1)) : 0;
  
  this.photo = this.list.pict ? parseInt(this.list.pict) : null;

  this.is_featured = this.rune == "!" || this.rune == "~";
  this.is_event = this.rune == "+";
  this.theme = this.rune == "!" ? "blanc" : (this.rune == "~" || this.photo > 0 ? "noir" : "no_photo")
}

function Horaire(logs)
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

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
  this.task   = make_task(parseInt(this.code.substr(1,1)),this.vector)
  
  this.photo = this.list.pict ? parseInt(this.list.pict) : null;

  this.is_featured = this.rune == "!" || this.rune == "~";
  this.is_event = this.rune == "+";
  this.theme = this.rune == "!" ? "blanc" : (this.rune == "~" || this.photo > 0 ? "noir" : "no_photo")

  function make_task(sector,vector)
  {
    if(sector == 1){
      switch(vector) {
        case 1:return "experiment"; break;
        case 2:return "writing"; break;
        case 3:return "rehersal"; break;
        case 4:return "draft"; break;
        case 5:return "composition"; break;
        case 6:return "mastering"; break;
        case 7:return "mastering"; break;
        case 8: return "release"; break;
        case 9: return "performance"; break;
        default: return "audio"
      }
    }
    if(sector == 2){
      switch(vector) {
        case 1:return "concept"; break;
        case 2:return "concept"; break;
        case 3:return "design"; break;
        case 4:return "layout"; break;
        case 5:return "sketch"; break;
        case 6:return "sketch"; break;
        case 7:return "composition"; break;
        case 8: return "render"; break;
        case 9: return "showcase"; break;
        default: return "visual"
      }
    }
    if(sector == 3){
      switch(vector) {
        case 1:return "research"; break;
        case 2:return "planning"; break;
        case 3:return "design"; break;
        case 4:return "testing"; break;
        case 5:return "tools"; break;
        case 6:return "architecture"; break;
        case 7:return "update"; break;
        case 8: return "build"; break;
        case 9: return "application"; break;
        default: return "research"
      }
    }
    return "misc"
  }
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

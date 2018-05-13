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
  this.is_event = this.rune == "+" || this.vector > 9;
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
        case 2:return "sketch"; break;
        case 3:return "layout"; break;
        case 4:return "prototype"; break;
        case 5:return "layout"; break;
        case 6:return "draft"; break;
        case 7:return "render"; break;
        case 8: return "release"; break;
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
        case 8: return "release"; break;
        case 9: return "presentation"; break;
        default: return "research"
      }
    }
    if(sector == 4){
      switch(vector) {
        case 1:return "--"; break;
        case 2:return "--"; break;
        case 3:return "--"; break;
        case 4:return "--"; break;
        case 5:return "--"; break;
        case 6:return "--"; break;
        case 7:return "--"; break;
        case 8: return "--"; break;
        case 9: return "travel"; break;
        default: return "research"
      }
    }
    return "misc"
  }
}

function Horaire(logs)
{
  var h = {fh:0,ch:0,topics:{},osc:{sum:0,average:0},sectors:{audio:0,visual:0,research:0,sum:0}};

  for(id in logs){
    var log = logs[id];
    h.fh += log.value;
    h.ch += log.vector;
    h.osc.sum += Math.abs(log.value-log.vector)
    if(log.sector){
      h.sectors[log.sector] += (log.value+log.vector)/2
      h.sectors.sum += (log.value+log.vector)/2
    }
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

  h.osc = h.osc.sum/logs.length

  var audio = (h.sectors.audio/h.sectors.sum)*10
  var visual = (h.sectors.visual/h.sectors.sum)*10
  var research = (h.sectors.research/h.sectors.sum)*10
  var balance = (1 - ((Math.abs(3.3333 - audio) + Math.abs(3.3333 - visual) + Math.abs(3.3333 - research))/13.3333)) * 10
  
  return {
    fh:(h.fh/logs.length),
    ch:(h.ch/logs.length),
    efec:(efec_sum/Object.keys(h.topics).length),
    efic:(efic_sum/Object.keys(h.topics).length),
    focus:((efec_sum/Object.keys(h.topics).length)+(efic_sum/Object.keys(h.topics).length))/2,
    sum:h.fh,
    count:logs.length,
    osc:h.osc,
    sectors:{audio:audio,visual:visual,research:research},
    balance:balance
  }
}

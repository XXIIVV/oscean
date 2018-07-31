function Horaire(logs)
{
  var h = {fh:0,ch:0,topics:{},tasks:{},osc:{sum:0,average:0},sectors:{audio:0,visual:0,research:0,sum:0},span:0};

  h.span = logs.length > 1 && logs[0].time ? logs[0].time.offset(logs[logs.length-1].time) : 0
  
  for(id in logs){
    var log = logs[id];
    h.fh += log.value;
    h.ch += log.vector;
    h.osc.sum += Math.abs(log.value-log.vector)
    h.tasks[log.task] = h.tasks[log.task] ? h.tasks[log.task]+log.value : log.value
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

  var audio = h.sectors.audio > 0 ? (h.sectors.audio/h.sectors.sum)*10 : 0
  var visual = h.sectors.visual > 0 ? (h.sectors.visual/h.sectors.sum)*10 : 0
  var research = h.sectors.research ? (h.sectors.research/h.sectors.sum)*10 : 0
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
    tasks:h.tasks,
    balance:balance,
    span:h.span,
    attention:logs.length/h.span,
  }
}

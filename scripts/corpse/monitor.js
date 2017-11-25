function Monitor(logs)
{
  this.el = document.createElement('yu'); this.el.id = "monitor"
  this.lod = 75.0;
  this.height = 50;
  this.seg = [];

  var i = 0;
  while(i <= this.lod){
    this.el.appendChild(this.seg[i] = document.createElement('bar'))
    this.seg[i].style.right = (i*2)+"px";
    i += 1;
  }

  this.update = function(logs)
  {
    if(logs.length < 1){ this.el.className = "inactive"; return; }

    this.el.className = "active";

    var segments = this.parse(logs);

    // Find Max
    var max = 0;
    for(id in segments){
      max = segments[id] > max ? segments[id] : max;
    }
    // Draw
    var i = 0
    while(i < this.lod){
      var s = (segments[i]/max);
      var soft_s = ((segments[i-1] ? (segments[i-1]/max) : 0) + (segments[i+1] ? (segments[i+1]/max) : 0) + s)/3
      this.seg[i].style.height = soft_s > 0 ? parseInt(soft_s * this.height)+"px" : "1px";
      i += 1
    }
  }

  this.parse = function(logs)
  {
    var segments = {};
    var range = {from:logs[logs.length-1].time.ago,to:logs[0].time.ago};
    for(id in logs){
      var log = logs[id];
      var pos = (log.time.ago - range.to)/(range.from - range.to)
      var level = pos * this.lod;
      var level_prev = Math.floor(level)
      var level_next = Math.ceil(level)
      var distr_prev = level_next - level
      var distr_next = 1 - distr_prev
      if(!segments[level_prev]){ segments[level_prev] = 0; }
      if(!segments[level_next]){ segments[level_next] = 0; }
      segments[level_prev] += parseFloat(log.value) * distr_prev
      segments[level_next] += parseFloat(log.value) * distr_next
    }
    return segments;
  }
}

invoke.vessel.seal("corpse","monitor");

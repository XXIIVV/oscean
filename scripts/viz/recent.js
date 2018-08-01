function RecentViz(logs,settings = {size:{width:730,height:125}})
{
  this.logs = logs;
  this.settings = settings;

  this.parse = function(logs, parts = 29)
  {
    var limit = logs[logs.length-1].time.offset() * -1
    var h = {}
    for(id in logs){
      var log = logs[id];
      var offset = log.time.offset();
      var pos = parts - (((offset*-1)/limit) * parts);
      var share = (pos-Math.floor(pos))

      if(!h[Math.floor(pos)]){ h[Math.floor(pos)] = {}; }
      if(!h[Math.floor(pos)][log.sector]){ h[Math.floor(pos)][log.sector] = 0; }
      if(!h[Math.ceil(pos)]){ h[Math.ceil(pos)] = {}; }
      if(!h[Math.ceil(pos)][log.sector]){ h[Math.ceil(pos)][log.sector] = 0; }

      h[Math.floor(pos)][log.sector] += ((log.fh + log.ch)/2) * (1-share)
      h[Math.ceil(pos)][log.sector] += ((log.fh + log.ch)/2) * share
    }
    return h
  }

  this.draw = function()
  {
    var segments = this.parse(this.logs);

    var cell = 13 * 2

    var paths = {}
    var last = {}
    for(id in segments){

      var sectors = { 
        audio:segments[id].audio ? segments[id].audio : 0,
        visual:segments[id].visual ? segments[id].visual : 0,
        research:segments[id].research ? segments[id].research : 0
      };

      for(name in sectors){
        var value = sectors[name] ? sectors[name] : 0;
        if(name == "audio"){ value = (sectors.audio ? sectors.audio : 0); }
        if(name == "visual"){ value = (sectors.audio ? sectors.audio : 0) + (sectors.visual ? sectors.visual : 0); }
        if(name == "research"){ value = (sectors.audio ? sectors.audio : 0) + (sectors.visual ? sectors.visual : 0) + (sectors.research ? sectors.research : 0); }

        var x = (parseInt(id)-1) * cell
        var y = this.settings.size.height - value.toFixed(2)

        if(!paths[name]){ paths[name] = `M0,${this.settings.size.height} L0,${y} ` }
        else{ paths[name] += `L${x},${y} L${x + 13},${y} ` }

        last[name] = {x:x,y:y}
      }
    }

    return `
    <svg class='graph recent'>
      <path class='research' d='${paths.research} L${last.research.x},${last.research.y} L${this.settings.size.width},${last.research.y} L${this.settings.size.width},${this.settings.size.height} Z'/>
      <path class='visual' d='${paths.visual} L${last.visual.x},${last.visual.y} L${this.settings.size.width},${last.visual.y} L${this.settings.size.width},${this.settings.size.height} Z'/>
      <path class='audio' d='${paths.audio} L${last.audio.x},${last.audio.y} L${this.settings.size.width},${last.audio.y} L${this.settings.size.width},${this.settings.size.height} Z'/>
      <text x='0' y='15'>${logs[logs.length-1].time.offset_format()}</text>
      <text x='${this.settings.size.width}' y='15' style='text-anchor:end'>Today</text>
    </svg>`
  }

  this.style = function()
  {
    return `
    <style>
      svg.graph.recent { border-bottom:1.5px solid black; width:${this.settings.size.width}px; height:${this.settings.size.height}px; margin-bottom:30px; padding-bottom:30px}
      svg.graph.recent text { stroke:none; fill:#000; font-size:11px; font-family:'archivo_bold' }
      svg.graph.recent path { fill:none; stroke-width:5px; stroke:none; stroke-linejoin:round }
      svg.graph.recent path.audio { fill:#72dec2; stroke:#72dec2; }
      svg.graph.recent path.visual { fill:#51a196; stroke:#51a196; }
      svg.graph.recent path.research { fill:#316067; stroke:#316067; }
    </style>
    `
  }

  this.toString = function()
  {
    return this.draw()+this.style()
  }
}
function BarViz(logs)
{
  this.logs = []

  // Only keep the last 10 years
  for(id in logs){
    var log = logs[id]
    var offset = log.time.offset;
    if(offset > 0){ continue; }
    if(offset < -365 * 10){ continue; }
    this.logs[this.logs.length] = log;
  }

  this.parse = function(logs, parts = 51)
  {
    var limit = logs[logs.length-1].time.offset * -1
    var h = {}
    for(id in logs){
      var log = logs[id];
      var offset = log.time.offset;
      var pos = parts - (((offset*-1)/limit) * parts);
      var share = (pos-Math.floor(pos))

      if(!h[Math.floor(pos)]){ h[Math.floor(pos)] = {audio:0,visual:0,research:0}; }
      if(!h[Math.ceil(pos)]){ h[Math.ceil(pos)] = {audio:0,visual:0,research:0}; }
      if(!h[Math.floor(pos)][log.sector]){ h[Math.floor(pos)][log.sector] = 0; }
      if(!h[Math.ceil(pos)][log.sector]){ h[Math.ceil(pos)][log.sector] = 0; }

      h[Math.floor(pos)][log.sector] += ((log.fh + log.ch)/2) * (1-share)
      h[Math.ceil(pos)][log.sector] += ((log.fh + log.ch)/2) * share
    }
    return h
  }

  this.draw = function()
  {
    var segments = this.parse(this.logs);
    var html = ""

    var cell = 13
    var mod = 0.18
    for(id in segments){
      var seg = segments[id]
      var x = parseInt(id) * (cell+1);
      var audio_h = clamp(seg.audio * mod,4,100)
      var audio_y = audio_h + 30;
      var visual_h = clamp(seg.visual * mod,4,100)
      var visual_y = (visual_h + audio_y)+0.5;
      var research_h = clamp(seg.visual * mod,4,100)
      var research_y = (research_h + visual_y)+0.5;
      html += `<rect class='audio' x='${x}' y='${125 - audio_y}' width='${cell}' height='${audio_h}' rx="2" ry="2"></rect>`
      html += `<rect class='visual' x='${x}' y='${125 - visual_y}' width='${cell}' height='${visual_h}' rx="2" ry="2"></rect>`
      html += `<rect class='research' x='${x}' y='${125 - research_y}' width='${cell}' height='${research_h}' rx="2" ry="2"></rect>`
    }

    var y = 115
    var recent = new Horaire(Object.values(this.logs));

    html += `
    <text x='${2}' y='${-15}' style='text-anchor:start'>${this.logs[this.logs.length-1].time.ago().capitalize()}</text>
    <text x='${730}' y='${-15}' style='text-anchor:end'>${this.logs[0].time.ago().capitalize()}</text>
    <rect class="audio" x="${cell*0}" y="${y}" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell+1)*2}' y='${y+10}' style='text-anchor:start'>Audio ${(recent.sectors.audio*10).toFixed(1)}%</text>
    <rect class="visual" x="${(cell+1)*8}" y="${y}" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell+1)*10}' y='${y+10}' style='text-anchor:start'>Visual ${(recent.sectors.visual*10).toFixed(1)}%</text>
    <rect class="research" x="${(cell+1)*16}" y="${y}" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell+1)*18}' y='${y+10}' style='text-anchor:start'>Research ${(recent.sectors.research*10).toFixed(1)}%</text>
    <text x='725' y='${y+10}' style='text-anchor:end'>${recent.sum.toFixed(0)} Hours</text>`

    return `<svg class='graph bar' style='height:${y}px;'>${html}</svg>`
  }

  this.style = function()
  {
    return `
    <style>
      svg.graph.bar { border-bottom: 1.5px solid #333;display: block;padding: 30px 0px;margin-bottom: 30px; width:730px}
      svg.graph.bar text { stroke:none; fill:#fff; font-size:11px; text-anchor: middle; font-family:'archivo_bold'; fill:#fff;text-transform:capitalize }
      svg.graph.bar rect { stroke:none }
      svg.graph.bar rect:hover { fill:#a1a1a1 !important; cursor:pointer}
      svg.graph.bar rect.audio { fill:#72dec2 }
      svg.graph.bar rect.missing { fill:#ddd }
      svg.graph.bar rect.visual { fill:#51a196 }
      svg.graph.bar rect.research { fill:#316067 }
    </style>
    `
  }

  this.toString = function()
  {
    return this.draw()+this.style()
  }

  function clamp(v, min, max){ return v < min ? min : v > max ? max : v; }
}
function BarViz(logs)
{
  Viz.call(this);

  this.logs = this.slice(logs,-365 * 10,0);

  this.parse = function(logs, parts = 51)
  {
    let limit = logs[logs.length-1].time.offset * -1
    let h = {}
    for(id in logs){
      let log = logs[id];
      let offset = log.time.offset;
      let pos = parts - (((offset*-1)/limit) * parts);
      let share = (pos-Math.floor(pos))

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
    let segments = this.parse(this.logs);
    let html = ""

    let cell = 13
    let mod = 0.18
    for(id in segments){
      let seg = segments[id]
      let x = parseInt(id) * (cell+1);
      let audio_h = clamp(seg.audio * mod,4,100)
      let audio_y = audio_h + 30;
      let visual_h = clamp(seg.visual * mod,4,100)
      let visual_y = (visual_h + audio_y)+0.5;
      let research_h = clamp(seg.visual * mod,4,100)
      let research_y = (research_h + visual_y)+0.5;
      html += `<rect class='audio' x='${x}' y='${125 - audio_y}' width='${cell}' height='${audio_h}' rx="2" ry="2"></rect>`
      html += `<rect class='visual' x='${x}' y='${125 - visual_y}' width='${cell}' height='${visual_h}' rx="2" ry="2"></rect>`
      html += `<rect class='research' x='${x}' y='${125 - research_y}' width='${cell}' height='${research_h}' rx="2" ry="2"></rect>`
    }

    html += this.legend(this.logs);

    return `<svg class='viz'>${html}</svg>`
  }

  function clamp(v, min, max){ return v < min ? min : v > max ? max : v; }
}
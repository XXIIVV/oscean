'use strict';

function BarViz(logs)
{
  Viz.call(this,logs,-365 * 10,0);

  this.parse = function(logs, parts = 51)
  {
    const limit = logs[logs.length-1].time.offset * -1
    const h = {}
    for(const id in logs){
      const log = logs[id];
      const offset = log.time.offset;
      const pos = parts - (((offset*-1)/limit) * parts);
      const share = (pos-Math.floor(pos))

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
    const segments = this.parse(this.logs);
    const cell = 13
    const mod = 0.18
    return Object.keys(segments).reduce((acc,val,id) => {
      const seg = segments[val]
      const x = parseInt(id) * (cell+1);
      const audio_h = clamp(seg.audio * mod,4,100)
      const audio_y = audio_h + 30;
      const visual_h = clamp(seg.visual * mod,4,100)
      const visual_y = (visual_h + audio_y)+0.5;
      const research_h = clamp(seg.visual * mod,4,100)
      const research_y = (research_h + visual_y)+0.5;
      return `${acc}
      <rect class='audio' x='${x}' y='${125 - audio_y}' width='${cell}' height='${audio_h}' rx="2" ry="2"></rect>
      <rect class='visual' x='${x}' y='${125 - visual_y}' width='${cell}' height='${visual_h}' rx="2" ry="2"></rect>
      <rect class='research' x='${x}' y='${125 - research_y}' width='${cell}' height='${research_h}' rx="2" ry="2"></rect>`
    },"")
  }

  function clamp(v, min, max){ return v < min ? min : v > max ? max : v; }
}
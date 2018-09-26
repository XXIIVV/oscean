'use strict';

function Viz()
{
  let cell = 13;

  this.slice = function(logs,from,to)
  {
    let a = []
    for(let id in logs){
      let log = logs[id];
      if(log.time.offset < from){ continue; }
      if(log.time.offset > to){ continue; }
      a.push(log)
    }
    return a
  }

  this.legend = function(logs)
  {
    let html = ""

    let y = 115

    // Top
    html += `
    <text x='${2}' y='${-15}' style='text-anchor:start'>${logs[logs.length-1].time.ago().capitalize()}</text>
    <text x='${730}' y='${-15}' style='text-anchor:end'>${logs[0].time.ago().capitalize()}</text>`

    // Below
    let horaire = new Horaire(logs);
    html += `
    <rect class="audio" x="${cell*0}" y="${y}" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell+1)*2}' y='${y+10}' style='text-anchor:start'>Audio ${(horaire.sectors.audio*10).toFixed(1)}%</text>
    <rect class="visual" x="${(cell+1)*8}" y="${y}" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell+1)*10}' y='${y+10}' style='text-anchor:start'>Visual ${(horaire.sectors.visual*10).toFixed(1)}%</text>
    <rect class="research" x="${(cell+1)*16}" y="${y}" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell+1)*18}' y='${y+10}' style='text-anchor:start'>Research ${(horaire.sectors.research*10).toFixed(1)}%</text>
    <text x='725' y='${y+10}' style='text-anchor:end'>${horaire.sum.toFixed(0)} Hours</text>`

    return html
  }

  this.toString = function()
  {
    if(this.logs.length < 1){ return '<p>Not enough data to display the infographic.</p>'; }

    return this.draw()
  }
}
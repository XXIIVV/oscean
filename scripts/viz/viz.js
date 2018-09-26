'use strict';

function Viz(logs,from,to)
{
  this.logs = slice(logs,from,to);

  let cell = 13;

  function slice(logs,from,to)
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

  this.draw = function()
  {
    return '';
  }

  this.status = function()
  {
    let data = {recent:[],before:[]}
    let limit = this.logs.length/2

    // Split the last 14 days
    for(let id in logs){
      let log = logs[id]
      let offset = log.time.offset;
      if(offset > 0){ continue; }
      if(offset > -limit){data.recent[data.recent.length] = log; }
      else{ data.before[data.before.length] = log; }
    }

    if(data.recent.length < 3 || data.before.length < 3){ return ''; }

    let recent = new Horaire(data.recent)
    let before = new Horaire(data.before)

    return `
    <line x1='0' y1='${cell * 11.5}' x2='730' y2='${cell * 11.5}'/>
    <text class='display' x='${0}' y='${cell* 16.5}'>${recent.ch.toFixed(2)}</text>
    <text class='display small' x='${cell*7}' y='${cell* 15.1}'>${offset(recent.ch,before.ch)}</text>
    <text class='display small' x='${cell*7}' y='${cell* 16.5}' style='font-family: var(--mono);'>ch/day</text>

    <text class='display' x='${180}' y='${cell* 16.5}'>${recent.fh.toFixed(2)}</text>
    <text class='display small' x='${180+(cell*7)}' y='${cell* 15.1}'>${offset(recent.fh,before.fh)}</text>
    <text class='display small' x='${180+(cell*7)}' y='${cell* 16.5}' style='font-family: var(--mono);'>fh/day</text>

    <text class='display' x='${360}' y='${cell* 16.5}'>${recent.efec.toFixed(2)}</text>
    <text class='display small' x='${360+(cell*7)}' y='${cell* 15.1}'>${offset(recent.efec,before.efec)}</text>
    <text class='display small' x='${360+(cell*7)}' y='${cell* 16.5}' style='font-family: var(--mono);'>efec</text>

    <text class='display' x='${550}' y='${cell* 16.5}'>${recent.efic.toFixed(2)}</text>
    <text class='display small' x='${550+(cell*7)}' y='${cell* 15.1}'>${offset(recent.efic,before.efic)}</text>
    <text class='display small' x='${550+(cell*7)}' y='${cell* 16.5}' style='font-family: var(--mono);'>efic</text>
    `
  }

  function offset(recent,before,trail = 1)
  {
    let print = recent-before > 0 ? `+${(recent-before).toFixed(trail)}` : `${(recent-before).toFixed(trail)}`
    return print != "-0.0" && print != "+0.0" ? print : '0.0'
  }

  this.toString = function()
  {
    if(this.logs.length < 1){ return '<p>Not enough data to display the infographic.</p>'; }

    return `<svg class='viz'>${this.legend(this.logs)}${this.status()}${this.draw()}</svg>`
  }
}
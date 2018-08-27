'use strict';

function ActivityViz(logs)
{
  Viz.call(this);

  this.logs = this.slice(logs,-365,0)

  this.parse = function(logs = this.logs)
  {
    let h = {}
    let i = 0
    for(let id in logs){
      let log = logs[id];
      let offset = log.time.offset;
      if(offset > 0){ continue; }
      if(offset < -364){ break; }
      h[log.time.offset] = log;
    }
    return h
  }

  this.draw = function()
  {
    let data = this.parse();

    let html = ""
    let week = 0
    let cell = parseInt(700/52)
    while(week < 52){
      let x = parseInt(week * (cell+1))
      let day = 0
      let offset = -(365 - (week*7));
      while(day < 7){
        let y = parseInt(day * (cell+1))
        let offset = (365 - (week*7)-(day+1)) * -1
        let log = data[offset+1]
        html += log && log.sector ? `<rect class='${log.sector} ${log.time.offset == 0 ? 'today' : ''}' x='${x}' y='${y}' width='${cell}' height='${cell}' rx="2" ry="2" title='${log.time}' data-goto='${log.term}'></rect>` : `<rect class='missing ${day == 6 && week == 51 ? 'today' : ''}' x='${x}' y='${y}' width='${cell}' height='${cell}' rx="2" ry="2"></rect>`
        html += log && log.photo ? `<circle cx='${x+(cell/2)}' cy='${y+(cell/2)}' r='2.5' class='photo'></circle>` : ''
        html += log && log.is_event ? `<circle cx='${x+(cell/2)}' cy='${y+(cell/2)}' r='2' class='event'></circle>` : ''
        day += 1
      }
      week += 1
    }

    html += this.legend(this.logs);

    return `<svg class='viz'>${html}</svg>`
  }
}
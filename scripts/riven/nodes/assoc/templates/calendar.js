'use strict';

function CalendarTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240"

  function make_cell(log,dec,event,task)
  {
    return`
    <td class='${event ? 'event' : ''} ${log.fh > 0 ? log.sector : ''}'>
      <span class='date'>${dec.m}${dec.d}</span>
      ${event ? `<span class='event'>${event.name}</span>` : task ? `<span class='task'><b>${task.term}</b> ${task.name}</span>` : ''}
    </td>`
  }

  this.calendar = function(logs,issues)
  {
    // Sort issues by sector
    let tasks = {}
    for(let id in issues){
      if(!tasks[issues[id].sector]){ tasks[issues[id].sector] = []; }
      tasks[issues[id].sector].push(issues[id]);
    }

    let html = ""
    let offset = 0
    let w = 0
    let upcoming = find_upcoming(logs);
    let date = new Date();
    
    let task_ids = {audio:0,visual:0,research:0}
    while(w < 7){
      let d = 0;
      let d_html = ""
      while(d < 7){
        date.setDate(date.getDate()+1)
        let dec = date.desamber();
        let forecast_log = new Forecast(logs);
        let event = upcoming[`${dec}`]
        let task;
        if(forecast_log.fh > 0 && !event){
          task = find_task(tasks,forecast_log.sector,task_ids[forecast_log.sector]);
          task_ids[forecast_log.sector] += 1;  
        }
        d_html += make_cell(forecast_log,dec,event,task)
        logs = [forecast_log].concat(logs)
        offset++;
        d++;
      }
      html += `<tr>${d_html}</tr>`
      w++;
    }
    return `<table class='cells' style='margin-top:30px'>${html}</table>`
  }

  function find_upcoming(logs)
  {
    let h = {}
    for(let id in logs){
      let log = logs[id];
      if(log.time.offset < 0){ continue; }
      h[`${log.time}`] = log;
    }
    return h;
  }

  function find_task(tasks,sector,id)
  {
    return tasks[sector] && tasks[sector][id] ? tasks[sector][id] : null;
  }

  this.answer = function(q)
  {
    return `${new BalanceViz(q.tables.horaire)}${this.calendar(q.tables.horaire,q.tables.issues)}${q.result}`
  }
}
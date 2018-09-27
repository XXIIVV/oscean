'use strict';

function CalendarTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240"

  function make_tasks(issues)
  {
    let h = {}
    for(let id in issues){
      if(!h[issues[id].sector]){ h[issues[id].sector] = []; }
      h[issues[id].sector].push(issues[id]);
    }
    return h
  }

  function make_upcomings(logs)
  {
    let h = {}
    for(let id in logs){
      let log = logs[id];
      if(log.time.offset < 0){ continue; }
      h[`${log.time}`] = log;
    }
    return h
  }

  function make_forecasts(logs,tasks,upcomings)
  {
    let h = {}
    let day = 0
    let ids = {audio:0,visual:0,research:0,misc:0}
    while(day < 49){
      let dec = date_from_offset(day).desamber();
      let log = new Forecast(logs)
      let event = upcomings[`${dec}`];
      let task = !event && log.fh > 0 ? find_task(tasks,ids,log.sector) : null;
      h[`${dec}`] = { event:event, sector:log.fh > 0 ? log.sector : 'misc', fh:log.fh, task: task }
      logs = [log].concat(logs)
      day++;
    }
    return h
  }

  function find_task(tasks,ids,sector)
  {
    let id = ids[sector]
    let task = tasks[sector][id]
    ids[sector]++;
    return task
  }

  function date_from_offset(offset)
  {
    let d = new Date();
    d.setDate(d.getDate()+offset);
    return d
  }

  function _cell(dec,f)
  {
    return`
    <td class='${f.event ? 'event' : ''} ${f.sector}'>
      <span class='date'>${dec.m}${dec.d}</span>
      ${f.event ? `<span class='event'>${f.event.name}</span>` : f.task ? `<span class='task'><b>${f.task.term}</b> ${f.task.name}</span>` : ''}
    </td>`
  }

  function _calendar(forecast)
  {
    let html = ""
    let offset = 0
    let w = 0
    while(w < 7){
      let d = 0;
      let d_html = ""
      while(d < 7){
        let dec = date_from_offset(offset).desamber();
        d_html += _cell(dec,forecast[`${dec}`])
        offset++;
        d++;
      }
      html += `<tr>${d_html}</tr>`
      w++;
    }
    return `<table class='cells' style='margin-top:30px'>${html}</table>`
  }

  this.answer = function(q)
  {
    let tasks = make_tasks(q.tables.issues);
    let upcomings = make_upcomings(q.tables.horaire)    
    let forecast = make_forecasts(q.tables.horaire,tasks,upcomings)

    return `
    ${new BalanceViz(q.tables.horaire)}
    ${_calendar(forecast)}
    ${q.result}
    `
  }
}
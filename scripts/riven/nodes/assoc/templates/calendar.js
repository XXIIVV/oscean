'use strict'

function CalendarTemplate (id, rect, ...params) {
  Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  function make_tasks (issues) {
    const h = {}
    for (const id in issues) {
      if (!h[issues[id].sector]) { h[issues[id].sector] = [] }
      h[issues[id].sector].push(issues[id])
    }
    return h
  }

  function make_upcomings (logs) {
    const h = {}
    for (const id in logs) {
      const log = logs[id]
      if (log.time.offset < 0) { continue }
      h[`${log.time}`] = log
    }
    return h
  }

  function make_forecasts (logs, tasks, upcomings) {
    const h = {}
    let day = 0
    const ids = { audio: 0, visual: 0, research: 0, misc: 0 }
    while (day < 49) {
      const dec = date_from_offset(day).desamber()
      const log = new Forecast(logs)
      const event = upcomings[`${dec}`]
      const task = !event && log.fh > 0 ? find_task(tasks, ids, log.sector) : null
      h[`${dec}`] = { event: event, sector: log.fh > 0 ? log.sector : 'misc', fh: log.fh, task: task }
      logs = [log].concat(logs)
      day++
    }
    return h
  }

  function find_task (tasks, ids, sector) {
    const id = ids[sector]
    const task = tasks[sector][id]
    ids[sector]++
    return task
  }

  function date_from_offset (offset) {
    const d = new Date()
    d.setDate(d.getDate() + offset)
    return d
  }

  function _cell (dec, f, filter) {
    const link = f.event ? f.event.term : f.task ? f.task.term : null
    const cl = `${f.event ? 'event' : ''} ${f.sector} ${filter && link && filter.to_url() != link.to_url() ? 'disabled' : ''}`

    return `
    <td class='${cl}' ${link ? `data-goto='${link.to_url()}:calendar'` : ''}>
      <span class='date'>${dec.m}${dec.d}</span>
      ${f.event ? `<span class='event'>${f.event.name}</span>` : f.task ? `<span class='task'><b>${f.task.term}</b> ${f.task.name}</span>` : ''}
    </td>`
  }

  function _style () {
    return `
    <style>
      #view #core #content table.cells { background:transparent; width:100%; max-width: 730px; padding:0px; font-family: var(--font) }
      #view #core #content table.cells tr td { margin:5px; height:100px; color:#000; position: relative; border-bottom:1.5px solid #333; }
      #view #core #content table.cells tr td:hover { border-bottom-color: #000 !important; cursor: pointer; }
      #view #core #content table.cells tr td:hover span.date { color:#000; }
      #view #core #content table.cells tr td.event { border-bottom-color:white !important;}
      #view #core #content table.cells tr td.audio { border-bottom-color: var(--color_1) }
      #view #core #content table.cells tr td.visual { border-bottom-color: var(--color_2) }
      #view #core #content table.cells tr td.research { border-bottom-color: var(--color_3) }
      #view #core #content table.cells tr td.disabled span.event { opacity:0.25; }
      #view #core #content table.cells tr td.disabled span.task { opacity:0.25; }
      #view #core #content table.cells tr td span.date { position: absolute; top:5px; left:0px; font-size:12px; font-family: var(--mono); color:#666; }
      #view #core #content table.cells tr td span.event { position: absolute;top: 30px;left: 0px;font-size: 12px;font-family: var(--font_b);line-height: 15px; padding-right:10px; }
      #view #core #content table.cells tr td span.task { position: absolute;top: 30px;left: 0px;font-size: 12px;font-family: var(--font_m);line-height: 15px; padding-right:10px; height:60px;overflow: hidden }
      #view #core #content table.cells tr td span.task b { font-family: var(--font_b) }
    </style>`
  }

  function _calendar (forecast, filter = null) {
    let html = ''
    let offset = 0
    let w = 0
    while (w < 7) {
      let d = 0
      let d_html = ''
      while (d < 7) {
        let dec = date_from_offset(offset).desamber()
        d_html += _cell(dec, forecast[`${dec}`], filter)
        offset++
        d++
      }
      html += `<tr>${d_html}</tr>`
      w++
    }
    return `<table class='cells' style='margin-top:30px'>${html}</table>${_style()}`
  }

  this.answer = function (q) {
    const tasks = make_tasks(q.tables.issues)
    const upcomings = make_upcomings(q.tables.horaire)
    const forecast = make_forecasts(q.tables.horaire, tasks, upcomings)
    const filter = q.result && q.result.name.toLowerCase() != 'calendar' ? q.result.name : null

    return `
    ${new BalanceViz(q.tables.horaire)}
    ${_calendar(forecast, filter)}
    ${q.result.body()}
    `
  }
}

'use strict'

RIVEN.lib.Analytics = function DefaultTemplate (id, rect, ...params) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  // Tracker

  function sort_issues (issues) {
    const h = {}
    for (const id in issues) {
      const issue = issues[id]
      const term = issue.term.toLowerCase()
      if (!h[term]) { h[term] = {} }
      if (!h[term][issue.category]) { h[term][issue.category] = [] }
      h[term][issue.category].push(issue)
    }
    return h
  }

  function _term_issues (issues) {
    return `<h2>${Object.keys(issues).length} Active Projects</h2>${Object.keys(issues).reduce((acc, category) => {
      return `${acc}<h3>${category}</h3><div style='margin-bottom:30px'>${issues[category].reduce((acc, issue) => {
        return `${acc}${issue}`
      }, '')}</div>`
    }, '')}`
  }

  function _all_issues (issues) {
    return `
    <h2 style='margin-top:30px'>${Object.keys(issues).length} Active Projects</h2>
      ${Object.keys(issues).reduce((acc, term) => {
    return `${acc}<h3><a data-view='${term.toUrl()}:tracker' href='#${term.toUrl()}:tracker'>${term}</a></h3><div style='margin-bottom:30px'>${Object.keys(issues[term]).reduce((acc, category) => {
      return `${acc}${issues[term][category].reduce((acc, issue) => {
        return `${acc}${issue}`
      }, '')}`
    }, '')}</div>`
  }, '')}`
  }

  this._tracker = function (q) {
    if (!q.result || (q.target !== 'tracker' && q.result.issues.length < 1)) {
      return `<p>There are no issues for ${q.target}.</p>`
    }

    const issues = q.target === 'tracker' ? q.tables.issues : q.result ? q.result.issues : []
    const sorted_issues = sort_issues(issues)

    return q.target === 'tracker' ? `${new BarViz(q.tables.horaire)}${_all_issues(sorted_issues)}` : q.result && q.result.issues.length > 0 ? `${_term_issues(sorted_issues[q.result.name.toLowerCase()])}` : ''
  }

  // Calendar

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
      const des = date_from_offset(day).desamber()
      const log = new Forecast(logs)
      const event = upcomings[`${des}`]
      const task = !event && log.fh > 0 ? find_task(tasks, ids, log.sector) : null
      h[`${des}`] = { event: event, sector: log.fh > 0 ? log.sector : 'misc', fh: log.fh, task: task }
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

  function _cell (des, f, filter) {
    const link = f.event ? f.event.term : f.task ? f.task.term : null
    const cl = `${f.event ? 'event' : ''} ${f.sector} ${filter && link && filter.toUrl() !== link.toUrl() ? 'disabled' : ''}`
    return `
    <td class='${cl}' ${link ? `data-view='${link.toUrl()}:calendar'` : ''}>
      <span class='date'>${des.m}${des.d}</span>
      ${f.event ? `<span class='event'>${f.event.name}</span>` : f.task ? `<span class='task'><b>${f.task.term}</b> ${f.task.name}</span>` : ''}
    </td>`
  }

  function _style () {
    return `
    <style>
      #view #core #content table.cells { background:transparent; width:100%; max-width: 730px; padding:0px; font-family: var(--font) }
      #view #core #content table.cells tr td { margin:5px; height:100px; color:#000; position: relative; border-bottom:1.5px solid #333; width: calc(100% / 7); }
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
        let des = date_from_offset(offset).desamber()
        d_html += _cell(des, forecast[`${des}`], filter)
        offset++
        d++
      }
      html += `<tr>${d_html}</tr>`
      w++
    }
    return `<table class='cells' style='margin-top:30px'>${html}</table>${_style()}`
  }

  function _timeline (logs) {
    const events = logs.filter((log) => { return log.isEvent })

    return `<ul class='tidy col3' style='margin-top:30px; padding-top:30px; border-top:1.5px solid #333'>${events.reduce((acc, log, id, arr) => {
      return `
      ${acc}
      ${!arr[id - 1] || arr[id - 1].time.y !== log.time.y ? `<li class='head'>20${log.time.y}</li>` : ''}
      <li style='${log.time.offset > 0 ? 'color:#aaa' : ''}'>
        {${log.name}(${log.term})}</a> 
        <span title='${log.time}'>${timeAgo(log.time, 60)}</span>
      </li>`
    }, '')}</ul>`.toCurlic()
  }

  this._calendar = function (q) {
    if (q.result.name != 'CALENDAR') { return '<p>The per-topic calendar is currently under development.</p>' }

    const tasks = make_tasks(q.tables.issues)
    const upcomings = make_upcomings(q.tables.horaire)
    const forecast = make_forecasts(q.tables.horaire, tasks, upcomings)
    const filter = q.result && q.result.name.toLowerCase() !== 'calendar' ? q.result.name : null

    return `
    ${new BalanceViz(q.tables.horaire)}
    ${_calendar(forecast, filter)}
    ${_timeline(q.tables.horaire)}
    `
  }

  // Journal

  this._journal = function (q, upcoming = false) {
    const all_logs = q.target === 'journal' ? q.tables.horaire : q.result.logs

    // Collect only the last 366 logs
    const logs = []
    for (const id in all_logs) {
      const log = all_logs[id]
      if (!log.term) { continue }
      if (log.time.offset > 0 && !upcoming) { continue }
      if (log.time.offset < -366) { continue }
      logs[logs.length] = log
    }

    if (logs.length < 1) {
      return `<p>There is no recent activity to the {(${q.result.name.toCapitalCase()})} project.</p>`.toCurlic()
    }

    // Build journals
    const known = []
    let html = ''
    let i = 0
    for (let id in logs) {
      if (i > 20) { break }
      const log = logs[id]
      if (!log.photo && known.indexOf(log.term) > -1) { continue }
      html += `${log}`
      known.push(log.term)
      i += 1
    }

    return `${new ActivityViz(logs)}${html}`
  }

  this.answer = function (q) {
    return {
      tracker: this._tracker(q),
      calendar: this._calendar(q),
      journal: this._journal(q)
    }
  }
}

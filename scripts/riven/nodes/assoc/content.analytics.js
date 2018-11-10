'use strict'

RIVEN.lib.Analytics = function DefaultTemplate (id, rect, ...params) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  // Tracker

  this._tracker = function (q) {
    const issues = q.target === 'tracker' ? Object.values(q.tables.lexicon).reduce((acc, term) => { acc = acc.concat(term.issues); return acc }, []) : q.result.issues

    if (issues.length < 1) {
      return `<p>There are no issues to the {(${q.result.name.toCapitalCase()})} project.</p>`.toCurlic()
    }

    const html = issues.reduce((acc, key) => { return `${acc}${key}` }, '')
    return `${new BarViz(q.tables.horaire)}${html}`
  }

  // Calendar

  this._calendar = function (q) {
    const events = q.target === 'calendar' ? q.tables.horaire.filter((log) => { return log.isEvent }) : q.result.events

    if (events.length < 1) {
      return `<p>There is no events to the {(${q.result.name.toCapitalCase()})} project.</p>`.toCurlic()
    }

    const html = `<ul class='tidy ${events.length > 20 ? 'col3' : ''}' style='padding-top:30px;'>${events.reduce((acc, log, id, arr) => {
      return `
      ${acc}
      ${!arr[id - 1] || arr[id - 1].time.y !== log.time.y ? `<li class='head'>20${log.time.y}</li>` : ''}
      <li style='${log.time.offset > 0 ? 'color:#aaa' : ''}'>
        {${log.name}(${log.term})}</a> 
        <span title='${log.time}'>${timeAgo(log.time, 60)}</span>
      </li>`
    }, '')}</ul>`.toCurlic()

    return `${new BalanceViz(q.tables.horaire)}${html}`
  }

  // Journal

  this._journal = function (q, upcoming = false) {
    const logs = q.target === 'journal' ? q.tables.horaire : q.result.logs

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
      if (!log.photo && !log.isEvent && known.indexOf(log.term) > -1) { continue }
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

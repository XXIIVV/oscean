'use strict'

RIVEN.lib.tracker = function TrackerTemplate (id, rect, ...params) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  function _timeline (logs) {
    const events = logs.filter((log) => { return log.is_event })

    return `<ul class='tidy col3' style='margin-top:30px'>${events.reduce((acc, log, id, arr) => {
      return `
      ${acc}
      ${!arr[id - 1] || arr[id - 1].time.y != log.time.y ? `<li class='head'>20${log.time.y}</li>` : ''}
      <li style='${log.time.offset > 0 ? 'color:#aaa' : ''}'>
        {${log.name}(${log.term})}</a> 
        <span title='${log.time}'>${log.time.ago(60)}</span>
      </li>`
    }, '')}</ul>`.to_curlic()
  }

  this.answer = function (q) {
    if (q.target == 'tracker') {
      return `${new BarViz(q.tables.horaire)}${_timeline(q.tables.horaire)}`
    }

    const issues = q.tables.issues.filter((issue) => { return issue.host && issue.host.name == q.result.name })

    return `<h2>${issues.length} Active issues</h2><h4>Last updated <b>${q.result.span.to ? q.result.span.to.time.ago() : ''}</b></h4>` + issues.reduce((acc, val) => {
      return `${acc}${val}`
    }, '')
  }
}

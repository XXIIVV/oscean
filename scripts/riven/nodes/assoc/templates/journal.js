'use strict'

RIVEN.lib.Journal = function JournalTemplate (id, rect, ...params) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  this.answer = function (q, upcoming = false) {
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
      return `<p>There is no recent activity to the {(${q.result.name.capitalize()})} project, go {back(${q.result.name.capitalize()})}.</p>`.to_curlic()
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

    return `
    ${new ActivityViz(logs)}
    ${q.result.body()}
    ${html}
    <style>.graph.status { margin-bottom:0px !important }</style>`
  }
}

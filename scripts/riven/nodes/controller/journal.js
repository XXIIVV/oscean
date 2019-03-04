'use strict'

RIVEN.lib.JournalTemplate = function TemplateNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  this.answer = function (q) {
    const logs = q.result && q.result.name === 'JOURNAL' ? q.tables.horaire : q.result ? q.result.activity() : []

    if (logs.length < 1) {
      return `<p>There is no recent activity to the ${q.target.toTitleCase().toLink()} project.</p>`
    }

    const viz = new ActivityViz(logs)
    const known = []
    let html = ''
    let i = 0
    for (let id in logs) {
      if (i > 20) { break }
      const log = logs[id]
      if (!log.pict && !log.isEvent && known.indexOf(log.term) > -1) { continue }
      html += `${log}`
      known.push(log.term)
      i += 1
    }

    return `${viz}${html}`
  }
}

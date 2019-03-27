'use strict'

RIVEN.lib.JournalTemplate = function TemplateNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  this.answer = function (q) {
    const logs = q.result && q.result.name === 'JOURNAL' ? q.tables.horaire : q.result ? q.result.activity() : []

    if (logs.length < 1) {
      return `<p>There is no recent activity to the ${q.target.toTitleCase().toLink()} project.</p>`
    }

    const html = logs.slice(0, 14 * 4).filter(__onlyOnce).slice(0, 20).reduce((acc, log) => {
      return `${acc}${log}`
    }, '')

    return `${new ActivityViz(logs)}${html}`
  }
}

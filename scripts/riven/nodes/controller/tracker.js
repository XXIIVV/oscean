'use strict'

RIVEN.lib.TrackerTemplate = function TemplateNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  this.answer = function (q) {
    const issues = q.result && q.result.name === 'TRACKER' ? Object.values(q.tables.lexicon).reduce((acc, term) => { acc = acc.concat(term.issues); return acc }, []) : q.result ? q.result.issues : []

    if (issues.length < 1) {
      return `<p>There are no issues to the {(${q.target.toTitleCase()})} project.</p>`.toCurlic()
    }

    const viz = new BalanceViz(q.tables.horaire)
    const html = issues.reduce((acc, key) => { return `${acc}${key}` }, '')

    return `${viz}${html}`
  }
}

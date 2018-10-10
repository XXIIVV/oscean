'use strict'

RIVEN.lib.Tracker = function TrackerTemplate (id, rect, ...params) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

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
    return `${acc}<h3><a data-goto='${term.to_url()}:tracker' href='#${term.to_url()}:tracker'>${term}</a></h3><div style='margin-bottom:30px'>${Object.keys(issues[term]).reduce((acc, category) => {
      return `${acc}${issues[term][category].reduce((acc, issue) => {
        return `${acc}${issue}`
      }, '')}`
    }, '')}</div>`
  }, '')}`
  }

  this.answer = function (q) {
    if (!q.result || (q.target != 'tracker' && q.result.issues.length < 1)) {
      return `<p>There are no issues for ${q.target}.</p>`
    }

    const issues = q.target == 'tracker' ? q.tables.issues : q.result ? q.result.issues : []
    const sorted_issues = sort_issues(issues)

    return q.target == 'tracker' ? `${new BarViz(q.tables.horaire)}${_all_issues(sorted_issues)}` : q.result && q.result.issues.length > 0 ? `${_term_issues(sorted_issues[q.result.name.toLowerCase()])}` : ''
  }
}

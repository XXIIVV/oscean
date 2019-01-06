'use strict'

RIVEN.lib.DefaultTemplate = function TemplateNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  this.answer = function (q) {
    if (q.result) { return `${q.result.body()}` }

    const index = Object.keys(Ø('database').index)
    const similar = findSimilar(q.target.toUpperCase(), index)

    return `
    <p>Sorry, there are no pages for {*/${q.target.toTitleCase()}*}, did you mean {(${similar[0].word.toTitleCase()})} or {(${similar[1].word.toTitleCase()})}?</p>
    <p>{*Create this page*} by submitting a {Pull Request(https://github.com/XXIIVV/oscean)}, or if you believe this to be an error, please contact {@neauoire(https://twitter.com/neauoire)}. Alternatively, you locate missing pages from within the {progress tracker(Tracker)}.</p>`.toCurlic()
  }
}

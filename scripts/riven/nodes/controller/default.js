'use strict'

RIVEN.lib.DefaultTemplate = function TemplateNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  this.answer = function (q) {
    if (q.result) { return `${_redirected(q)}${q.result.body()}` }

    const index = Object.keys(Ø('database').index)
    const similar = findSimilar(q.target.toUpperCase(), index)

    return `
    <p>Sorry, there are no pages for <b>${q.target.toTitleCase()}</b>, did you mean ${similar[0].word.toTitleCase().toLink()} or ${similar[1].word.toTitleCase().toLink()}?</p>
    <p><b>Create this page</b> by submitting a ${'https://github.com/XXIIVV/oscean'.toLink('Pull Request', true)}, or if you believe this to be an error, please contact ${'https://twitter.com/neauoire'.toLink('@neauoire', true)}. Alternatively, you locate missing pages from within the ${'Tracker'.toLink('progress tracker')}.</p>`
  }

  function _redirected (q) {
    if (q.target.toUrl() !== q.result.name.toUrl()) {
      return `<div class='notice'>Redirected to ${q.result.name.toTitleCase().toLink()}, from <b>${q.target.toTitleCase()}</b>.</div>`
    }
    return ``
  }
}

'use strict'

RIVEN.lib.Static = function StaticNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L150,120 L240,120 M60,150 L60,150 L240,150 M60,240 L60,240 L150,180 L240,180'

  function win (html) {
    const win = window.open('', 'Static', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=640,height=480,top=' + 100 + ',left=' + (screen.width - (640 * 1.5)))
    win.document.body.innerHTML = `<pre>${html.to_entities()}</pre>`
  }

  function _item (term) {
    return `
    <li>
      <b>${term.name.capitalize()}</b>
      ${term.featured_log ? `(<a href='media/diary/${term.featured_log.photo}.jpg' target='_blank'>jpg</a>)` : ''}
      ${term.span.from && term.span.to ? `[${term.span.from}-${term.span.to}]` : ''}: 
      ${term.bref.to_curlic(term)}
      <ul>${Object.keys(term.links).reduce((acc, val) => { return `${acc}<li><a href='${term.links[val]}' target='_blank'>${val.capitalize()}</a></li>\n` }, ' ')}</ul>
    </li>`
  }

  this.receive = function () {
    const terms = Ø('router').cache.tables.lexicon
    win(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="author" content="Devine Lu Linvega">
  <meta name='description' content='The Nataniev Library(Static).'/>
  <meta name='keywords' content='Aliceffekt, Traumae, Devine Lu Linvega, Lietal, Oquonie, Verreciel, Nataniev, Oscean, Solarpunk' />
  <link rel="alternate"  type="application/rss+xml" title="Feed" href="links/rss.xml" />
  <title>The Nataniev Library — Static</title>
</head>
<body>
  <h1>Oscean</h1>
  <h3>Last Update: ${Ø('router').cache.tables.horaire[0].time}</h3>
  <ul>
    ${Object.keys(terms).sort().reduce((acc, val) => { return `${acc}${_item(terms[val])}` }, '').trim()}
  </ul>
</body>
</html>`)
  }
}

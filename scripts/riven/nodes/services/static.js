'use strict'

RIVEN.lib.Static = function StaticNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L150,120 L240,120 M60,150 L60,150 L240,150 M60,240 L60,240 L150,180 L240,180'

  function win (html) {
    const win = window.open('', 'Static', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=640,height=480,top=' + 100 + ',left=' + (screen.width - (640 * 1.5)))
    win.document.body.innerHTML = `<pre>${html.toEntities()}</pre>`
  }

  function _item (term) {
    const body = term.data.BODY ? term.data.BODY.filter((line) => { return line.substr(0, 1) === '&' || line.substr(0, 1) === '-' || line.substr(0, 1) === '|' || line.substr(0, 1) === '#' }) : ''
    const links = Object.keys(term.links).reduce((acc, val) => { return `${acc}<li><a href='${term.links[val]}' target='_blank'>${val.toTitleCase()}</a></li>\n` }, ' ').trim()
    return `
    <h2>${term.name.toTitleCase()}</h2>
    ${term.parent.name.toTitleCase()}/<b>${term.name.toTitleCase()}</b>${term.featuredLog ? `(<a href='media/diary/${term.featuredLog.pict}.jpg' target='_blank'>jpg</a>)` : ''}${term.span.from && term.span.to ? `[${term.span.from}-${term.span.to}]` : ''}: ${term.bref.toCurlic(term)}
    ${term.data.BODY ? curlic(runic(body)) : ''}
    ${links ? `<ul>${links}</ul>` : ''}
    `
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
  <!-- Twitter -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:site" content="@neauoire">
  <meta name="twitter:title" content="The Nataniev Library">
  <meta name="twitter:description" content="The digital playground and documentation for the projects of Devine Lu Linvega.">
  <meta name="twitter:creator" content="@neauoire">
  <meta name="twitter:image" content="https://wiki.xxiivv.com/media/services/rss.jpg">
  <!-- Facebook -->
  <meta property="og:title" content="The Nataniev Library" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="http://wiki.xxiivv.com/" />
  <meta property="og:image" content="https://wiki.xxiivv.com/media/services/rss.jpg" />
  <meta property="og:description" content="The digital playground and documentation for the projects of Devine Lu Linvega." /> 
  <meta property="og:site_name" content="XXIIVV" />
  <link rel="alternate"  type="application/rss+xml" title="Feed" href="links/rss.xml" />
  <title>The Nataniev Library — Static</title>
</head>
<body style='max-width:600px'>
  <h1>Oscean</h1>
  <h3>Last Update: ${Ø('router').cache.tables.horaire[0].time}</h3>
  ${Object.keys(terms).sort().reduce((acc, val) => { return `${acc}${_item(terms[val])}` }, '').trim()}
</body>
</html>`)
  }
}

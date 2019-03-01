'use strict'

RIVEN.lib.Static = function StaticNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M65,65 L65,65 L245,65 L245,245 L65,245 Z M65,125 L65,125 L245,125 M95,95 L95,95 L95,95 '

  function _item (term) {
    const body = term.data.BODY ? term.data.BODY.filter((line) => { return line.substr(0, 1) === '&' || line.substr(0, 1) === '-' || line.substr(0, 1) === '|' || line.substr(0, 1) === '#' }) : ''
    const links = Object.keys(term.links).reduce((acc, val) => { return `${acc}<a href='${term.links[val]}' target='_blank'>${val.toTitleCase()}</a> ` }, ' ').trim()
    return `<tr><td>${term.name.toTitleCase()}</td><td>${term.parent.name.toTitleCase()}</td><td>${term.span.from && term.span.to ? `[${term.span.from}-${term.span.to}]` : ''}</td><td>${term.bref.toCurlic(term).stripHTML()}</td><td>${links}</td></tr>\n`
  }

  this.receive = function () {
    const terms = Ø('database').cache.lexicon
    return `
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
<body>
  <h1>Oscean</h1>
  <h3>Last Update: ${Ø('database').cache.horaire[0].time}</h3>
  <table style='font-family: courier, monospace; font-size:12px' border='1'>${Object.keys(terms).sort().reduce((acc, val) => { return `${acc}${_item(terms[val])}` }, '').trim()}</table>
</body>
</html>`.toEntities()
  }
}

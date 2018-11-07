'use strict'

RIVEN.create = (append = true) => {
  const lib = RIVEN.lib

  Ø('query').create({ x: 2, y: 0 }, lib.Query)
  Ø('mouse').create({ x: 2, y: 4 }, lib.Mouse)

  Ø('services').create({ x: 6, y: 17 }, lib.Mesh, [
    Ø('rss').create({ x: 0, y: 0 }, lib.Rss),
    Ø('static').create({ x: 3, y: 0 }, lib.Static)
  ])

  Ø('model').create({ x: 6, y: 0 }, lib.Mesh, [
    Ø('router').create({ x: 6, y: 0 }, lib.Router),
    Ø('database').create({ x: 6, y: 4 }, lib.Database),
    Ø('dictionaery').create({ x: 0, y: 8 }, lib.Table, indental, Aeth),
    Ø('lexicon').create({ x: 3, y: 8 }, lib.Table, indental, Term),
    Ø('horaire').create({ x: 6, y: 8 }, lib.Table, tablatal, Log),
    Ø('issues').create({ x: 9, y: 8 }, lib.Table, tablatal, Issue),
    Ø('glossary').create({ x: 12, y: 8 }, lib.Table, indental, List),
    Ø('map').create({ x: 9, y: 4 }, lib.Map)
  ], 'router', 'router')

  Ø('assoc').create({ x: 28, y: 0 }, lib.Mesh, [
    Ø('build').create({ x: 6, y: 0 }, lib.Build),
    Ø('_header').create({ x: 0, y: 4 }, lib.Header),
    Ø('_sidebar').create({ x: 3, y: 4 }, lib.Sidebar),
    Ø('_navi').create({ x: 9, y: 4 }, lib.Navi),
    Ø('_content').create({ x: 6, y: 4 }, lib.Content),
    Ø('missing').create({ x: 3, y: 12 }, lib.Missing),
    Ø('default').create({ x: 3, y: 8 }, lib.Default),
    Ø('journal').create({ x: 6, y: 8 }, lib.Journal),
    Ø('tracker').create({ x: 9, y: 8 }, lib.Tracker),
    Ø('calendar').create({ x: 12, y: 8 }, lib.Calendar)
  ], 'build', 'build')

  Ø('client').create({ x: 50, y: 0 }, lib.Mesh, [
    Ø('view').create({ x: 0, y: 0 }, lib.Document, append),
    Ø('terminal').create({ x: 6, y: 4 }, lib.Terminal),
    Ø('header').create({ x: 0, y: 4 }, lib.Dom),
    Ø('photo').create({ x: 0, y: 8 }, lib.Photo, 'photo'),
    Ø('logo').create({ x: 6, y: 8 }, lib.Dom, 'a', null, { 'data-goto': 'home', href: '#home' }),
    Ø('menu').create({ x: 3, y: 8 }, lib.Dom),
    Ø('search').create({ x: 0, y: 12 }, lib.Input),
    Ø('activity').create({ x: 3, y: 12 }, lib.Dom, 'ul'),
    Ø('info').create({ x: 9, y: 8 }, lib.Dom),
    Ø('glyph').create({ x: 9, y: 12 }, lib.Path),
    Ø('title').create({ x: 6, y: 12 }, lib.Dom),
    Ø('core').create({ x: 12, y: 4 }, lib.Dom),
    Ø('content').create({ x: 12, y: 8 }, lib.Dom),
    Ø('sidebar').create({ x: 15, y: 8 }, lib.Dom),
    Ø('navi').create({ x: 18, y: 8 }, lib.Dom, 'ul'),
    Ø('footer').create({ x: 21, y: 4 }, lib.Dom),
    Ø('credits').create({ x: 21, y: 8 }, lib.Dom, 'div', `
      <a target='_blank' href="https://twitter.com/neauoire" class="icon twitter external"></a>
      <a target='_blank' href="https://github.com/neauoire" class="icon github external"></a>
      <a target='_blank' href="http://webring.xxiivv.com/#random" class="icon rotonde"></a>
      <a target='_blank' href="https://creativecommons.org/licenses/by-nc-sa/4.0/" class="icon cc"></a>
      <a data-goto='devine lu linvega' href='#devine+lu+linvega'>Devine Lu Linvega</a> © ${new Desamber('06I04').toString(true)}—${desamber()}
      <center><a data-goto='About' href='#About'>BY-NC-SA 4.0</a> <span style="color:#ccc"'>${neralie()}</span></center>
      <a target='_blank' href="http://100r.co" class="icon hundredrabbits"></a><hr>
    `)
  ], 'view')

  // // Model
  Ø('router').syphon('database')
  Ø('database').syphon(['dictionaery', 'issues', 'horaire', 'glossary', 'lexicon'])
  Ø('query').connect('model')
  Ø('database').connect('map')
  Ø('model').connect('assoc')

  // // Assoc
  Ø('build').syphon(['_navi', '_content', '_sidebar', '_header'])
  Ø('_content').syphon(['default', 'journal', 'tracker', 'calendar'])
  Ø('default').syphon(['missing'])
  Ø('assoc').connect('client')

  // // Dom
  Ø('header').bind(['photo', 'menu'])
  Ø('menu').bind(['logo', 'info'])
  Ø('info').bind(['glyph', 'title'])
  Ø('menu').bind(['search', 'activity'])
  Ø('view').bind(['header', 'core', 'footer', 'terminal'])
  Ø('core').bind(['sidebar', 'content', 'navi'])
  Ø('footer').bind(['credits'])

  // Start
  Ø('query').bang()
}

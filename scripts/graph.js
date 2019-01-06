'use strict'

RIVEN.create = (append = true) => {
  const lib = RIVEN.lib

  Ø('mouse').create({ x: 2, y: 4 }, lib.Mouse)

  Ø('init').create({ x: 2, y: 0 }, lib.Init)
  Ø('query').create({ x: 8, y: 6 }, lib.Query)

  Ø('model').create({ x: 12, y: 4 }, lib.Mesh, [
    Ø('router').create({ x: 3, y: 0 }, lib.Router),
    Ø('database').create({ x: 0, y: 4 }, lib.Database),
    Ø('dictionaery').create({ x: 12, y: 8 }, lib.Table, indental, Aeth),
    Ø('lexicon').create({ x: 3, y: 8 }, lib.Table, indental, Term),
    Ø('horaire').create({ x: 6, y: 8 }, lib.Table, tablatal, Log),
    Ø('issues').create({ x: 9, y: 8 }, lib.Table, indental, Issue),
    Ø('glossary').create({ x: 0, y: 8 }, lib.Table, indental, List),
    Ø('map').create({ x: 3, y: 4 }, lib.Map)
  ])

  Ø('controller').create({ x: 32, y: 4 }, lib.Mesh, [
    Ø('template').create({ x: 0, y: 0 }, lib.Template),
    Ø(':default').create({ x: 0, y: 4 }, lib.DefaultTemplate),
    Ø(':journal').create({ x: 3, y: 4 }, lib.JournalTemplate),
    Ø(':calendar').create({ x: 6, y: 4 }, lib.CalendarTemplate),
    Ø(':tracker').create({ x: 9, y: 4 }, lib.TrackerTemplate),
    Ø('rss').create({ x: 0, y: 8 }, lib.Rss),
    Ø('static').create({ x: 3, y: 8 }, lib.Static)
  ])

  Ø('view').create({ x: 49, y: 4 }, lib.Mesh, [
    Ø('document').create({ x: 0, y: 0 }, lib.Document, append),
    Ø('terminal').create({ x: 6, y: 4 }, lib.Terminal),
    Ø('header').create({ x: 0, y: 4 }, lib.Dom),
    Ø('photo').create({ x: 0, y: 8 }, lib.Photo, 'photo'),
    Ø('menu').create({ x: 3, y: 8 }, lib.Dom),
    Ø('logo').create({ x: 6, y: 12 }, lib.Dom, 'a', null, { 'data-goto': 'home', href: '#home' }),
    Ø('search').create({ x: 9, y: 12 }, lib.Input),
    Ø('activity').create({ x: 3, y: 12 }, lib.Dom, 'ul'),
    Ø('info').create({ x: 0, y: 12 }, lib.Dom),
    Ø('glyph').create({ x: 3, y: 16 }, lib.Path),
    Ø('title').create({ x: 0, y: 16 }, lib.Dom),
    Ø('core').create({ x: 12, y: 4 }, lib.Dom),
    Ø('content').create({ x: 15, y: 8 }, lib.Dom),
    Ø('main').create({ x: 12, y: 12 }, lib.Dom),
    Ø('tracker').create({ x: 15, y: 12 }, lib.Dom),
    Ø('calendar').create({ x: 18, y: 12 }, lib.Dom),
    Ø('journal').create({ x: 21, y: 12 }, lib.Dom),
    Ø('sidebar').create({ x: 12, y: 8 }, lib.Dom),
    Ø('navi').create({ x: 18, y: 8 }, lib.Dom),
    Ø('footer').create({ x: 21, y: 4 }, lib.Dom),
    Ø('credits').create({ x: 21, y: 8 }, lib.Dom, 'div', `
      <a target='_blank' href="https://twitter.com/neauoire" class="icon twitter external"></a>
      <a target='_blank' href="https://github.com/neauoire" class="icon github external"></a>      
      <a target='_blank' href="https://merveilles.town/@neauoire" class="icon merveilles external"></a>
      <a target='_blank' href="http://webring.xxiivv.com/#random" class="icon rotonde"></a>
      <a target='_blank' href="https://creativecommons.org/licenses/by-nc-sa/4.0/" class="icon cc"></a>
      <a data-goto='devine lu linvega' href='#devine+lu+linvega'>Devine Lu Linvega</a> © ${new Desamber('06I04').toString(true)}—${desamber()}
      <center><a data-goto='About' href='#About'>BY-NC-SA 4.0</a> <span style="color:#ccc"'>${neralie()}</span></center>
      <a target='_blank' href="http://100r.co" class="icon hundredrabbits"></a><hr>
    `)
  ])

  Ø('init').syphon(['database', 'document', 'query'])

  Ø('mouse').connect('query')

  // Model
  Ø('router').syphon('database')
  Ø('router').connect('template')
  Ø('database').syphon(['dictionaery', 'issues', 'horaire', 'glossary', 'lexicon'])
  Ø('query').connect('router')
  Ø('database').connect('map')
  Ø('template').connect('document')

  // Controller
  Ø('template').syphon([':default', ':calendar', ':journal', ':tracker'])

  // Dom
  Ø('header').bind(['photo', 'menu'])
  Ø('menu').bind(['logo', 'info', 'search', 'activity'])
  Ø('info').bind(['glyph', 'title'])
  Ø('document').bind(['terminal', 'header', 'core', 'footer'])
  Ø('core').bind(['sidebar', 'content', 'navi'])
  Ø('content').bind(['main', 'journal', 'tracker', 'calendar'])

  Ø('footer').bind(['credits'])

  // Start
  Ø('init').request()
}

'use strict'

function graph (append = true) {
  Ø('query').create({ x: 2, y: 2 }, RIVEN.lib.query)
  Ø('mouse').create({ x: 2, y: 8 }, RIVEN.lib.mouse)

  Ø('services').mesh({ x: 6, y: 21 }, [
    Ø('rss').create({ x: 2, y: 2 }, RIVEN.lib.rss)
  ])

  Ø('model').mesh({ x: 6, y: 0 }, [
    Ø('router').create({ x: 8, y: 2 }, RIVEN.lib.router),
    Ø('database').create({ x: 8, y: 8 }, RIVEN.lib.database),
    Ø('dictionaery').create({ x: 2, y: 14 }, RIVEN.lib.table, Tablatal, Aeth),
    Ø('lexicon').create({ x: 5, y: 14 }, RIVEN.lib.table, Indental, Term),
    Ø('horaire').create({ x: 8, y: 14 }, RIVEN.lib.table, Tablatal, Log),
    Ø('issues').create({ x: 11, y: 14 }, RIVEN.lib.table, Tablatal, Issue),
    Ø('glossary').create({ x: 14, y: 14 }, RIVEN.lib.table, Indental, List),
    Ø('map').create({ x: 14, y: 8 }, RIVEN.lib.map)
  ])

  Ø('assoc').mesh({ x: 25, y: 0 }, [
    Ø('build').create({ x: 5, y: 2 }, RIVEN.lib.build),
    Ø('_header').create({ x: 2, y: 8 }, RIVEN.lib.header),
    Ø('_sidebar').create({ x: 5, y: 8 }, RIVEN.lib.sidebar),
    Ø('_navi').create({ x: 11, y: 8 }, RIVEN.lib.navi),
    Ø('_content').create({ x: 8, y: 8 }, RIVEN.lib.content),
    Ø('missing').create({ x: 2, y: 20 }, RIVEN.lib.missing),
    Ø('default').create({ x: 2, y: 14 }, RIVEN.lib.default),
    Ø('journal').create({ x: 8, y: 14 }, RIVEN.lib.journal),
    Ø('tracker').create({ x: 11, y: 14 }, RIVEN.lib.tracker),
    Ø('calendar').create({ x: 14, y: 14 }, RIVEN.lib.calendar)
  ])

  Ø('client').mesh({ x: 44, y: 0 }, [
    Ø('view').create({ x: 2, y: 2 }, RIVEN.lib.document, append),
    Ø('terminal').create({ x: 8, y: 8 }, RIVEN.lib.terminal),
    Ø('header').create({ x: 2, y: 8 }, RIVEN.lib.dom),
    Ø('photo').create({ x: 2, y: 14 }, RIVEN.lib.photo, 'photo'),
    Ø('logo').create({ x: 8, y: 14 }, RIVEN.lib.dom, 'a', null, { 'data-goto': 'home', href: '#home' }),
    Ø('menu').create({ x: 5, y: 14 }, RIVEN.lib.dom),
    Ø('search').create({ x: 2, y: 20 }, RIVEN.lib.input),
    Ø('activity').create({ x: 5, y: 20 }, RIVEN.lib.dom, 'ul'),
    Ø('info').create({ x: 11, y: 14 }, RIVEN.lib.dom),
    Ø('glyph').create({ x: 11, y: 20 }, RIVEN.lib.path),
    Ø('title').create({ x: 8, y: 20 }, RIVEN.lib.dom),
    Ø('core').create({ x: 14, y: 8 }, RIVEN.lib.dom),
    Ø('content').create({ x: 14, y: 14 }, RIVEN.lib.dom),
    Ø('sidebar').create({ x: 17, y: 14 }, RIVEN.lib.dom),
    Ø('navi').create({ x: 20, y: 14 }, RIVEN.lib.dom, 'ul'),
    Ø('footer').create({ x: 23, y: 8 }, RIVEN.lib.dom),
    Ø('credits').create({ x: 23, y: 14 }, RIVEN.lib.dom, 'div', `
        <a target='_blank' href="https://twitter.com/neauoire" class="icon twitter external"></a>
        <a target='_blank' href="https://github.com/neauoire" class="icon github external"></a>
        <a target='_blank' href="http://webring.xxiivv.com/#random" class="icon rotonde"></a>
        <a target='_blank' href="https://creativecommons.org/licenses/by-nc-sa/4.0/" class="icon cc"></a>
        <a data-goto='devine lu linvega' href='#devine+lu+linvega'>Devine Lu Linvega</a> © ${new Desamber('06I04').toString(true)}—${new Date().desamber().toString(true)}
        <center><a data-goto='About' href='#About'>BY-NC-SA 4.0</a> <span style="color:#ccc"'>${new Neralie()}</span></center>
        <a target='_blank' href="http://100r.co" class="icon hundredrabbits"></a><hr>
      `)
  ])

  // Model
  Ø('router').syphon('database')
  Ø('database').syphon(['dictionaery', 'issues', 'horaire', 'glossary', 'lexicon'])
  Ø('query').connect('router')
  Ø('database').connect('map')
  Ø('router').connect('build')

  // Assoc
  Ø('build').syphon(['_navi', '_content', '_sidebar', '_header'])
  Ø('_content').syphon(['default', 'journal', 'tracker', 'home', 'calendar'])
  Ø('build').connect(['view'])
  Ø('default').syphon(['missing'])

  // Dom
  Ø('header').bind(['logo', 'photo', 'menu', 'info'])
  Ø('info').bind(['glyph', 'title'])
  Ø('menu').bind(['search', 'activity'])
  Ø('view').bind(['header', 'core', 'footer', 'terminal'])
  Ø('core').bind(['sidebar', 'content', 'navi'])
  Ø('footer').bind(['credits'])

  // Start
  Ø('query').bang()
}

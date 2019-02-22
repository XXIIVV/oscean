'use strict'

RIVEN.lib.Terminal = function TerminalNode (id, rect, ...params) {
  RIVEN.lib.Dom.call(this, id, rect, 'div')

  this.glyph = 'M65,65 L65,65 L245,65 M65,125 L65,125 L245,125 M65,185 L65,185 L245,185 M65,245 L65,245 L245,245 '

  this.bang = function (q) {
    if (q.substr(0, 1) === '~') { q = q.replace('~', '').trim() }

    const cmd = q.split(' ')[0]
    const par = q.substr(cmd.length, q.length - cmd.length).trim()

    if (!cmd) { return }

    this.push('guest', `${cmd}${par ? '(' + par + ')' : ''}`, 125)
    this.push('maeve', `${this.services[cmd] ? this.services[cmd](par).trim() : this.services['unknown'](cmd)}`, 250)

    Ø('search').el.value = '~'
  }

  this.listen = function (q, bang = false) {
    if (q.substr(0, 1) === '~') {
      if (!Ø('terminal').hasClass('active')) {
        Ø('terminal').push('maeve', 'Idle.', 500)
      }
      Ø('terminal').addClass('active')
    } else {
      Ø('terminal').removeClass('active')
    }

    if (bang === true && q.substr(0, 1) === '~') {
      this.bang(q)
    }
  }

  this.push = function (author, txt, delay = 0) {
    setTimeout(() => {
      this.el.innerHTML = `
      <div class='line ${author}'>
        <span class='time'>${neralie()}</span>
        <span class='author'>${author}</span>
        <span class='body'>${txt}</span>
      </div>\n${this.el.innerHTML}`
    }, delay)
  }

  // Services

  this.services =
  {
    help: (q) => {
      return 'Available commands:\n<ul>' + Object.keys(this.services).reduce((acc, val) => { return acc + `<li><i>${val}</i></li>` }, '') + '</ul>'
    },

    time: (q) => {
      return `The local time is <b>${arvelie()} ${neralie()}</b>.`
    },

    age: (q) => {
      return `Devine is <b>${((new Date() - new Date('1986-03-22')) / 31557600000).toFixed(4)} years</b> old.`
    },

    status: (q) => {
      const score = { ratings: 0, entries: 0, average: 0, issues: 0 }
      for (const id in Ø('database').cache.lexicon) {
        score.ratings += Ø('database').cache.lexicon[id].rating()
        score.entries += 1
      }
      return `Oscean is <b>${((score.ratings / score.entries) * 100).toFixed(2)}% Completed</b>.`
    },

    forecast: (q) => {
      const log = new Forecast(Ø('database').cache.horaire)
      return `Forecasted task is ${log.task}(${log.sector}), for a maximum of ${log.fh}fh.`
    },

    hello: (q) => {
      return `Hi.`
    },

    atog: (q) => {
      return `${new Arvelie(q).toGregorian()}`
    },

    gtoa: (q) => {
      return !isNaN(new Date(q)) ? `${new Date(q).arvelie()}` : 'Invalid Date'
    },

    next: (q) => {
      const used = []
      for (const id in Ø('database').cache.horaire) {
        const log = Ø('database').cache.horaire[id]
        if (!log.pict) { continue }
        used.push(log.pict)
      }
      let available = 1
      while (available < 999) {
        if (used.indexOf(available) < 0) { return `The next available diary ID is <b>${available}</b>.` }
        available += 1
      }
      return `There are no available diary IDs under 999.`
    },

    walk: (q) => {
      for (const id in Ø('database').index) {
        Ø('database').index[id].toString()
      }
      return `Done(walked ${Object.keys(Ø('database').index).length} indexes).`
    },

    rss: (q) => {
      return `<textarea>${Ø('rss').receive(q)}</textarea>`
    },

    static: (q) => {
      return `<textarea>${Ø('static').receive(q)}</textarea>`
    },

    twtxt: (q) => {
      return `<textarea>${Ø('twtxt').receive(q)}</textarea>`
    },

    lxtxt: (q) => {
      return `<textarea>${Ø('lxtxt').receive(q)}</textarea>`
    },

    heol: (q) => {
      return `${new Heol(q, Ø('database').cache, null)}`
    },

    otd: (q) => {
      const today = new Date().arvelie()
      const a = []
      const logs = Ø('database').cache.horaire.filter(__onlyEvents).filter(__onlyThisDay)
      if (logs.length < 1) { return `There are no events on this day.` }
      return `<b>On This Day</b>, on ${timeAgo(logs[0].time, 14)}, ${logs[0].host.name.toTitleCase()} — ${logs[0].name}.`
    },

    orphans: (q) => {
      let html = ''
      for (const id in Ø('database').cache.lexicon) {
        const term = Ø('database').cache.lexicon[id]
        if (term.incoming.length < 2) { html += `${term.name}\n` }
      }
      return `<ul>${html}</ul>`
    },

    clear: (q) => {
      this.el.innerHTML = ''
      return ``
    },

    unknown: (q) => {
      return `Unknown command <i>${q}</i>, type <i>help</i> to see available commands.`
    }
  }
}

'use strict'

RIVEN.lib.Terminal = function TerminalNode (id, rect, ...params) {
  RIVEN.lib.Dom.call(this, id, rect, 'div')

  this.glyph = 'M65,65 L65,65 L245,65 M65,125 L65,125 L245,125 M65,185 L65,185 L245,185 M65,245 L65,245 L245,245 '

  this.isBooted = false

  this.bang = function (q) {
    if (q.indexOf('~') < 0) { return }

    const words = q.substr(1).split('+')
    const cmd = words[0]
    const par = words.splice(1).join(' ')

    if (!cmd) { return }

    this.boot()

    this.push('guest', `${cmd}${par ? '(' + par + ')' : ''}`, 125)
    this.push('maeve', `${this.services[cmd] ? this.services[cmd](par) : this.services['unknown'](cmd)}`, 250)

    Ø('search').el.value = '~'
    Ø('terminal').addClass('active')
  }

  this.boot = function () {
    if (this.isBooted === true) { return }
    this.push('maeve', `The local time is ${arvelie()} ${neralie()}.
Today's forecast is <b>${this.services.forecast()}</b>.
Oscean is presently <b>${this.services.progress().toFixed(2)}% Completed</b>.
Devine is now <b>${this.services.age().toFixed(4)} years</b> old.`, 0)
    this.isBooted = true
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

    atog: (q) => {
      return `${new Arvelie(q).toGregorian()}`
    },

    gtoa: (q) => {
      return !isNaN(new Date(q)) ? `${new Date(q).toArvelie()}` : 'Invalid Date'
    },

    litoen: (q) => {
      const res = Ø('asulodeta').find(q, 'name')
      return res ? `The English translation of "${res.childspeak.toLink(res.adultspeak.toTitleCase())}" is "<b>${res.english.toTitleCase()}</b>".` : 'Unknown'
    },

    entoli: (q) => {
      const res = Ø('asulodeta').find(q, 'english')
      return res ? `The Lietal translation of "<b>${q.toTitleCase()}</b>" is "${res.childspeak.toLink(res.adultspeak.toTitleCase())}".` : 'Unknown'
    },

    yleta: (q) => {
      return new Yleta({ name: q }).body()
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
        const target = available.toString(16).toUpperCase()
        if (used.indexOf(target) < 0) { return `The next available diary ID is <b>${target}</b>.` }
        available += 1
      }
      return `There are no available diary IDs under 999.`
    },

    walk: (q) => {
      const time = performance.now()
      for (const id in Ø('database').index) {
        Ø('database').index[id].toString()
      }
      return `Walked ${Object.keys(Ø('database').index).length} indexes, in ${(performance.now() - time).toFixed(2)}ms.`
    },

    rss: (q) => {
      return `<textarea>${Ø('rss').receive(q)}</textarea>`
    },

    static: (q) => {
      return `<textarea>${Ø('static').receive(q)}</textarea>`
    },

    heol: (q) => {
      return `${new Heol(q, null)}`
    },

    age: (q) => {
      return ((new Date() - new Date('1986-03-22')) / 31557600000)
    },

    progress: (q) => {
      const score = { ratings: 0, entries: 0 }
      for (const id in Ø('database').cache.lexicon) {
        score.ratings += Ø('database').cache.lexicon[id].rating()
        score.entries += 1
      }
      return ((score.ratings / score.entries) * 100)
    },

    forecast: (q) => {
      const forecast = new Forecast(Ø('database').cache.horaire)
      return `${forecast.fh}fh of ${forecast.sector} ${forecast.task}`
    },

    otd: (q) => {
      const today = new Date().toArvelie()
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

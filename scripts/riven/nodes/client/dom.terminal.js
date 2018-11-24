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
      return Object.keys(this.services).reduce((acc, val) => { return acc + `— <i>${val}</i> \n` }, 'Available commands:\n')
    },

    time: (q) => {
      return `The current local time is <b>${desamber()} ${neralie()}</b>.`
    },

    hello: (q) => {
      return `Hi.`
    },

    dtog: (q) => {
      return `${new Desamber(q).toGregorian()}`
    },

    gtod: (q) => {
      return !isNaN(new Date(q)) ? `${new Date(q).desamber()}` : 'Invalid Date'
    },

    next: (q) => {
      const used = []
      for (const id in Ø('database').cache.horaire) {
        const log = Ø('database').cache.horaire[id]
        if (!log.photo) { continue }
        used.push(log.photo)
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
      Ø('rss').receive()
      return `Done.`
    },

    static: (q) => {
      Ø('static').receive()
      return `Done.`
    },

    heol: (q) => {
      return `${new Heol(q, Ø('database').cache, null)}`
    },

    otd: (q) => {
      const today = new Date().desamber()
      const a = []
      for (const id in Ø('database').cache.horaire) {
        const log = Ø('database').cache.horaire[id]
        if (log.time.m !== today.m || log.time.d !== today.d) { continue }
        a.push(log)
      }
      let html = 'On This Day:\n'
      for (const id in a) {
        const log = a[id]
        if (!log.term) { continue }
        html += `— <b>${log.time}</b> ${log.isEvent ? '*' : '•'} ${log.term} — ${log.name}\n`
      }
      return html
    },

    age: (q) => {
      return `You are ${((new Date() - new Date('1986-03-22')) / 31557600000).toFixed(4)} years old.`
    },

    status: (q) => {
      const score = { ratings: 0, entries: 0, average: 0, issues: 0 }
      for (const id in Ø('database').cache.lexicon) {
        score.ratings += Ø('database').cache.lexicon[id].rating()
        score.entries += 1
      }
      return `Oscean is ${((score.ratings / score.entries) * 100).toFixed(2)}% Completed.`
    },

    orphans: (q) => {
      let html = ''
      for (const id in Ø('database').cache.lexicon) {
        const term = Ø('database').cache.lexicon[id]
        if (term.incoming.length < 2) { html += `${term.name}\n` }
      }
      return html
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

'use strict'

function Heol (input, tables, host) {
  const lib = {
    match: (source, items) => {
      const filtered = items.filter((val) => { return source[val.toUpperCase()] })
      return filtered.map((val) => { return source[val.toUpperCase()] })
    },
    table: (source) => {
      return tables[source]
    },
    keys: (h) => {
      return Object.keys(h)
    },
    values: (h) => {
      return Object.values(h)
    },
    value: (h, val) => {
      return h[val]
    },
    random: (a) => {
      return a[parseInt(Math.random() * a.length)]
    },
    attribute: (a, name) => {
      return a.map((val) => { return val[name] })
    },
    find: (source, target) => {
      return source[target.toUpperCase()] ? source[target.toUpperCase()] : ''
    },
    echo: (items) => {
      return items.reduce((acc, val) => {
        return `${acc}${val}`
      }, '')
    },
    // -----------------------
    // Time
    // -----------------------
    daysSince: (greg) => {
      return parseInt((Date.now() - new Date(greg)) / 1000 / 86400)
    },
    msSince: (greg) => {
      return Date.now() - new Date(greg)
    },
    // -----------------------
    // Math
    // -----------------------
    add: (...items) => {
      return items.reduce((acc, val) => { return acc + val }, 0)
    },
    sub: (...items) => {
      return items[0] - items[1]
    },
    mul: (...items) => {
      return items.reduce((acc, val) => { return acc === 0 ? val : acc * val }, 0)
    },
    div: (...items) => {
      return items[0] / items[1]
    },
    floor: (item) => {
      return Math.floor(item)
    },
    fix: (...items) => {
      return items[0].toFixed(items[1])
    },
    // -----------------------
    // Arrays
    // -----------------------
    // will modify properties or run a function onto each object.
    map: (arr, fn) => {
      return arr.map((val, id, arr) => fn)
    },
    // will only keeps elements returning true.
    filter: (arr, fn, param) => {
      return arr.filter((val, id, arr) => fn)
    },
    // will reduce it into a single value.
    reduce: (arr, fn, acc) => {
      return arr.reduce((acc, val, id, arr) => fn, acc)
    },
    count: (item) => {
      return item.length
    },
    sort: (a) => {
      return a.sort()
    },
    uniq: (items) => {
      return items.filter((value, index, self) => {
        return self.indexOf(value) === index
      })
    },
    // -----------------------
    // Strings
    // -----------------------
    lc: (item) => {
      return item.toLowerCase()
    },
    cc: (item) => {
      return item.toTitleCase()
    },
    uc: (item) => {
      return item.toUpperCase()
    },
    // -----------------------
    // Templates
    // -----------------------
    template: (items, t, p) => {
      return items.map((val) => {
        return `${t(val, p)}`
      })
    },
    wrap: (item, tag, cl) => {
      return `<${tag} class='${cl || ''}'>${item}</${tag}>`
    },
    INDEX: (item) => {
      return `<h3>{(${item.name.toTitleCase()})}</h3><p>${item.bref}</p><ul class='bullet'>${item.children.reduce((acc, term) => { return `${acc}<li>${term.bref}</li>` }, '')}</ul>`
    },
    LINK: (item) => {
      return `{(${item.toTitleCase()})}`
    },
    REDIRECT: (item) => {
      return `<meta http-equiv="refresh" content="2; url=#${item}">`
    },
    TITLE: (item) => {
      return `<h2>${item.name.toTitleCase()}</h2><h4>${item.bref}</h4>`
    },
    PHOTO: (item) => {
      return host.featuredLog && host.featuredLog.photo !== item.photo ? `<img src="media/diary/${item.photo}.jpg"/>` : ''
    },
    GALLERY: (item) => {
      return `${item.featuredLog ? `<a data-goto='${item.name}'><img src="media/diary/${item.featuredLog.photo}.jpg"/></a>` : ''}<h2>${item.name.toTitleCase()}</h2><h4>${item.bref}</h4>`
    },
    SPAN: (item) => {
      return item.logs.length > 10 && item.span.from && item.span.to ? `<li>{(${item.name.toTitleCase()})} ${item.span.from}—${item.span.to}</li>`.toCurlic() : ''
    },
    // -----------------------
    // Riven
    // -----------------------
    Ø: (item) => {
      return Ø(item)
    },
    // -----------------------
    // Lietal
    // -----------------------
    adultspeak: (item) => {
      return new Aeth(item).adultspeak
    },
    lien: (...items) => {
      const dict = Ø('database').cache.dictionaery
      let s = ''
      for (const key in items) {
        const result = dict[items[key].toUpperCase()]
        s += (result ? result.toEn() : 'err:unknown') + ' '
      }
      return s.trim()
    },
    enli: (...items) => {
      const dict = Ø('database').cache.dictionaery
      let s = ''
      for (const key in items) {
        for (const id in dict) {
          if (dict[id].hasEn(items[key])) { s += `${new Aeth(id.toLowerCase()).adultspeak} `; break }
        }
      }
      return s.trim()
    },
    septambres: (item) => {
      return new Septambres(item)
    },
    // -----------------------
    // Desamber
    // -----------------------
    desamber: () => {
      return `${new Desamber()}`
    },
    dtog: (q) => {
      return `${new Desamber(q).toGregorian()}`
    },
    gtod: (q) => {
      return !isNaN(new Date(q)) ? `${new Date(q).desamber()}` : 'Invalid Date'
    },
    // -----------------------
    // Horaire
    // -----------------------
    task: (code) => {
      return `${new Log({ code: '-' + code }).task}`
    }
  }

  Lisp.call(this, input, lib, tables, host)
}

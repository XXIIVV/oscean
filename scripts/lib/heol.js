'use strict'

function Heol (input, host) {
  const lib = {
    // -----------------------
    // Riven
    // -----------------------
    Ø: (item) => {
      return Ø(item)
    },
    // -----------------------
    // Basics
    // -----------------------
    match: (source, items) => {
      const filtered = items.filter((val) => { return source[val.toUpperCase()] })
      return filtered.map((val) => { return source[val.toUpperCase()] })
    },
    table: (source) => {
      return Ø('database').cache[source]
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
    fix: (...items) => {
      return items[0].toFixed(items[1])
    },
    floor: (item) => {
      return Math.floor(item)
    },
    ceil: (item) => {
      return Math.ceil(item)
    },
    // -----------------------
    // Strings
    // -----------------------
    lc: (item) => {
      return item.toLowerCase()
    },
    tc: (item) => {
      return item.toTitleCase()
    },
    uc: (item) => {
      return item.toUpperCase()
    },
    cc: (item) => {
      return item.substr(0, 1).toUpperCase() + item.substr(1)
    },
    // -----------------------
    // Arrays
    // -----------------------
    map: (arr, name) => {
      return arr.map((val, id, arr) => fn)
    },
    filter: (arr, name) => {
      return arr.filter(window[name])
    },
    reduce: (arr, name, acc) => {
      return arr.reduce((acc, val, id, arr) => fn, acc)
    },
    splice: (arr, index, length) => {
      return arr.splice(index, length)
    },
    slice: (arr, index, length) => {
      return arr.slice(index, length)
    },
    reverse: (arr) => {
      return arr.reverse()
    },
    first: (arr) => {
      return arr[0]
    },
    count: (item) => {
      return item.length
    },
    sort: (a) => {
      return a.sort()
    },
    uniq: (items) => {
      return items.filter((value, index, self) => { return self.indexOf(value) === index })
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
    // Arvelie & Neralie
    // -----------------------
    neralie: () => {
      return `${new Neralie()}`
    },
    arvelie: () => {
      return `${new Arvelie()}`
    },
    dtog: (q) => {
      return `${new Arvelie(q).toGregorian()}`
    },
    gtod: (q) => {
      return !isNaN(new Date(q)) ? `${new Date(q).toArvelie()}` : 'Invalid Date'
    },
    // -----------------------
    // Markup
    // -----------------------
    bold: (item) => {
      return `<b>${item}</b>`
    },
    ital: (item) => {
      return `<i>${item}</i>`
    },
    code: (item) => {
      return `<code>${item}</code>`
    },
    link: (target = host.name.toTitleCase(), name) => {
      return `${target.toLink(name)}`
    },
    // -----------------------
    // Templates
    // -----------------------
    template: (items, t, p) => {
      return items.map((val) => { return `${t(val, p)}` })
    },
    wrap: (item, tag, cl) => {
      return item ? `<${tag} class='${cl || ''}'>${item}</${tag}>` : ''
    },
    INDEX: (item) => {
      return `<h3>{λ(link "${item.name.toTitleCase()}")}</h3><h4>${item.bref}</h4><ul class='bullet'>${item.children.reduce((acc, term) => { return `${acc}<li>${term.bref}</li>`.toHeol(term) }, '')}</ul>`.toHeol(item)
    },
    LINK: (item) => {
      return `{λ(link "${item.toTitleCase()}")}`
    },
    REDIRECT: (item) => {
      return `<meta http-equiv="refresh" content="2; url=#${item}">`
    },
    TITLE: (item) => {
      return `<h2>${item.name.toTitleCase()}</h2><h4>${item.bref}</h4>`.toHeol(item)
    },
    PHOTO: (item) => {
      return host.photo() && host.photo().pict !== item.pict ? item.name.toLink(`<img title="${item.name}" src="media/diary/${item.pict}.jpg"/>`) : ''
    },
    GALLERY: (item) => {
      return `${item.photo() ? item.name.toLink(`<img title="${item.name}" src="media/diary/${item.photo().pict}.jpg"/>`) : ''}<h2>${item.name.toTitleCase()}</h2><h4>${item.bref}</h4>`.toHeol(item)
    },
    LIST: (item) => {
      return `<li>${item.bref}</li>`.toHeol(item)
    },
    FULL: (item) => {
      return item.toString(true).toHeol(item)
    },
    SPAN: (item) => {
      return item.logs.length > 10 && item.span.from && item.span.to ? `<li>${item.name.toTitleCase().toLink()} ${item.span.from}—${item.span.to}</li>` : ''
    },
    // -----------------------
    // Lietal
    // -----------------------
    adultspeak: (item) => {
      return new Yleta({ name: item }).adultspeak
    },
    yletaodeta: (item, w, h, thickness = 9, color = 'black', guide = false) => {
      return new Yletaodeta(item).toSVG(w, h, thickness, color, guide)
    },
    lien: (...items) => {
      return items.reduce((acc, val) => { const res = Ø('asulodeta').find(val, 'name'); return `${acc}${res ? res.english : val} ` }, '').trim()
    },
    enli: (...items) => {
      return items.reduce((acc, val) => { const res = Ø('asulodeta').find(val, 'english'); return `${acc}${res ? res.adultspeak : val} ` }, '').replace(/ \. /g, '. ').replace(/ \, /g, ', ').replace(/ \' /g, '\'').replace(/ \! /g, '! ').replace(/ {2}/g, ' ').trim()
    },
    deconstruct: (item) => {
      const res = Ø('asulodeta').find(item, 'name')
      if (!res) { return 'Unknown Yleta: ' + item }
      return `<table><tr>${res.parts().reduce((acc, childspeak) => {
        const l = Ø('asulodeta').find(childspeak, 'name')
        return l ? `${acc}<td>${l.yletaodeta}<br />${l.adultspeak}<br />${item === l.childspeak ? '<b>' + l.english + '</b>' : l.english}</td>` : item
      }, '')}</tr></table>`
    },
    // -----------------------
    // Horaire
    // -----------------------
    task: (code) => {
      return `${new Log({ code: '-' + code }).task}`
    }
  }

  Lisp.call(this, input, lib, Ø('database').cache, host)
}

String.prototype.toHeol = function (host) {
  const matches = this.match(/[^{\}]+(?=})/g)
  if (!matches) { return this }
  let text = `${this}`
  matches.forEach(el => {
    text = text.replace(`{${el}}`, new Heol(el, host))
  })
  return text
}

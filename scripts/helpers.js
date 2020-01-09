'use strict'

// Transforms

String.prototype.toTitleCase = function () { return this.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ') }
String.prototype.toUrl = function () { return this.toLowerCase().replace(/ /g, '+').replace(/[^0-9a-z\(\)\+\:\-\.\/\~]/gi, '').trim() }
String.prototype.toSnake = function () { return this.toLowerCase().replace(/ /g, '_').replace(/[^0-9a-z\_]/gi, '').trim() }
String.prototype.toEntities = function () { return this.replace(/[\u00A0-\u9999<>\&]/gim, function (i) { return `&#${i.charCodeAt(0)}` }) }
String.prototype.toAlpha = function () { return this.replace(/[^a-z ]/gi, '').trim() }
String.prototype.toAlphanum = function () { return this.replace(/[^0-9a-z ]/gi, '') }
String.prototype.isAlphanum = function () { return !!this.match(/^[A-Za-z0-9 ]+$/) }
String.prototype.toLink = function (name, cl) { return this.indexOf('(') === 0 ? this.toReplLink(name, cl) : this.indexOf('//') > -1 ? this.toExternalLink(name, cl) : this.toLocalLink(name, cl) }
String.prototype.toLocalLink = function (name, cl = '') { return `<a href='#${this.toUrl()}' data-goto='${this.toUrl()}' target='_self' class='local ${cl}'>${name || this}</a>` }
String.prototype.toExternalLink = function (name, cl = '') { return `<a href='${this}' target='_blank' rel='noreferrer' class='external ${cl}'>${name || this}</a>` }
String.prototype.toReplLink = function (name, cl = '') { return `<a href='#${this}' data-goto='${this}' class='repl ${cl}'>${name || this}</a>` }
String.prototype.stripHTML = function () { return this.replace(/<(?:.|\n)*?>/gm, '') }
String.prototype.replaceAll = function (search, replacement) { return `${this}`.split(search).join(replacement) }
String.prototype.isUrl = function () { return this.substr(0, 4) === 'http' }
String.prototype.insert = function (s, i) { return [this.slice(0, i), s, this.slice(i)].join('') }

const wrapTo = (s, w) => s.replace(
  new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n'
)

String.prototype.template = function (host) {
  const matches = this.match(/[^{\}]+(?=})/g)
  if (!matches) { return this }
  let text = `${this}`
  lainLibrary.host = host
  matches.forEach(el => {
    text = text.replace(`{${el}}`, `${lain.run(el, host)}`)
  })
  return text
}

// Arvelie

function timeAgo (offset, cap = 400) {
  if (offset === 1) { return 'tomorrow' }
  if (offset === 0) { return 'today' }
  if (offset === -1) { return 'yesterday' }
  if (offset < -365) { return `${parseInt(offset / -365)} years ago` }
  if (offset < 1) { return `${offset * -1} days ago` }
  return `in ${offset} days`
}

function sort (array) {
  return array.sort(function (a, b) {
    return a[1] - b[1]
  }).reverse()
}

function sortHash (h) {
  const sortable = []
  for (const key in h) {
    sortable.push([key, h[key]])
  }
  return sort(sortable)
}

function sortLogs (arr) {
  return arr.sort(function (a, b) {
    return a.time.offset - b.time.offset
  }).reverse()
}

function plainTable (arr, pad = 2, cols = 4) {
  const length = Math.max(...(arr.map(el => el.length))) + pad
  let html = ''
  for (let i = 0; i <= arr.length; i += cols) {
    for (let c = 0; c < cols; c += 1) {
      html += arr[i + c] ? arr[i + c].padEnd(length, ' ') : ''
    }
    html += '\n'
  }
  return html
}

// Horaire Filters

function __onlyPast (log) {
  return log.time.offset <= 0
}

function __onlyFuture (log) {
  return log.time.offset > 0
}

function __onlyPast14 (log) {
  return log.time.offset <= 0 && log.time.offset > -14
}

function __onlyPast60 (log) {
  return log.time.offset <= 0 && log.time.offset > -60
}

function __onlyPast365 (log) {
  return log.time.offset <= 0 && log.time.offset > -365
}

function __onlyPast5Years (log) {
  return log.time.offset <= 0 && log.time.offset > -365 * 5
}

function __onlyLast5Years (log) {
  return log.time.offset <= 0 && log.time.year > new Date().getFullYear() - 5
}

function __onlyLast (log) {
  return log.host.logs[0].time.offset === log.time.offset
}

function __onlyCurrentYear (log) {
  return log.time.y === new Arvelie().y
}

function __onlyCurrentMonth (log) {
  return log.time.m === new Arvelie().m && log.time.y === new Arvelie().y
}

function __onlyThisDay (log) {
  return log.time.d === new Arvelie().d && log.time.m === new Arvelie().m
}

function __onlyEvents (log) {
  return log.isEvent
}

function __onlyDiaries (log) {
  return log.pict !== null
}

function __onlyDanglings (log) {
  return log.pict === null && log.host.logs.length < 5 && !log.isEvent
}

function __onlyOfProjects (log) {
  return __onlyProjects(log.host)
}

function __onlyProjects (term) {
  return term.logs.length > 20
}

function __onlyActiveProjects (term) {
  return __onlyProjects(term) && term.span().to.offset > -365 * 5
}

function __onlyReleasedProjects (term) {
  return __onlyProjects(term) && (term.span().to.offset - term.span().from.offset) > 100 && term.span().release
}

function __onlyNotSpecial (term) {
  return term.tags.indexOf('special') < 0
}

function __onlyOnce (log, id, logs) {
  for (const i in logs) {
    if (log.pict || log.isEvent) { return true }
    if (i < id && logs[i].term === log.term) {
      return false
    }
  }
  return true
}

function __onlyStaticRunes (line) {
  return ['λ', '%', '>'].indexOf(line.substr(0, 1)) < 0
}

// Sorters

function __byRecentLog (a, b) {
  return a.span().to.offset - b.span().to.offset
}

// Compare strings

function findSimilar (target, list) {
  const similar = []
  for (const key in list) {
    const word = list[key]
    similar.push({ word: word, value: similarity(target, word) })
  }
  return similar.sort(function (a, b) {
    return a.value - b.value
  }).reverse()
}

function similarity (a, b) {
  let val = 0
  for (let i = 0; i < a.length; ++i) { val += b.indexOf(a.substr(i)) > -1 ? 1 : 0 }
  for (let i = 0; i < b.length; ++i) { val += a.indexOf(b.substr(i)) > -1 ? 1 : 0 }
  a = a.split('').sort().join('')
  b = b.split('').sort().join('')
  for (let i = 0; i < a.length; ++i) { val += b.indexOf(a.substr(i)) > -1 ? 1 : 0 }
  for (let i = 0; i < b.length; ++i) { val += a.indexOf(b.substr(i)) > -1 ? 1 : 0 }
  return val
}

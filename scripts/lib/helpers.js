'use strict'

// Transforms

String.prototype.toTitleCase = function () { return this.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ') }
String.prototype.toUrl = function () { return this.toLowerCase().replace(/ /g, '+').replace(/[^0-9a-z\+\:\-\.\/\~]/gi, '').trim() }
String.prototype.toEntities = function () { return this.replace(/[\u00A0-\u9999<>\&]/gim, function (i) { return `&#${i.charCodeAt(0)}` }) }
String.prototype.toAlpha = function () { return this.replace(/[^a-z ]/gi, '').trim() }
String.prototype.toAlphanum = function () { return this.replace(/[^0-9a-z ]/gi, '') }
String.prototype.toLink = function (name, cl) { return this.indexOf('//') > -1 ? this.toExternalLink(name, cl) : this.toLocalLink(name, cl) }
String.prototype.toLocalLink = function (name, cl = '') { return `<a href='${this.toUrl()}' data-goto='${this.toUrl()}' target='_self' class='local ${cl} ${redLink(this)}'>${name || this}</a>` }
String.prototype.toExternalLink = function (name, cl = '') { return `<a href='${this}' target='_blank' rel='noreferrer' class='external ${cl}'>${name || this}</a>` }
String.prototype.stripHTML = function () { return this.replace(/<(?:.|\n)*?>/gm, '') }
String.prototype.replaceAll = function (search, replacement) { return `${this}`.split(search).join(replacement) }

// Redlinks

function redLink (index) {
  if (Ø('database').cache && !Ø('database').find(index)) { console.warn(`Redlink! ${index}.`); return 'redlink' }
  return ''
}

// Arvelie

function timeAgo (arvelie, cap = 9999) {
  if (-arvelie.offset > cap) { return `${arvelie}` }
  if (arvelie.offset === 1) { return 'tomorrow' }
  if (arvelie.offset === 0) { return 'today' }
  if (arvelie.offset === -1) { return `yesterday` }
  if (arvelie.offset < -365) { return `${parseInt(arvelie.offset / -365)} years ago` }
  if (arvelie.offset < 1) { return `${arvelie.offset * -1} days ago` }
  return `in ${arvelie.offset} days`
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

// Horaire Filters

function __onlyPast (log) {
  return log.time.offset < 0
}

function __onlyFuture (log) {
  return log.time.offset > 0
}

function __onlyPast14 (log) {
  return log.time.offset <= 0 && log.time.offset > -14
}

function __onlyPast365 (log) {
  return log.time.offset < 0 && log.time.offset > -365
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

function __onlyPhotos (log) {
  return log.pict !== null
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

// Date

Date.prototype.doty = function () {
  const year = this.getFullYear()
  const start = new Date(year, 0, 0)
  const diff = (this - start) + ((start.getTimezoneOffset() - this.getTimezoneOffset()) * 60 * 1000)
  return Math.floor(diff / 86400000)
}

Date.prototype.offset = function (days) {
  const date = new Date()
  return this.setDate(date.getDate() + 1)
}

'use strict'

String.prototype.replace_all = function (search, replacement) { return `${this}`.split(search).join(replacement) }
String.prototype.toTitleCase = function () { return this.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ') }
String.prototype.toUrl = function () { return this.toLowerCase().replace(/ /g, '+').replace(/[^0-9a-z\+\:\-\.\/]/gi, '').trim() }
String.prototype.toPath = function () { return this.toLowerCase().replace(/\+/g, '.').replace(/ /g, '.').replace(/[^0-9a-z\.\-]/gi, '').trim() }
String.prototype.toEntities = function () { return this.replace(/[\u00A0-\u9999<>\&]/gim, function (i) { return `&#${i.charCodeAt(0)}` }) }
String.prototype.toRss = function () { return this.replace(/\</g, '&lt;').replace(/\>/g, '&gt;') }
String.prototype.toAlpha = function () { return this.replace(/[^a-z ]/gi, '').trim() }
String.prototype.toAlphanum = function () { return this.replace(/[^0-9a-z ]/gi, '') }
String.prototype.count = function (c) { let r = 0; for (let i; i < this.length; i++) if (this[i] === c) r++; return r }

// Desamber

function timeAgo (desamber, cap = 9999) {
  if (-desamber.offset > cap) { return `${desamber}` }
  if (desamber.offset === 1) { return 'tomorrow' }
  if (desamber.offset === 0) { return 'today' }
  if (desamber.offset === -1) { return `yesterday` }
  if (desamber.offset < -365) { return `${parseInt(desamber.offset / -365)} years ago` }
  if (desamber.offset < 1) { return `${desamber.offset * -1} days ago` }
  return `in ${desamber.offset} days`
}

function sortHash (h) {
  const sortable = []
  for (const key in h) {
    sortable.push([key, h[key]])
  }
  return sortable.sort((a, b) => {
    return a[1] - b[1]
  }).reverse()
}

function sortLogs (arr) {
  return arr.sort(function (a, b) {
    return a.time.offset - b.time.offset
  }).reverse()
}

// Horaire Filters

function __onlyLast14 (log) {
  return log.time.offset <= 0 && log.time.offset > -14
}

function __onlyLast365 (log) {
  return log.time.offset < 0 && log.time.offset > -365
}

function __onlyCurrentYear (log) {
  return log.time.y === new Desamber().y
}

function __onlyCurrentMonth (log) {
  return log.time.m === new Desamber().m && log.time.y === new Desamber().y
}

function __onlyEvents (log) {
  return log.isEvent
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

Date.prototype.desamber = function () {
  return new Desamber(desamber(this))
}

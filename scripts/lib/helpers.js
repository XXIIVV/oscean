'use strict'

String.prototype.replace_all = function (search, replacement) { return `${this}`.split(search).join(replacement) }
String.prototype.toTitleCase = function () { return this.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ') }
String.prototype.toUrl = function () { return this.toLowerCase().replace(/ /g, '+').replace(/[^0-9a-z\+\:\-\.\/]/gi, '').trim() }
String.prototype.to_path = function () { return this.toLowerCase().replace(/\+/g, '.').replace(/ /g, '.').replace(/[^0-9a-z\.\-]/gi, '').trim() }
String.prototype.to_entities = function () { return this.replace(/[\u00A0-\u9999<>\&]/gim, function (i) { return `&#${i.charCodeAt(0)}` }) }
String.prototype.to_rss = function () { return this.replace(/\</g, '&lt;').replace(/\>/g, '&gt;') }
String.prototype.to_alpha = function () { return this.replace(/[^a-z ]/gi, '').trim() }
String.prototype.to_alphanum = function () { return this.replace(/[^0-9a-z ]/gi, '') }
String.prototype.count = function (c) { let r = 0; for (let i; i < this.length; i++) if (this[i] === c) r++; return r }

// Desamber

function timeAgo (desamber, cap = 9999) {
  const date = new Date(desamber.year, 0).setDate(desamber.doty)
  const days = parseInt((date - new Date()) / 86400000)
  if (-days > cap) { return `${desamber}` }
  if (days === -1) { return `yesterday` }
  if (days === 1) { return 'tomorrow' }
  if (days === 0) { return 'today' }
  if (days < -365) { return `${parseInt(days / -365)} years ago` }
  if (days < 1) { return `${days * -1} days ago` }
  return `in ${days} days`
}

function dtog (desamber) {
  const d = new Date(new Date(desamber.year, 0).setDate(desamber.doty))
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}-${`${d.getDate()}`.padStart(2, '0')}`
}

// Date

function doty (date) {
  const year = date.getFullYear()
  const start = new Date(year, 0, 0)
  const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000)
  return Math.floor(diff / 86400000)
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

function __onlyCurrentYear (log) {
  return log.time.year === 2018
}

function __onlyLast365 (log) {
  return log.time.offset < 0 && log.time.offset > -365
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

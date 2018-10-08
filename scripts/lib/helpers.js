'use strict'

String.prototype.replace_all = function (search, replacement) { return `${this}`.split(search).join(replacement) }
String.prototype.capitalize = function () { return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase() }
String.prototype.to_url = function () { return this.toLowerCase().replace(/ /g, '+').replace(/[^0-9a-z\+\:\-\.\/]/gi, '').trim() }
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

'use strict'

function desamber (date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000)
  const doty = Math.floor(diff / 86400000) - 1
  const l = Math.floor(((doty) / 364) * 26)
  const y = date.getFullYear().toString().substr(2, 2)
  const m = doty == 365 || doty == 366 ? '+' : String.fromCharCode(97 + l).toUpperCase()
  const d = `${(doty == 365 ? 1 : doty == 366 ? 2 : (doty % 14)) + 1}`.padStart(2, '0')
  return `${y}${m}${d}`
}

function Desamber (t = desamber()) {
  this.t = t.match(/\d\d[a-z\+]\d\d/i) ? t.toUpperCase() : '01+01'
  this.y = t.substr(0, 2)
  this.m = t.substr(2, 1).toUpperCase()
  this.d = t.substr(3, 2)
  this.year = parseInt(`20${this.y}`)
  this.month = this.m === '+' ? 26 : this.m.charCodeAt(0) - 65
  this.doty = (parseInt(this.month) * 14) + parseInt(this.d)
  this.date = new Date(this.year, 0).setDate(this.doty)
  this.offset = parseInt((this.date - new Date()) / 86400000)

  this.toGregorian = function (d = this.toDate()) {
    return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}-${`${d.getDate()}`.padStart(2, '0')}`
  }

  this.toDate = function () {
    return new Date(this.date)
  }

  this.ago = function (cap = 9999) {
    const days = this.offset
    if (-days > cap) { return `${this.toString(true)}` }
    if (days === -1) { return `yesterday` }
    if (days === 1) { return 'tomorrow' }
    if (days === 0) { return 'today' }
    if (days < -365) { return `${parseInt(days / -365)} years ago` }
    if (days < 1) { return `${days * -1} days ago` }
    return `in ${days} days`
  }

  this.toString = function (template = false) {
    return template ? `<span title='${this.toGregorian()}'>${this.t}</span>` : this.t
  }
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
  return desamber(this)
}

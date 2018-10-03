'use strict'

function Desamber (str) {
  this.str = str.match(/\d\d[a-z\+]\d\d/i) ? str : '01+01'

  this.y = str.substr(0, 2)
  this.m = str.substr(2, 1).toUpperCase()
  this.d = str.substr(3, 2)

  this.year = parseInt(`20${this.y}`)
  this.month = this.m == '+' ? 26 : this.m.charCodeAt(0) - 65
  this.doty = (parseInt(this.month) * 14) + parseInt(this.d)

  this.date = new Date(this.year, 0).setDate(this.doty)
  this.offset = parseInt((this.date - new Date()) / 86400000)

  this.to_gregorian = function () {
    const d = this.to_date()
    return `${d.getFullYear()}-${prepend(d.getMonth() + 1, 2)}-${prepend(d.getDate(), 2)}`
  }

  this.to_date = function () {
    return new Date(this.date)
  }

  this.ago = function (cap = 9999) {
    const days = this.offset

    if (-days > cap) { return `${this.toString(true)}` }

    if (days == -1) { return `yesterday` }
    if (days == 1) { return 'tomorrow' }
    if (days == 0) { return 'today' }
    if (days < -365) { return `${parseInt(days / -365)} years ago` }
    if (days < 1) { return `${days * -1} days ago` }
    return `in ${days} days`
  }

  this.toString = function (template = false) {
    return template ? `<span title='${this.to_gregorian()}'>${this.str.toUpperCase()}</span>` : this.str.toUpperCase()
  }

  function prepend (s, l, c = '0') { while (`${s}`.length < l) { s = `${c}${s}` }; return s }
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
  const year = this.getFullYear()
  const start = new Date(year, 0, 0)
  const diff = (this - start) + ((start.getTimezoneOffset() - this.getTimezoneOffset()) * 60 * 1000)
  const doty = Math.floor(diff / 86400000)
  const leap = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)
  const days = leap ? 366 : 365

  const y = year.toString().substr(2, 2)
  const m = doty == 365 || doty == 366 ? '+' : String.fromCharCode(97 + Math.floor(((doty) / days) * 26)).toUpperCase()

  // TODO: Clean
  let d = (doty % 14)
  d = d < 10 ? `0${d}` : d
  d = d == '00' ? '14' : d
  d = doty == 365 ? '01' : (doty == 366 ? '02' : d)

  return new Desamber(`${y}${m}${d}`)
}

'use strict'

function neralie (date = new Date()) {
  const e = new Date(date)
  const ms = e - date.setHours(0, 0, 0, 0)
  const val = (ms / 8640 / 10000).toFixed(6)
  return `${val.substr(2, 3)}:${val.substr(5, 3)}`
}

function Neralie (t = neralie()) {
  this.beat = t.split(':')[0]
  this.pulse = t.split(':')[1]

  this.toString = function () {
    return t
  }
}

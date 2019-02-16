'use strict'

function neralie (d = new Date(), e = new Date(d)) {
  const ms = e - d.setHours(0, 0, 0, 0)
  const val = (ms / 8640 / 10000).toFixed(6)
  return `${val.substr(2, 3)}:${val.substr(5, 3)}`
}

function Neralie (t = neralie) {
  this.toInteger = function (d = new Date(), e = new Date(d)) {
    const ms = e - d.setHours(0, 0, 0, 0)
    return (ms / 8640) * 100
  }

  this.toString = function () {
    return `${neralie()}`
  }
}

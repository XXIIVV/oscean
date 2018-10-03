'use strict'

function Neralie () {
  this.beat = function (t = this.time()) {
    return `${t}`.substr(0, 3)
  }

  this.pulse = function (t = this.time()) {
    return `${t}`.substr(3, 3)
  }

  this.time = function () {
    const d = new Date(); const e = new Date(d)
    return (e - d.setHours(0, 0, 0, 0) / 8640) * 100
  }

  this.toString = function () {
    const t = this.time()
    return `${this.beat(t)}:${this.pulse(t)}`
  }
}

Date.prototype.oneralie = function () {
  return new Neralie()
}

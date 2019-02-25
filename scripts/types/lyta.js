'use strict'

function Lyta (data = {}) {
  Entry.call(this, data.name, data)

  this.english = data.english
  this.childspeak = name || data.name
  this.adultspeak = adultspeak(name || data.name)
  this.key = this.childspeak.substr(0, 2)
  this.indexes = [this.name]
  this.septambres = new Septambres(this.childspeak)
  this.bref = `<b>${this.name.toTitleCase()}</b>${this.name !== this.adultspeak ? `, or ${this.adultspeak}, ` : ''} is the {(Lietal)} word for \"${this.english}\" in English.`.toCurlic()

  this.glyph = function () {
    return `M65,155 L65,155 L155,155 M155,65 L155,65 L155,245 M185,155 L185,155 L245,155 M185,185 L185,185 L185,185`
  }

  this.body = function () {
    return `${permutate(this.key)}${this.septambres.toSVG(100, 100, 23, 'white', true)}`
  }

  this.toString = function () {
    const en = this.english
    return `<p>{*${this.name.toTitleCase()}*}${this.name.toLowerCase() !== this.adultspeak.toLowerCase() ? ', or ' + this.adultspeak.toTitleCase() : ''} is a {(Lietal)} word${en ? ' that translates to \"' + en + '\" in {(English)}' : ''}.</p>`.toCurlic()
  }
}

function permutate (key) {
  return `<table><tr><td>${key}</td></tr></table>`
}

function deconstruct (target) {
  const chunks = []
  const size = 2
  while (target.length > 0) {
    chunks.push(target.substr(0, size))
    target = target.substr(size, target.length - size)
  }
  return `${chunks}`
}

function adultspeak (cs) {
  const childspeak = cs.toLowerCase()
  const vowels = { 'a': 'ä', 'e': 'ë', 'i': 'ï', 'o': 'ö', 'u': 'ü', 'y': 'ÿ' }

  if (childspeak.length === 2) {
    const c = childspeak.substr(0, 1)
    const v = childspeak.substr(1, 1)
    return v + c
  }
  if (childspeak.length === 4) {
    const c1 = childspeak.substr(0, 1)
    const v1 = childspeak.substr(1, 1)
    const c2 = childspeak.substr(2, 1)
    const v2 = childspeak.substr(3, 1)

    // Complex
    if (v1 === 'i' && v2 === 'a' && c1 === c2) {
      return 'e' + c1
    } else if (v1 === 'a' && v2 === 'o' && c1 === c2) {
      return 'u' + c1
    } else if (v1 === 'i' && v2 === 'a') {
      return c1 + 'e' + c2
    } else if (v1 === 'a' && v2 === 'o') {
      return c1 + 'u' + c2
    }

    // Basics
    if (c1 === c2 && v1 === v2) {
      return vowels[v1] + c1
    } else if (c1 === c2) {
      return c1 + v1 + v2
    } else if (v1 === v2) {
      return c1 + vowels[v1] + c2
    }
  }
  if (childspeak.length === 6) {
    return adultspeak(childspeak.substr(0, 2)) + adultspeak(childspeak.substr(2, 4))
  }
  if (childspeak.length === 8) {
    return adultspeak(childspeak.substr(0, 4)) + adultspeak(childspeak.substr(4, 4))
  }
  return childspeak
}

function Construction (str) {
  this.str = str

  this.prepare = function (str) {
    return str.replace(/\'/g, " ' ").replace(/\,/g, ' , ').replace(/\?/g, ' ? ').replace(/\!/g, ' ! ')
  }

  this.complete = function (html) {
    return html.replace(/ \' /g, "'").replace(/ \, /g, ', ').replace(/ \? /g, '? ').replace(/ \! /g, '! ').trim()
  }

  this.find = function (target, adultspeak = true) {
    const d = Ø('database').cache.saldota
    for (const id in d) {
      if (d[id].english === target.toLowerCase()) {
        return adultspeak ? d[id].adultspeak : d[id].childspeak
      }
    }
    return target
  }

  this.to_septambres = function () {
    return new Septambres(this.toString(false))
  }

  this.toString = function (adultspeak = true) {
    let html = ''
    const str = this.prepare(this.str)
    const parts = str.split(' ')
    for (const id in parts) {
      const part = parts[id]
      html += `${this.find(part, adultspeak)} `
    }
    return this.complete(html)
  }
}

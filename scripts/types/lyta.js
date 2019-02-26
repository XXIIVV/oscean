'use strict'

function Lyta (data = {}) {
  Entry.call(this, data.name, data)

  this.english = data.english
  this.childspeak = name || data.name
  this.adultspeak = adultspeak(name || data.name)
  this.type = this.childspeak.substr(0, 2)
  this.key = this.childspeak.substr(0, this.childspeak.length - 2)
  this.indexes = [this.name]
  this.lytadota = new Lytadota(this.childspeak)
  this.bref = `<b>${this.name.toTitleCase()}</b>${this.name !== this.adultspeak ? `, or ${this.adultspeak}, ` : ''} is the {(Lietal)} word for \"${this.english}\" in English.`.toCurlic()

  this.parts = function (size = 2) {
    const chunks = []
    let target = `${this.childspeak}`
    let from = size
    while (from < target.length + size) {
      chunks.push(target.substr(target.length - from, from))
      from += size
    }
    return chunks
  }

  this.glyph = function () {
    return `M65,155 L65,155 L155,155 M155,65 L155,65 L155,245 M185,155 L185,155 L245,155 M185,185 L185,185 L185,185`
  }

  this.body = function () {
    return `${permutate(this.key)}${this.lytadota.toSVG(100, 100, 23, 'white', true)}`
  }

  this.toString = function () {
    const en = this.english
    return `<p>{*${this.name.toTitleCase()}*}${this.name.toLowerCase() !== this.adultspeak.toLowerCase() ? ', or ' + this.adultspeak.toTitleCase() : ''} is a {(Lietal)} word${en ? ' that translates to \"' + en + '\" in {(English)}' : ''}.</p>`.toCurlic()
  }
}

function permutate (key) {
  const a = [['k', 't', 'd'], ['r', 's', 'l'], ['j', 'v', 'f']]
  const v = ['y', 'i', 'a', 'o']
  let html = ''
  for (const ai in a) {
    const b = a[ai]
    html += `<tr>`
    for (const bi in b) {
      const consonant = b[bi]
      html += `<td>`
      for (const vi in v) {
        const vowel = v[vi]
        const name = `${key}${consonant}${vowel}`
        const lyta = new Lyta({ name: name })
        const result = Ø('saldota').find(lyta.childspeak)
        html += `<b>${lyta.adultspeak}</b>: ${result ? result.english : '<i>--</i>'}<br />`
      }
      html += `</td>`
    }
    html += `</tr>`
  }
  return `<table>${html}</table>`
}

function adultspeak (cs, secondary = false) {
  const childspeak = cs.toLowerCase()
  if (childspeak.length === 2) {
    return childspeak
  }
  if (childspeak.length === 6) {
    return adultspeak(childspeak.substr(0, 2)) + adultspeak(childspeak.substr(2, 4), true)
  }
  if (childspeak.length === 8) {
    return adultspeak(childspeak.substr(0, 4), true) + adultspeak(childspeak.substr(4, 4), true)
  }
  const vowels = { 'a': 'ä', 'e': 'ë', 'i': 'ï', 'o': 'ö', 'u': 'ü', 'y': 'ÿ' }
  const c1 = childspeak.substr(0, 1)
  const v1 = childspeak.substr(1, 1)
  const c2 = childspeak.substr(2, 1)
  const v2 = childspeak.substr(3, 1)
  // lili -> lï
  if (c1 === c2 && v1 === v2) {
    return c1 + vowels[v1]
  }
  // lila -> lia
  if (c1 === c2) {
    return c1 + v1 + v2
  }
  // kala -> käl
  if (v1 === v2) {
    return c1 + vowels[v1] + c2
  }
  return secondary === true ? v1 + c1 + c2 + v2 : childspeak
}

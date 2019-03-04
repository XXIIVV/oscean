'use strict'

function curlic (text = '', host) {
  function heol (t) {
    return new Heol(t, Ø('database').cache, host)
  }

  function parse (s) {
    const toHeol = s.substr(0, 1) === 'λ'
    if (toHeol) { s = s.replace(s, heol(s.substr(1))) }

    return s
  }

  function extract (text) {
    return text.match(/[^{\}]+(?=})/g)
  }

  const matches = extract(text)
  if (!matches) { return text }
  matches.forEach(el => {
    text = text.replace(`{${el}}`, parse(el))
  })

  return text
}

String.prototype.toCurlic = function (host) { return `${curlic(this, host)}` }

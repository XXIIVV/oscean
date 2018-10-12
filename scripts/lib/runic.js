'use strict'

function runic (lines = [], templater = null, host = null) {
  const runes = {
    '&': { tag: 'p' },
    '*': { tag: 'h3' },
    '+': { tag: 'hs' },
    '?': { tag: 'div', class: 'note' },
    '-': { tag: 'li', wrapper: 'ul', wrapperClass: 'bullet' },
    '#': { tag: 'li', wrapper: 'code' },
    '@': { tag: 'div', class: 'quote', fn: quote },
    '|': { tag: 'tr', wrapper: 'table', fn: table },
    '%': { fn: media },
    'λ': { fn: heol },
    '>': {}
  }

  function isRunic (l) {
    const rune = l.substr(0, 1)
    if (l.substr(1, 1) !== ' ') { console.warn('Non-Runic', l); return false }
    if (!runes[rune]) { console.warn(`Non-Runic[${rune}]`, l); return false }
    return true
  }

  function stash (acc, l) {
    const rune = l.substr(0, 1)
    const line = l.substr(2)
    const prev = acc[acc.length - 1] ? acc[acc.length - 1] : [{ rune: rune, a: [] }]
    if (prev.rune === rune) { prev.a.push(line) } else { acc.push({ rune: rune, a: [line] }) }
    return acc
  }

  function _html (acc, stash) {
    const wr = runes[stash.rune].wrapper
    const wrClass = runes[stash.rune].wrapperClass
    const html = stash.a.reduce((acc, val, id) => {
      const r = runes[stash.rune]
      const txt = r.fn ? r.fn(stash.a[id]) : stash.a[id]
      const htm = templater ? templater(txt) : txt
      return `${acc}${r.tag ? `<${r.tag} class='${r.class ? r.class : ''}'>${htm}</${r.tag}>` : `${htm}`}`
    }, '')
    return wr ? `${acc}<${wr} class='${wrClass || ''}'>${html}</${wr}>` : `${acc}${html}`
  }

  // Templates

  function quote (content) {
    const parts = content.split(' | ')
    const text = parts[0].trim()
    const author = parts[1]
    const source = parts[2]
    const link = parts[3]
    return `
      ${text.length > 1 ? `<p class='text'>${text}</p>` : ''}
      ${author ? `<p class='attrib'>${author}${source && link ? `, <a href='${link}'>${source}</a>` : source ? `, <b>${source}</b>` : ''}</p>` : ''}`
  }

  function media (content) {
    const service = content.split(' ')[0]
    const id = content.split(' ')[1]
    if (service === 'itchio') { return `<iframe frameborder="0" src="https://itch.io/embed/${id}?link_color=000000" width="600" height="167"></iframe>` }
    if (service === 'bandcamp') { return `<iframe style="border: 0; width: 600px; height: 274px;" src="https://bandcamp.com/EmbeddedPlayer/album=${id}/size=large/bgcol=ffffff/linkcol=333333/artwork=small/transparent=true/" seamless></iframe>` }
    if (service === 'youtube') { return `<iframe width="100%" height="380" src="https://www.youtube.com/embed/${id}?rel=0" style="max-width:700px" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>` }
    if (service === 'custom') { return `<iframe src='${id}' style='width:100%;height:350px;'></iframe>` }
    return `<img src='media/${service}' class='${id}'/>`
  }

  function table (content) {
    return `<td>${content.trim().replace(/ \| /g, '</td><td>')}</td>`
  }

  function heol (content) {
    return `${new Heol(content, Ø('database').cache, host)}`
  }

  return lines.filter(isRunic).reduce(stash, []).reduce(_html, '')
}

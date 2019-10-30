'use strict'

function Yletaodeta (yleta) {
  this.yleta = yleta.toLowerCase()

  this.template = function (glyph_id, segId, grid, w, h, thickness) {
    const offset = glyph_id * (w + (thickness + 1))
    let rect = { w: w, h: h }
    const angle = grid === 3 && segId > 0 || grid === 4 ? 0.25 : 0.75

    if (grid === 1) {
      rect = { x: offset, y: 0, w: w, h: h }
    } else if (grid === 2) {
      if (segId === 0) { rect = { x: offset, y: 0, w: (w), h: (h / 2) } }
      if (segId === 1) { rect = { x: offset, y: (h / 2), w: (w), h: (h / 2) } }
    } else if (grid === 3) {
      if (segId === 0) { rect = { x: offset, y: 0, w: (w), h: (h / 2) } }
      if (segId === 1) { rect = { x: offset, y: (h / 2), w: (w / 2), h: (h / 2) } }
      if (segId === 2) { rect = { x: offset + (w / 2), y: (h / 2), w: (w / 2), h: (h / 2) } }
    } else if (grid === 4) {
      if (segId === 0) { rect = { x: offset, y: 0, w: (w / 2), h: (h / 2) } }
      if (segId === 1) { rect = { x: offset + (w / 2), y: 0, w: (w / 2), h: (h / 2) } }
      if (segId === 2) { rect = { x: offset, y: (h / 2), w: (w / 2), h: (h / 2) } }
      if (segId === 3) { rect = { x: offset + (w / 2), y: (h / 2), w: (w / 2), h: (h / 2) } }
    } else {
      console.warn('Unknown grid', grid)
    }

    const t = {
      TL: { x: rect.x, y: rect.y },
      TC: { x: rect.x + (rect.w / 2), y: rect.y },
      TR: { x: rect.x + rect.w, y: rect.y },
      CL: { x: rect.x, y: rect.y + (rect.h / 2) },
      CC: { x: rect.x + (rect.w / 2), y: rect.y + (rect.h / 2) },
      CR: { x: rect.x + rect.w, y: rect.y + (rect.h / 2) },
      BL: { x: rect.x, y: rect.y + rect.h },
      BC: { x: rect.x + (rect.w / 2), y: rect.y + rect.h },
      BR: { x: rect.x + rect.w, y: rect.y + rect.h },
      TYPE: rect.w === rect.h ? 'square' : rect.w > rect.h ? 'horizontal' : 'vertical'
    }
    for (const id in t) {
      if (id === 'TYPE') { continue }
      t[id] = { x: parseInt(t[id].x), y: parseInt(t[id].y) }
    }
    return t
  }

  this.consonant = function (consonant, vowel, template, thickness) {
    switch (consonant) {
      case 'k':
        return `M${template.CL.x},${template.CL.y} L${template.TL.x},${template.TL.y} L${template.TR.x},${template.TR.y}`
      case 't':
        return `M${template.TL.x},${template.TL.y} L${template.TR.x},${template.TR.y}`
      case 'd':
        return `M${template.TL.x},${template.TL.y} L${template.TR.x},${template.TR.y} L${template.CR.x},${template.CR.y}`
      case 'r':
        return `M${template.TL.x},${template.TL.y} L${template.BL.x},${template.BL.y}`
      case 's':
        return `M${template.TC.x},${template.TC.y} L${template.BC.x},${template.BC.y}`
      case 'l':
        return `M${template.TR.x},${template.TR.y} L${template.BR.x},${template.BR.y}`
      case 'j':
        return `M${template.CL.x},${template.CL.y} L${template.BL.x},${template.BL.y} L${template.BR.x},${template.BR.y}`
      case 'v':
        return `M${template.BL.x},${template.BL.y} L${template.BR.x},${template.BR.y}`
      case 'f':
        return `M${template.BL.x},${template.BL.y} L${template.BR.x},${template.BR.y} L${template.CR.x},${template.CR.y}`
    }
    console.warn(`Unknown consonant: ${consonant}`)
    return ''
  }

  this.vowel = function (consonant, vowel, t, thickness) {
    if (consonant === 'k') {
      switch (vowel) {
        case 'y': return ''
        case 'i': return curve('BL', 'CC', t)
        case 'a': return stroke('CC', 'CR', t)
        case 'o': return curve('CC', 'BR', t)
      }
    }

    if (consonant === 't') {
      switch (vowel) {
        case 'y': return stroke('TC', 'CC', t)
        case 'i': return stroke('BL', 'BC', t) + curve('BC', 'CR', t, false)
        case 'a': return stroke('TC', 'BC', t)
        case 'o': return stroke('CL', 'CC', t) + curve('CC', 'BR', t, false)
      }
    }

    if (consonant === 'd') {
      switch (vowel) {
        case 'y': return ''
        case 'i': return curve('BL', 'CC', t)
        case 'a': return stroke('CL', 'CC', t)
        case 'o': return curve('CC', 'BR', t)
      }
    }

    if (consonant === 'r') {
      switch (vowel) {
        case 'y': return stroke('CL', 'CC', t)
        case 'i': return stroke('CL', 'CC', t) + curve('CC', 'TR', t, false)
        case 'a': return stroke('CL', 'CR', t)
        case 'o': return stroke('CL', 'CC', t) + curve('CC', 'BR', t, false)
      }
    }

    if (consonant === 'l') {
      switch (vowel) {
        case 'y': return stroke('CR', 'CC', t)
        case 'i': return curve('BL', 'CC', t) + stroke('CC', 'CR', t, false)
        case 'a': return stroke('CR', 'CL', t)
        case 'o': return curve('TL', 'CC', t) + stroke('CC', 'CR', t, false)
      }
    }

    if (consonant === 's') {
      switch (vowel) {
        case 'y': return ''
        case 'i': return stroke('TR', 'CR', t) + stroke('CR', 'CC', t, false)
        case 'a': return stroke('CL', 'CR', t)
        case 'o': return stroke('CC', 'CL', t) + stroke('CL', 'BL', t, false)
      }
    }

    if (consonant === 'j') {
      switch (vowel) {
        case 'y': return ' '
        case 'i': return curve('CC', 'TR', t)
        case 'a': return stroke('CC', 'CR', t)
        case 'o': return curve('TL', 'CC', t)
      }
    }

    if (consonant === 'v') {
      switch (vowel) {
        case 'y': return stroke('BC', 'CC', t)
        case 'i': return curve('CL', 'CC', t, true, true) + curve('CC', 'TR', t, false)
        case 'a': return stroke('BC', 'TC', t)
        case 'o': return curve('TL', 'TC', t, true, true) + curve('TC', 'CR', t, false)
      }
    }

    if (consonant === 'f') {
      switch (vowel) {
        case 'y': return ' '
        case 'i': return curve('CC', 'TR', t)
        case 'a': return stroke('CC', 'CL', t)
        case 'o': return curve('TL', 'CC', t)
      }
    }
    console.warn(`Unknown vowel: ${vowel}`)
    return ''
  }

  this.grid = function (id, yleta, w, h, thickness) {
    let path = ''
    const segs = this.getSegs(yleta)
    for (const i in segs) {
      const template = this.template(parseInt(id), parseInt(i), yleta.length / 2, w, h, thickness)
      const peg = thickness / 2
      path += `M${template.TL.x},${template.TL.y} L${template.TR.x},${template.TR.y} L${template.BR.x},${template.BR.y} L${template.BL.x},${template.BL.y} Z `
      path += `M${template.TC.x},${template.TC.y} L${template.TC.x},${template.TC.y + peg} `
      path += `M${template.BC.x},${template.BC.y} L${template.BC.x},${template.BC.y - peg} `
      path += `M${template.CL.x},${template.CL.y} L${template.CL.x + peg},${template.CL.y} `
      path += `M${template.CR.x},${template.CR.y} L${template.CR.x - peg},${template.CR.y} `
    }
    return path
  }

  this.glyph = function (id, yleta, w, h, thickness) {
    let path = ''
    const segs = this.getSegs(yleta)
    for (const i in segs) {
      const seg = segs[i]
      const template = this.template(parseInt(id), parseInt(i), yleta.length / 2, w, h, thickness)
      const consonant = seg.substr(0, 1)
      const vowel = seg.substr(1, 1)
      path += this.consonant(consonant, vowel, template, thickness) + ' ' + this.vowel(consonant, vowel, template, thickness) + ' '
    }
    return path
  }

  this.getSegs = function (yleta) {
    const a = []
    let s = `${yleta}`
    while (s.length > 0) {
      a.push(s.substr(0, 2))
      s = s.substr(2, s.length - 2)
    }
    return a
  }

  this.getBounds = function (w, h, thickness) {
    return { w: this.yleta.split(' ').length * (w + thickness) - thickness, h: h }
  }

  // Outputs

  this.toGrid = function (w = 40, h = 40, thickness = 9) {
    return this.yleta.split(' ').reduce((acc, val, id) => { return `${acc}${this.grid(id, val, w, h, thickness)}` }, '')
  }

  this.toPath = function (w, h, thickness = 9) {
    return this.yleta.split(' ').reduce((acc, val, id) => { return `${acc}${this.glyph(id, val, w, h, thickness)}` }, '')
  }

  this.toSVG = function (w = 40, h = 40, thickness = 9, color = 'black', guide = false) {
    const bounds = this.getBounds(w, h, 10)
    return `
    <svg style='width:${bounds.w}px; height:${bounds.h}px; padding:${thickness / 2}px' title='${this.yleta}' class='yletaodeta'>
      ${guide === true ? `<path d='${this.toGrid(w, h)}' class='guide'/>` : ''}
      <path d='${this.toPath(w, h)}' stroke='${color}' stroke-width='${thickness}'/>
    </svg>`
  }

  this.toString = function (w = 40, h = 40, thickness = 9, color = 'black') {
    return `${this.toSVG(w, h, thickness, color)}`
  }

  // Tools

  function stroke (from, to, template, init = true) {
    return `${init === true ? 'M' : 'L'}${Math.floor(template[from].x)},${Math.floor(template[from].y)} L${Math.floor(template[to].x)},${Math.floor(template[to].y)}`
  }

  function curve (from, to, template, init = true) {
    const push = (template.BC.x - template.BL.x) / 4
    return `${init === true ? 'M' : 'L'}${Math.floor(template[from].x)},${Math.floor(template[from].y)} L${Math.floor(template[from].x + push)},${Math.floor(template[from].y)} L${Math.floor(template[to].x - push)},${Math.floor(template[to].y)} L${Math.floor(template[to].x)},${Math.floor(template[to].y)}`
  }
}

'use strict'

function Septambres (lyta, size = 40, thickness = 9) {
  this.lyta = lyta.toLowerCase()

  this.template = function (glyph_id, seg_id, grid, style) {
    let offset = glyph_id * (style.size.w + (style.thickness + 1))
    let rect = { w: style.size.w, h: style.size.h }
    let angle = grid === 3 && seg_id > 0 || grid === 4 ? 0.25 : 0.75

    if (grid === 1) {
      rect = { x: offset, y: 0, w: style.size.w, h: style.size.h }
    } else if (grid === 2) {
      if (seg_id === 0) { rect = { x: offset, y: 0, w: (style.size.w), h: (style.size.h / 2) } }
      if (seg_id === 1) { rect = { x: offset, y: (style.size.w / 2), w: (style.size.w), h: (style.size.h / 2) } }
    } else if (grid === 3) {
      if (seg_id === 0) { rect = { x: offset, y: 0, w: (style.size.w), h: (style.size.h / 2) } }
      if (seg_id === 1) { rect = { x: offset, y: (style.size.w / 2), w: (style.size.w / 2), h: (style.size.h / 2) } }
      if (seg_id === 2) { rect = { x: offset + (style.size.w / 2), y: (style.size.w / 2), w: (style.size.w / 2), h: (style.size.h / 2) } }
    } else if (grid === 4) {
      if (seg_id === 0) { rect = { x: offset, y: 0, w: (style.size.w / 2), h: (style.size.h / 2) } }
      if (seg_id === 1) { rect = { x: offset + (style.size.w / 2), y: 0, w: (style.size.w / 2), h: (style.size.h / 2) } }
      if (seg_id === 2) { rect = { x: offset, y: (style.size.w / 2), w: (style.size.w / 2), h: (style.size.h / 2) } }
      if (seg_id === 3) { rect = { x: offset + (style.size.w / 2), y: (style.size.w / 2), w: (style.size.w / 2), h: (style.size.h / 2) } }
    } else {
      console.warn('Unknown grid', grid)
    }

    return {
      TL: { x: rect.x, y: rect.y },
      TC: { x: rect.x + (rect.w / 2), y: rect.y },
      TR: { x: rect.x + rect.w, y: rect.y },
      CL: { x: rect.x, y: rect.y + (rect.h / 2) },
      CC: { x: rect.x + (rect.w / 2), y: rect.y + (rect.h / 2) },
      CR: { x: rect.x + rect.w, y: rect.y + (rect.h / 2) },
      BL: { x: rect.x, y: rect.y + rect.h },
      BC: { x: rect.x + (rect.w / 2), y: rect.y + rect.h },
      BR: { x: rect.x + rect.w, y: rect.y + rect.h },
      PUSH: { x: style.thickness * angle, y: style.thickness * angle }
    }
  }

  this.draw = function (seg, template) {
    let html = ''
    let consonant = seg.substr(0, 1)
    let vowel = seg.substr(1, 1)
    let path = ''
    let x = (consonant === 'd' || consonant === 'l' || consonant === 'f') ? 1 : (consonant === 't' || consonant === 's' || consonant === 'v') ? 0 : -1
    let y = (consonant === 'k' || consonant === 't' || consonant === 'd') ? 1 : (consonant === 'r' || consonant === 's' || consonant === 'l') ? 0 : -1
    // Int
    for (let id in template) {
      template[id] = { x: parseInt(template[id].x), y: parseInt(template[id].y) }
    }
    // Consonant
    if (consonant === 'k') { path += `M${template.CL.x},${template.CL.y} L${template.TL.x},${template.TL.y} L${template.TR.x},${template.TR.y} ` } else if (consonant === 't') { path += `M${template.TL.x},${template.TL.y} L${template.TR.x},${template.TR.y} M${template.TC.x},${template.TC.y} L${template.CC.x},${template.CC.y} ` } else if (consonant === 'd') { path += `M${template.TL.x},${template.TL.y} L${template.TR.x},${template.TR.y} L${template.CR.x},${template.CR.y} ` } else if (consonant === 'r') { path += `M${template.TL.x},${template.TL.y} L${template.BL.x},${template.BL.y} M${template.CL.x},${template.CL.y} L${template.CC.x},${template.CC.y} ` } else if (consonant === 's') { path += `M${template.TC.x},${template.TC.y} L${template.BC.x},${template.BC.y} ` } else if (consonant === 'l') { path += `M${template.TR.x},${template.TR.y} L${template.BR.x},${template.BR.y} M${template.CC.x},${template.CC.y} L${template.CR.x},${template.CR.y} ` } else if (consonant === 'j') { path += `M${template.CL.x},${template.CL.y} L${template.BL.x},${template.BL.y} L${template.BR.x},${template.BR.y} ` } else if (consonant === 'v') { path += `M${template.BL.x},${template.BL.y} L${template.BR.x},${template.BR.y} M${template.CC.x},${template.CC.y} L${template.BC.x},${template.BC.y} ` } else if (consonant === 'f') { path += `M${template.BL.x},${template.BL.y} L${template.BR.x},${template.BR.y} L${template.CR.x},${template.CR.y} ` } else if (consonant === '-') { } else { console.warn('Missing consonant', consonant) }
    // Vowel
    if (vowel === 'i') {
      if (consonant === '-') { path += `M${template.CC.x},${template.CC.y} L${template.CC.x - template.PUSH.x},${template.CC.y} L${template.BL.x + template.PUSH.x},${template.BL.y} L${template.BL.x},${template.BL.y} ` } else if (y === -1 || x === -1 && y <= 0) { path += `M${template.CC.x},${template.CC.y} L${template.CC.x + template.PUSH.x},${template.CC.y} L${template.TR.x - template.PUSH.x},${template.TR.y} L${template.TR.x},${template.TR.y} ` } else { path += `M${template.CC.x},${template.CC.y} L${template.CC.x - template.PUSH.x},${template.CC.y} L${template.BL.x + template.PUSH.x},${template.BL.y} L${template.BL.x},${template.BL.y} ` }
    } else if (vowel === 'o') {
      if (consonant === '-') { path += `M${template.CC.x},${template.CC.y} L${template.CC.x - template.PUSH.x},${template.CC.y} L${template.TL.x + template.PUSH.x},${template.TL.y} L${template.TL.x},${template.TL.y} ` } else if (y === -1 || x === 1 && y === 0) { path += `M${template.CC.x},${template.CC.y} L${template.CC.x - template.PUSH.x},${template.CC.y} L${template.TL.x + template.PUSH.x},${template.TL.y} L${template.TL.x},${template.TL.y} ` } else { path += `M${template.CC.x},${template.CC.y} L${template.CC.x + template.PUSH.x},${template.CC.y} L${template.BR.x - template.PUSH.x},${template.BR.y} L${template.BR.x},${template.BR.y} ` }
    } else if (vowel === 'a') {
      if (consonant === '-') { path += `M${template.CC.x},${template.CC.y} L${template.CL.x},${template.CL.y} ` } else if (consonant === 'k' || consonant === 'r' || consonant === 'j' || consonant === 't') { path += `M${template.CC.x},${template.CC.y} L${template.CR.x},${template.CR.y} ` } else if (consonant === 'd' || consonant === 'l' || consonant === 'f' || consonant === 'v') { path += `M${template.CC.x},${template.CC.y} L${template.CL.x},${template.CL.y} ` } else { path += `M${template.CL.x},${template.CL.y} L${template.CR.x},${template.CR.y} ` }
    } else if (vowel === '-' || vowel === 'y') { } else { console.warn('Missing vowel', vowel) }

    return path
  }

  this.grid = function () {
    return 'M0,0 L100,100'
  }

  this.glyph = function (id, lyta, style) {
    let path = ''
    const segs = this.getSegs(lyta)
    for (let i in segs) {
      let template = this.template(parseInt(id), parseInt(i), lyta.length / 2, style)
      path += this.draw(segs[i], template)
    }
    return path
  }

  this.getSegs = function (lyta) {
    const a = []
    let s = `${lyta}`
    while (s.length > 0) {
      a.push(s.substr(0, 2))
      s = s.substr(2, s.length - 2)
    }
    return a
  }

  this.getBounds = function (w, h, thickness) {
    return { w: this.lyta.split(' ').length * (w + thickness), h: h }
  }

  this.toGrid = function (w = 40, h = 40, thickness = 9, color = 'black') {
    const bounds = this.getBounds(w, h, 10)
    const grid = this.grid(w, h)
    const path = this.toPath(w, h)
    return `
    <svg style='width:${bounds.w}px; height:${bounds.h}px; padding:${thickness / 2}px' title='${this.lyta}'>
      <path d='${grid}' stroke='${color}' fill='none' stroke-width='1' stroke-linecap='square' stroke-linejoin='round'/>
      <path d='${path}' stroke='${color}' fill='none' stroke-width='${thickness}' stroke-linecap='square' stroke-linejoin='round'/>
    </svg>`
  }

  this.toPath = function (w, h) {
    const style = { size: { w: w, h: h }, thickness: 9 }
    const parts = this.lyta.split(' ')
    let s = ''
    for (const id in parts) {
      const part = parts[id]
      const glyph = this.glyph(parseInt(id), part, style)
      s += glyph
    }
    return s
  }

  this.toSVG = function (w = 40, h = 40, thickness = 9, color = 'black') {
    const bounds = this.getBounds(w, h, 10)
    const path = this.toPath(w, h)
    return `
    <svg style='width:${bounds.w}px; height:${bounds.h}px; padding:${thickness / 2}px' title='${this.lyta}'>
      <path d='${path}' stroke='${color}' fill='none' stroke-width='${thickness}' stroke-linecap='square' stroke-linejoin='round'/>
    </svg>`
  }

  this.toString = function (w = 40, h = 40, thickness = 9, color = 'black') {
    return `${this.toSVG(w, h, thickness, color)}`
  }
}

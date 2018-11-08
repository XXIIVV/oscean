'use strict'

RIVEN.lib.Map = function MapNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M150,60 L150,60 L150,240 M60,150 L60,150 L240,150 '

  this.is_mapped = false

  this.receive = function (tables) {
    try {
      return this.map(tables)
    } catch (err) {
      console.log(this, err)
    }
  }

  this.map = function (tables) {
    const time = performance.now()
    const count = { links: 0, diaries: 0 }

    // Connect Parents
    for (const id in tables.lexicon) {
      const term = tables.lexicon[id]
      const parent = !term.data.UNDE ? 'HOME' : term.data.UNDE.toUpperCase()
      if (!tables.lexicon[parent]) { console.warn(`Unknown parent ${parent} for ${term.name}`) }
      term.parent = tables.lexicon[parent]
    }

    // Connect children
    for (const id in tables.lexicon) {
      const term = tables.lexicon[id]
      if (!term.parent) { console.warn('Missing parent term', id); continue }
      const parent = term.parent.name
      if (!tables.lexicon[parent]) { console.warn('Missing children term', parent); continue }
      tables.lexicon[parent].children.push(term)
    }

    // Connect links
    for (const id in tables.lexicon) {
      const term = tables.lexicon[id]
      const links = term.find_outgoing()
      for (const id in links) {
        const link = links[id]
        term.outgoing.push(link)
        if (!Ø('database').index[link]) { console.warn('Missing incoming', `${term.name}->${link}`); continue }
        Ø('database').index[link].incoming.push(term.name)
        count.links += 1
      }
    }

    // Connect Logs
    for (const id in tables.horaire) {
      const log = tables.horaire[id]
      const index = log.term.toUpperCase()
      if (!log.term) { console.warn(`Empty log at ${log.time}`); continue }
      if (!tables.lexicon[index]) { console.warn('Missing log term', index); continue }
      log.host = tables.lexicon[index]
      tables.lexicon[index].logs.push(log)
      // Span
      if (log.time.offset < 0) {
        tables.lexicon[index].span.from = `${log.time}`
        if (!tables.lexicon[index].span.to) {
          tables.lexicon[index].span.to = `${log.time}`
        }
      }
      if (!log.photo) { continue }
      if (!log.name) { console.warn(`Missing caption: ${log.photo}`) }
      tables.lexicon[index].diaries.push(log)
      count.diaries += 1
      if (!tables.lexicon[index].featuredLog) {
        tables.lexicon[index].featuredLog = log
        continue
      }
      if (!tables.lexicon[index].featuredLog.isFeatured) {
        tables.lexicon[index].featuredLog = log
        continue
      }
      if (!tables.lexicon[index].featuredLog && log.isFeatured) {
        tables.lexicon[index].featuredLog = log
      }
    }

    // Connect issues
    for (const id in tables.issues) {
      const issue = tables.issues[id]
      const index = issue.term.toUpperCase()
      if (!tables.lexicon[index]) { console.warn('Missing issue parent', index); continue }
      tables.lexicon[index].issues.push(issue)
      issue.host = tables.lexicon[index]
    }
    this.is_mapped = true
    console.info(this.id, `Mapped ${tables.horaire.length} logs, ${count.links} links, ${tables.issues.length} issues, and ${count.diaries} diaries to ${Object.keys(tables.lexicon).length} terms, in ${(performance.now() - time).toFixed(2)}ms.`)
  }
}

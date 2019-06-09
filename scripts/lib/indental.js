'use strict'

function indental (data, Type) {
  function formatLine (line) {
    const a = []
    const h = {}
    for (const id in line.children) {
      const child = line.children[id]
      if (child.key) {
        h[child.key.toUpperCase()] = child.value
      } else if (child.children.length === 0 && child.content) {
        a[a.length] = child.content
      } else {
        h[child.content.toUpperCase()] = formatLine(child)
      }
    }
    return a.length > 0 ? a : h
  }

  function makeLine (line) {
    return {
      indent: line.search(/\S|$/),
      content: line.trim(),
      skip: line.trim() === '' || line.substr(0, 1) === ';',
      key: line.indexOf(' : ') > -1 ? line.split(' : ')[0].trim() : null,
      value: line.indexOf(' : ') > -1 ? line.split(' : ')[1].trim() : null,
      children: []
    }
  }

  function shouldSkip (line) {
    return line.trim() !== '' && line.substr(0, 1) !== ';'
  }

  const lines = data.split('\n').filter(shouldSkip).map(makeLine)

  // Assoc lines
  const stack = {}
  for (const id in lines) {
    const line = lines[id]
    if (line.skip) { continue }
    const target = stack[line.indent - 2]
    if (target) { target.children[target.children.length] = line }
    stack[line.indent] = line
  }

  // Format
  const h = {}
  for (const id in lines) {
    const line = lines[id]
    if (line.skip || line.indent > 0) { continue }
    const key = line.content.toUpperCase()
    if (h[key]) { console.warn(`Redefined key: ${key}, line ${id}.`) }
    h[key] = Type ? new Type(key, formatLine(line)) : formatLine(line)
  }
  return h
}

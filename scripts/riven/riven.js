
// "Don't forget, the portal combination's in my journal."" — Catherine

'use strict'

// Globals

function Riven () {
  this.lib = {}
  this.network = {}

  this.add = function (node) {
    this.network[node.id] = node
  }
}

const RIVEN = new Riven()

// QUERY

function Ø (id) {
  return RIVEN.network[id] ? RIVEN.network[id] : new RIVEN.Node(id)
}

// NODE

RIVEN.Node = function (id, rect = { x: 0, y: 0, w: 2, h: 2 }) {
  const PORT_TYPES = { default: 0, input: 1, output: 2, request: 3, answer: 4 }
  const ROUTE_TYPES = { default: 0, request: 1 }

  this.id = id
  this.ports = {}
  this.rect = rect
  this.parent = null
  this.children = []
  this.label = id
  this.glyph = 'M155,65 A90,90 0 0,1 245,155 A90,90 0 0,1 155,245 A90,90 0 0,1 65,155 A90,90 0 0,1 155,65 Z'

  this.setup = function (pos) {
    this.ports.input = new Port(this, 'in', PORT_TYPES.input)
    this.ports.output = new Port(this, 'out', PORT_TYPES.output)
    this.ports.answer = new Port(this, 'answer', PORT_TYPES.answer)
    this.ports.request = new Port(this, 'request', PORT_TYPES.request)
    this.rect.x = pos.x
    this.rect.y = pos.y
  }

  this.create = function (pos = { x: 0, y: 0 }, Type, ...params) {
    if(!Type){ console.warn(`Unknown NodeType for #${this.id}`); return this }
    const node = new Type(this.id, rect, ...params)
    node.setup(pos)
    RIVEN.add(node)
    return node
  }

  this.mesh = function (pos, n) {
    const node = new Mesh(this.id, pos)
    node.setup()
    RIVEN.add(node)
    if (n instanceof Array) {
      for (const id in n) {
        n[id].parent = node
        node.children.push(n[id])
        node.update()
      }
    } else {
      n.parent = node
      node.children.push(n)
      node.update()
    }
    return node
  }

  // Connect

  this.connect = function (q, syphon) {
    if (q instanceof Array) {
      for (const id in q) {
        this.connect(q[id], syphon)
      }
    } 
    else if(syphon){
      this.ports.request.connect(Ø(q).ports.answer)
    }
    else {
      this.ports.output.connect(Ø(q).ports.input)
    }
  }

  this.syphon = function (q) {
    this.connect(q, true)
  }

  this.bind = function (q) {
    this.connect(q)
    this.syphon(q)
  }

  // Target

  this.signal = function (target) {
    for (const portId in this.ports) {
      const port = this.ports[portId]
      for (const routeId in port.routes) {
        const route = port.routes[routeId]
        if (!route || !route.host || route.host.id !== target.toLowerCase()) { continue }
        return route.host
      }
    }
    return null
  }

  // SEND/RECEIVE

  this.send = function (payload) {
    for (const routeId in this.ports.output.routes) {
      const route = this.ports.output.routes[routeId]
      if (!route) { continue }
      route.host.receive(payload)
    }
  }

  this.receive = function (q) {
    const port = this.ports.output
    for (const routeId in port.routes) {
      const route = port.routes[routeId]
      if (route) {
        route.host.receive(q)
      }
    }
  }

  this.bang = function () {
    this.send(true)
  }

  // REQUEST/ANSWER

  this.request = function (q) {
    const payload = {}
    for (const routeId in this.ports.request.routes) {
      const route = this.ports.request.routes[routeId]
      if (!route) { continue }
      const answer = route.host.answer(q)
      if (!answer) { continue }
      payload[route.host.id] = answer
    }
    return payload
  }

  this.answer = function (q) {
    return this.request(q)
  }

  // PORT

  function Port (host, id, type = PORT_TYPES.default) {
    this.host = host
    this.id = id
    this.type = type
    this.routes = []

    this.connect = function (port) {
      if(!port){ console.warn(`Unknown port: ${this.host.id}`); return; }
      console.log(`Connect ${this.host.id}.${this.id} -> ${port.host.id}.${port.id}`)
      this.routes.push(port)
    }
  }

  // MESH

  function Mesh (id, rect) {
    RIVEN.Node.call(this, id, rect)

    this.is_mesh = true

    this.setup = function () {}

    this.update = function () {
      const bounds = { x: 0, y: 0 }
      for (const id in this.children) {
        const node = this.children[id]
        bounds.x = node.rect.x > bounds.x ? node.rect.x : bounds.x
        bounds.y = node.rect.y > bounds.y ? node.rect.y : bounds.y
      }
      this.rect.w = bounds.x + 4
      this.rect.h = bounds.y + 5
    }
  }
}

// GRAPH

RIVEN.graph = () => {
  const network = RIVEN.network
  const GRID_SIZE = 20
  const PORT_TYPES = { default: 0, input: 1, output: 2, request: 3, answer: 4 }

  this.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  this.el.id = 'riven'
  document.body.appendChild(this.el)

  const _routes = Object.keys(network).reduce((acc, val, id) => {
    return `${acc}${drawRoutes(network[val])}`
  }, '')

  const _nodes = Object.keys(network).reduce((acc, val, id) => {
    return `${acc}${drawNode(network[val])}`
  }, '')

  this.el.innerHTML = `${_routes}${_nodes}`

  function drawRoutes (node) {
    let html = ''
    for (const id in node.ports) {
      const port = node.ports[id]
      for (const routeId in port.routes) {
        const route = port.routes[routeId]
        if (!route) { continue }
        html += route ? drawConnection(port, route) : ''
      }
    }
    return `<g id='routes'>${html}</g>`
  }

  function drawNode (node) {
    const rect = getRect(node)
    const pad = 6
    return `
    <g class='node ${node.is_mesh ? 'mesh' : ''}' id='node_${node.id}'>
      <rect rx='2' ry='2' x=${rect.x} y=${rect.y - (GRID_SIZE / 2)} width="${rect.w}" height="${rect.h}" class='${node.children.length === 0 ? 'fill' : ''}'/>
      <text x="${rect.x + (rect.w / 2) + (GRID_SIZE * 0.3)}" y="${rect.y + rect.h + (GRID_SIZE * 0.2)}">${node.label}</text>
      ${drawPorts(node)}
      <rect rx='2' ry='2' x=${rect.x+(pad/2)} y=${(rect.y - (GRID_SIZE / 2))+(pad/2)} width="${rect.w-pad}" height="${rect.h-pad}" class='outline'/>
      ${drawGlyph(node)}
    </g>`
  }

  function drawPorts (node) {
    return Object.keys(node.ports).reduce((acc, val, id) => {
      return `${acc}${drawPort(node.ports[val])}`
    }, '')
  }

  function drawGlyph (node) {
    const rect = getRect(node)
    return !node.is_mesh && node.glyph ? `<path class='glyph' transform="translate(${rect.x + (GRID_SIZE / 4)},${rect.y - (GRID_SIZE / 4)}) scale(0.1)" d='${node.glyph}'/>` : ''
  }

  function drawPort (port) {
    const pos = port ? getPortPosition(port) : { x: 0, y: 0 }
    return `<g id='${port.host.id}_port_${port.id}'><path d='${drawDiamond(pos)}' class='port ${port.type} ${port.host.ports[port.id] && port.host.ports[port.id].route ? 'route' : ''}' /></g>`
  }

  function drawConnection (a, b, type) {
    if (isBidirectional(a.host, b.host)) {
      return a.type !== PORT_TYPES.output ? drawConnectionBidirectional(a, b) : ''
    }

    return a.type === PORT_TYPES.output ? drawConnectionOutput(a, b) : drawConnectionRequest(a, b)
  }

  function isBidirectional (a, b) {
    for (const id in a.ports.output.routes) {
      const routeA = a.ports.output.routes[id]
      for (const id in a.ports.request.routes) {
        const routeB = a.ports.request.routes[id]
        if (routeA.host.id === routeB.host.id) {
          return true
        }
      }
    }
    return false
  }

  function drawConnectionOutput (a, b) {
    const posA = getPortPosition(a)
    const posB = getPortPosition(b)
    const posM = middle(posA, posB)
    const posC1 = { x: (posM.x + (posA.x + GRID_SIZE)) / 2, y: posA.y }
    const posC2 = { x: (posM.x + (posB.x - GRID_SIZE)) / 2, y: posB.y }

    let path = ''

    path += `M${posA.x},${posA.y} L${posA.x + GRID_SIZE},${posA.y} `
    path += `Q${posC1.x},${posC1.y} ${posM.x},${posM.y} `
    path += `Q ${posC2.x},${posC2.y} ${posB.x - GRID_SIZE},${posB.y}`
    path += `L${posB.x},${posB.y}`

    return `<path d="${path}" class='route output'/>
    <circle cx='${posM.x}' cy='${posM.y}' r='2' fill='white'></circle>`
  }

  function drawConnectionRequest (a, b) {
    const posA = getPortPosition(a)
    const posB = getPortPosition(b)
    const posM = middle(posA, posB)
    const posC1 = { x: posA.x, y: (posM.y + (posA.y + GRID_SIZE)) / 2 }
    const posC2 = { x: posB.x, y: (posM.y + (posB.y - GRID_SIZE)) / 2 }

    let path = ''

    path += `M${posA.x},${posA.y} L${posA.x},${posA.y + GRID_SIZE} `
    path += `Q${posC1.x},${posC1.y} ${posM.x},${posM.y} `
    path += `Q ${posC2.x},${posC2.y} ${posB.x},${posB.y - GRID_SIZE}`
    path += `L${posB.x},${posB.y}`

    return `<path d="${path}" class='route request'/>
    <circle cx='${posM.x}' cy='${posM.y}' r='2' fill='white'></circle>`
  }

  function drawConnectionBidirectional (a, b) {
    const posA = getPortPosition(a)
    const posB = getPortPosition(b)
    const posM = middle(posA, posB)

    let path = ''

    path += `M${posA.x},${posA.y} L${posA.x},${posA.y + GRID_SIZE} `
    path += `L${posA.x},${posM.y} L${posB.x},${posM.y}`
    path += `L${posB.x},${posB.y - GRID_SIZE} L${posB.x},${posB.y}`

    return `<path d="${path}" class='route bidirectional'/>`
  }

  function drawDiamond (pos) {
    const r = GRID_SIZE / 6
    return `M${pos.x - (r)},${pos.y} L${pos.x},${pos.y - (r)} L${pos.x + (r)},${pos.y} L${pos.x},${pos.y + (r)} Z`
  }

  function getPortPosition (port) {
    const rect = getRect(port.host)
    let offset = { x: 0, y: 0 }

    if (port.type === PORT_TYPES.output) {
      offset = { x: GRID_SIZE * 2, y: GRID_SIZE / 2 }
    } else if (port.type === PORT_TYPES.input) {
      offset = { x: 0, y: GRID_SIZE / 2 }
    } else if (port.type === PORT_TYPES.answer) {
      offset = { x: GRID_SIZE, y: -GRID_SIZE * 0.5 }
    } else if (port.type === PORT_TYPES.request) {
      offset = { x: GRID_SIZE, y: GRID_SIZE * 1.5 }
    }
    return { x: rect.x + offset.x, y: rect.y + offset.y }
  }

  function getRect (node) {
    const w = node.rect.w * GRID_SIZE
    const h = node.rect.h * GRID_SIZE
    let x = node.rect.x * GRID_SIZE
    let y = node.rect.y * GRID_SIZE

    if (node.parent) {
      const offset = getRect(node.parent)
      x += offset.x
      y += offset.y
    }
    return { x: x, y: y, w: w, h: h }
  }

  function middle (a, b) {
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
  }

  // Cursor

  this.cursor = {
    host: null,
    el: document.createElement('cursor'),
    pos: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    origin: null,
    install: function (host) {
      this.host = host
      document.body.appendChild(this.el)
      document.addEventListener('mousedown', (e) => { this.touch({ x: e.clientX, y: e.clientY }, true); e.preventDefault() })
      document.addEventListener('mousemove', (e) => { this.touch({ x: e.clientX, y: e.clientY }, false); e.preventDefault() })
      document.addEventListener('mouseup', (e) => { this.touch({ x: e.clientX, y: e.clientY }); e.preventDefault() })
    },
    update: function () {
      this.host.el.style.left = `${parseInt(this.offset.x)}px`
      this.host.el.style.top = `${parseInt(this.offset.y)}px`
      document.body.style.backgroundPosition = `${parseInt(this.offset.x / 2)}px ${parseInt(this.offset.y / 2)}px`
    },
    touch: function (pos, click = null) {
      if (click === true) {
        this.origin = pos
        return
      }
      if (this.origin) {
        this.offset.x += (pos.x - this.origin.x) / 2
        this.offset.y += (pos.y - this.origin.y) / 2
        this.update()
        this.origin = pos
      }
      if (click === null) {
        this.origin = null
        return
      }
      this.pos = pos
    },
    magnet: function (val) {
      return (parseInt(val / GRID_SIZE) * GRID_SIZE) + (GRID_SIZE / 2)
    }
  }

  this.cursor.install(this)
}

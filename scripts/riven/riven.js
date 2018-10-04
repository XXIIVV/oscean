
// "Don't forget, the portal combination's in my journal."" — Catherine

'use strict'

function Riven () {
  this.lib = {}
  this.network = {}
}

const RIVEN = new Riven()

// QUERY

function Ø (s) {
  const network = RIVEN.network
  const id = s.toLowerCase()
  if (id.indexOf(' ') > -1) {
    const node_id = id.split(' ')[0]
    const port_id = id.split(' ')[1]
    return network[node_id] && network[node_id].ports[port_id] ? network[node_id].ports[port_id] : null
  } else if (network[id]) {
    return network[id]
  } else {
    return new RIVEN.Node(id)
  }
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

  this.setup = function () {
    this.ports.input = new Port(this, 'in', PORT_TYPES.input)
    this.ports.output = new Port(this, 'out', PORT_TYPES.output)
    this.ports.answer = new Port(this, 'answer', PORT_TYPES.answer)
    this.ports.request = new Port(this, 'request', PORT_TYPES.request)
  }

  this.create = function (pos = { x: 0, y: 0 }, Type = this.Node, ...params) {
    const node = new Type(this.id, rect, ...params)
    this.rect.x = pos.x
    this.rect.y = pos.y
    node.setup()
    RIVEN.network[node.id] = node
    return node
  }

  this.mesh = function (pos, n) {
    const node = new Mesh(this.id, pos)
    node.rect.x = pos.x
    node.rect.y = pos.y
    node.setup()
    RIVEN.network[node.id] = node

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

  this.connect = function (q, type = ROUTE_TYPES.output) {
    if (q instanceof Array) {
      for (const id in q) {
        this.connect(q[id], type)
      }
    } else {
      this.ports[type === ROUTE_TYPES.request ? 'request' : 'output'].connect(`${q} ${type === ROUTE_TYPES.request ? 'answer' : 'input'}`, type)
    }
  }

  this.syphon = function (q) {
    this.connect(q, ROUTE_TYPES.request)
  }

  this.bind = function (q) {
    this.connect(q)
    this.syphon(q)
  }

  // Target

  this.signal = function (target) {
    for (const port_id in this.ports) {
      const port = this.ports[port_id]
      for (const route_id in port.routes) {
        const route = port.routes[route_id]
        if (!route || !route.host || route.host.id !== target.toLowerCase()) { continue }
        return route.host
      }
    }
    return null
  }

  // SEND/RECEIVE

  this.send = function (payload) {
    for (const route_id in this.ports.output.routes) {
      const route = this.ports.output.routes[route_id]
      if (!route) { continue }
      route.host.receive(payload)
    }
  }

  this.receive = function (q) {
    const port = this.ports.output
    for (const route_id in port.routes) {
      const route = port.routes[route_id]
      if (route) {
        route.host.receive(q)
      }
    }
  }

  this.bang = function () {
    this.send(true)
  }

  // REQUEST/ANSWER

  this.answer = function (q) {
    return this.request(q)
  }

  this.request = function (q) {
    const payload = {}
    for (const route_id in this.ports.request.routes) {
      const route = this.ports.request.routes[route_id]
      if (!route) { continue }
      const answer = route.host.answer(q)
      if (!answer) { continue }
      payload[route.host.id] = answer
    }
    return payload
  }

  // PORT

  function Port (host, id, type = PORT_TYPES.default) {
    this.host = host
    this.id = id
    this.type = type
    this.routes = []

    this.connect = function (b, type = 'transit') {
      this.routes.push(Ø(b))
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
  const ROUTE_TYPES = { default: 0, request: 1 }

  this.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  document.body.appendChild(this.el)

  const _routes = Object.keys(network).reduce((acc, val, id) => {
    return `${acc}${draw_routes(network[val])}`
  }, '')
  const _nodes = Object.keys(network).reduce((acc, val, id) => {
    return `${acc}${draw_node(network[val])}`
  }, '')
  this.el.innerHTML = `${_routes}${_nodes}`

  function draw_routes (node) {
    let html = ''
    for (const id in node.ports) {
      const port = node.ports[id]
      const pos = port ? get_port_position(port) : { x: 0, y: 0 }
      for (const route_id in port.routes) {
        const route = port.routes[route_id]
        if (!route) { continue }
        html += route ? draw_connection(port, route) : ''
      }
    }
    return `<g id='routes'>${html}</g>`
  }

  function draw_node (node) {
    const rect = get_rect(node)
    return `
    <g class='node ${node.is_mesh ? 'mesh' : ''}' id='node_${node.id}'>
      <rect rx='2' ry='2' x=${rect.x} y=${rect.y - (GRID_SIZE / 2)} width="${rect.w}" height="${rect.h}" class='${node.children.length === 0 ? 'fill' : ''}'/>
      <text x="${rect.x + (rect.w / 2)}" y="${rect.y + rect.h + (GRID_SIZE / 2)}">${node.label}</text>
      ${draw_ports(node)}
      ${draw_glyph(node)}
    </g>`
  }

  function draw_ports (node) {
    return Object.keys(node.ports).reduce((acc, val, id) => {
      return `${acc}${draw_port(node.ports[val])}`
    }, '')
  }

  function draw_glyph (node) {
    const rect = get_rect(node)
    return !node.is_mesh && node.glyph ? `<path class='glyph' transform="translate(${rect.x + (GRID_SIZE / 4)},${rect.y - (GRID_SIZE / 4)}) scale(0.1)" d='${node.glyph}'/>` : ''
  }

  function draw_port (port) {
    const pos = port ? get_port_position(port) : { x: 0, y: 0 }
    return `<g id='${port.host.id}_port_${port.id}'>${(port.type === PORT_TYPES.request || port.type === PORT_TYPES.answer) ? `<path d='${draw_diamond(pos)}' class='port ${port.type} ${port.host.ports[port.id] && port.host.ports[port.id].route ? 'route' : ''}' />` : `<circle cx='${pos.x}' cy="${pos.y}" r="${parseInt(GRID_SIZE / 6)}" class='port ${port.type} ${port.host.ports[port.id] && port.host.ports[port.id].route ? 'route' : ''}'/>`}</g>`
  }

  function draw_connection (a, b, type) {
    if (is_bidirectional(a.host, b.host)) {
      return a.type !== PORT_TYPES.output ? draw_connection_bidirectional(a, b) : ''
    }

    return a.type === PORT_TYPES.output ? draw_connection_output(a, b) : draw_connection_request(a, b)
  }

  function is_bidirectional (a, b) {
    for (const id in a.ports.output.routes) {
      const route_a = a.ports.output.routes[id]
      for (const id in a.ports.request.routes) {
        const route_b = a.ports.request.routes[id]
        if (route_a.host.id === route_b.host.id) {
          return true
        }
      }
    }
    return false
  }

  function draw_connection_output (a, b) {
    const pos_a = get_port_position(a)
    const pos_b = get_port_position(b)
    const pos_m = middle(pos_a, pos_b)
    const pos_c1 = { x: (pos_m.x + (pos_a.x + GRID_SIZE)) / 2, y: pos_a.y }
    const pos_c2 = { x: (pos_m.x + (pos_b.x - GRID_SIZE)) / 2, y: pos_b.y }

    let path = ''

    path += `M${pos_a.x},${pos_a.y} L${pos_a.x + GRID_SIZE},${pos_a.y} `
    path += `Q${pos_c1.x},${pos_c1.y} ${pos_m.x},${pos_m.y} `
    path += `Q ${pos_c2.x},${pos_c2.y} ${pos_b.x - GRID_SIZE},${pos_b.y}`
    path += `L${pos_b.x},${pos_b.y}`

    return `<path d="${path}" class='route output'/>
    <circle cx='${pos_m.x}' cy='${pos_m.y}' r='2' fill='white'></circle>`
  }

  function draw_connection_request (a, b) {
    const pos_a = get_port_position(a)
    const pos_b = get_port_position(b)
    const pos_m = middle(pos_a, pos_b)
    const pos_c1 = { x: pos_a.x, y: (pos_m.y + (pos_a.y + GRID_SIZE)) / 2 }
    const pos_c2 = { x: pos_b.x, y: (pos_m.y + (pos_b.y - GRID_SIZE)) / 2 }

    let path = ''

    path += `M${pos_a.x},${pos_a.y} L${pos_a.x},${pos_a.y + GRID_SIZE} `
    path += `Q${pos_c1.x},${pos_c1.y} ${pos_m.x},${pos_m.y} `
    path += `Q ${pos_c2.x},${pos_c2.y} ${pos_b.x},${pos_b.y - GRID_SIZE}`
    path += `L${pos_b.x},${pos_b.y}`

    return `<path d="${path}" class='route request'/>
    <circle cx='${pos_m.x}' cy='${pos_m.y}' r='2' fill='white'></circle>`
  }

  function draw_connection_bidirectional (a, b) {
    const pos_a = get_port_position(a)
    const pos_b = get_port_position(b)
    const pos_m = middle(pos_a, pos_b)
    const pos_c1 = { x: pos_a.x, y: (pos_m.y + (pos_a.y + GRID_SIZE)) / 2 }
    const pos_c2 = { x: pos_b.x, y: (pos_m.y + (pos_b.y - GRID_SIZE)) / 2 }

    let path = ''

    path += `M${pos_a.x},${pos_a.y} L${pos_a.x},${pos_a.y + GRID_SIZE} `
    path += `L${pos_a.x},${pos_m.y} L${pos_b.x},${pos_m.y}`
    path += `L${pos_b.x},${pos_b.y - GRID_SIZE} L${pos_b.x},${pos_b.y}`

    return `<path d="${path}" class='route bidirectional'/>`
  }

  function draw_diamond (pos) {
    const r = GRID_SIZE / 6
    return `M${pos.x - (r)},${pos.y} L${pos.x},${pos.y - (r)} L${pos.x + (r)},${pos.y} L${pos.x},${pos.y + (r)} Z`
  }

  function get_port_position (port) {
    const rect = get_rect(port.host)
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

  function get_rect (node) {
    const rect = node.rect
    const w = node.rect.w * GRID_SIZE
    const h = node.rect.h * GRID_SIZE
    let x = node.rect.x * GRID_SIZE
    let y = node.rect.y * GRID_SIZE

    if (node.parent) {
      const offset = get_rect(node.parent)
      x += offset.x
      y += offset.y
    }
    return { x: x, y: y, w: w, h: h }
  }

  function distance (a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y))
  }

  function diagonal (a, b) {
    return a.x === b.x || a.y === b.y || a.y - a.x === b.y - b.x || b.y - a.x === a.y - b.x
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

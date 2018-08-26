
// "Don't forget, the portal combination's in my journal."" — Catherine

function Riven()
{
  this.is_graph = false;
  this.network = {}
}

// QUERY

function Ø(s,network = RIVEN.network)
{
  let id = s.toLowerCase();
  if(id.indexOf(" ") > -1){
    let node_id = id.split(" ")[0];
    let port_id = id.split(" ")[1];
    return network[node_id] && network[node_id].ports[port_id] ? network[node_id].ports[port_id] : null;
  }
  else if(network[id]){
    return network[id];
  }
  else{
    return new Node(id);
  }
}

// NODE

function Node(id,rect={x:0,y:0,w:2,h:2})
{
  this.id = id;
  this.ports = {}
  this.rect = rect;
  this.parent = null;
  this.children = [];
  this.label = id;

  this.setup = function()
  {
    this.ports.input = new Port(this,"in",PORT_TYPES.input)
    this.ports.output = new Port(this,"out",PORT_TYPES.output)
    this.ports.answer = new Port(this,"answer",PORT_TYPES.answer)
    this.ports.request = new Port(this,"request",PORT_TYPES.request)
  }

  this.create = function(pos = {x:0,y:0},type = Node,...params)
  {
    let node = new type(this.id,rect,...params)  
    this.rect.x = pos.x
    this.rect.y = pos.y
    node.setup();
    RIVEN.network[node.id] = node
    return node
  }

  this.mesh = function(pos,n)
  {
    let node = new Mesh(this.id,pos)  
    node.rect.x = pos.x
    node.rect.y = pos.y
    node.setup();
    RIVEN.network[node.id] = node

    if(n instanceof Array){
      for(let id in n){
        n[id].parent = node;
        node.children.push(n[id]);  
        node.update();
      }
    }
    else{
      n.parent = node;
      node.children.push(n);  
      node.update();
    }
    return node;
  }

  // Connect

  this.connect = function(q,type = ROUTE_TYPES.output)
  {
    if(q instanceof Array){
      for(let id in q){
        this.connect(q[id],type)
      }
    }
    else{
      this.ports[type == ROUTE_TYPES.request ? "request" : "output"].connect(`${q} ${type == ROUTE_TYPES.request ? "answer" : "input"}`,type);  
    }
  }

  this.syphon = function(q)
  {
    this.connect(q,ROUTE_TYPES.request)
  }

  this.bind = function(q)
  {
    this.connect(q)
    this.syphon(q)
  }

  // Target

  this.signal = function(target)
  {
    for(port_id in this.ports){
      let port = this.ports[port_id]
      for(route_id in port.routes){
        let route = port.routes[route_id];
        if(!route || !route.host || route.host.id != target.toLowerCase()){ continue; }
        return route.host
      }
    }
    return null;
  }

  // SEND/RECEIVE

  this.send = function(payload)
  {
    for(route_id in this.ports.output.routes){
      let route = this.ports.output.routes[route_id];
      if(!route){ continue; }
      route.host.receive(payload)
    }
  }
  
  this.receive = function(q)
  {
    let port = this.ports.output
    for(route_id in port.routes){
      let route = port.routes[route_id];
      if(route){
        route.host.receive(q)  
      }
    }
  }

  this.bang = function()
  {
    this.send(true)
  }

  // REQUEST/ANSWER

  this.answer = function(q)
  {
    return this.request(q)
  }

  this.request = function(q)
  {
    let payload = {};
    for(route_id in this.ports.request.routes){
      let route = this.ports.request.routes[route_id];
      if(!route){ continue; }
      let answer = route.host.answer(q)
      if(!answer){ continue; }
      payload[route.host.id] = answer
    }
    return payload
  }

  // PORT

  function Port(host,id,type = PORT_TYPES.default)
  {
    this.host = host;
    this.id = id;
    this.type = type;
    this.routes = [];

    this.connect = function(b,type = "transit")
    {
      this.routes.push(Ø(b))
    }
  }

  // MESH

  function Mesh(id,rect) 
  {
    Node.call(this,id,rect);

    this.is_mesh = true;

    this.setup = function(){}

    this.update = function()
    {
      let bounds = {x:0,y:0};
      for(let id in this.children){
        let node = this.children[id];
        bounds.x = node.rect.x > bounds.x ? node.rect.x : bounds.x
        bounds.y = node.rect.y > bounds.y ? node.rect.y : bounds.y
      }
      this.rect.w = bounds.x+4;
      this.rect.h = bounds.y+5;
    }
  }
}

let PORT_TYPES = {default:"default",input:"input",output:"output",request:"request",answer:"answer"}
let ROUTE_TYPES = {default:"default",request:"request"}

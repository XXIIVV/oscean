
// "Don't forget, the portal combination's in my journal."" — Catherine

function Riven()
{
  this.is_graph = false;

  this.network = {}
}

// QUERY

function Ø(s,network = RIVEN.network)
{
  var id = s.toLowerCase();
  if(id.indexOf(" ") > -1){
    var node_id = id.split(" ")[0];
    var port_id = id.split(" ")[1];
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
    var node = new type(this.id,rect,...params)  
    this.rect.x = pos.x
    this.rect.y = pos.y
    node.setup();
    RIVEN.network[node.id] = node
    return node
  }

  this.mesh = function(pos,n)
  {
    var node = new Mesh(this.id,pos)  
    node.rect.x = pos.x
    node.rect.y = pos.y
    node.setup();
    RIVEN.network[node.id] = node

    if(n instanceof Array){
      for(id in n){
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
      for(id in q){
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
      var port = this.ports[port_id]
      for(route_id in port.routes){
        var route = port.routes[route_id];
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
      var route = this.ports.output.routes[route_id];
      if(!route){ continue; }
      route.host.receive(payload)
    }
  }
  
  this.receive = function(q)
  {
    var port = this.ports.output
    for(route_id in port.routes){
      var route = port.routes[route_id];
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
    var payload = {};
    for(route_id in this.ports.request.routes){
      var route = this.ports.request.routes[route_id];
      if(!route){ continue; }
      var answer = route.host.answer(q)
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
      var bounds = {x:0,y:0};
      for(id in this.children){
        var node = this.children[id];
        bounds.x = node.rect.x > bounds.x ? node.rect.x : bounds.x
        bounds.y = node.rect.y > bounds.y ? node.rect.y : bounds.y
      }
      this.rect.w = bounds.x+4;
      this.rect.h = bounds.y+5;
    }
  }
}

var PORT_TYPES = {default:"default",input:"input",output:"output",request:"request",answer:"answer"}
var ROUTE_TYPES = {default:"default",request:"request"}
var NODE_GLYPHS = {
  database:"M60,60 L60,60 L240,60 L240,240 L60,240 Z M60,150 L60,150 L240,150 M60,105 L60,105 L240,105 M60,195 L60,195 L240,195 ",
  table:"M60,60 L60,60 L240,60 L240,240 L60,240 Z M120,120 L120,120 L180,120 M120,180 L120,180 L180,180 M120,150 L120,150 L180,150",

  build:"M60,60 L60,60 L240,60 L240,240 L60,240 Z M150,60 L150,60 L240,150 L150,240 ",
  filter:"M60,60 L60,60 L240,60 L240,240 L60,240 Z M150,60 L150,60 L150,240 M60,150 L60,150 L240,150 ",
  template:"M60,60 L60,60 L240,60 L240,240 L60,240 Z",
  element:"M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240",

  default: "M150,60 L150,60 L60,150 L150,240 L240,150 Z",
  router:"M60,120 L60,120 L150,120 L240,60 M60,150 L60,150 L240,150 M60,180 L60,180 L150,180 L240,240",
  parser:"M60,60 L60,60 L240,60 M120,120 A30,30 0 0,1 150,150 M150,150 A30,30 0 0,0 180,180 M180,180 L180,180 L240,180 M120,120 L120,120 L60,120 M60,240 L60,240 L240,240 M240,120 L240,120 L180,120 M60,180 L60,180 L120,180",
  entry:"M60,150 L60,150 L240,150 L240,150 L150,240 M150,60 L150,60 L240,150",
  bang:"M150,60 L150,60 L150,180 M150,240 L150,240 L150,240",
  value:"M60,60 L60,60 L240,60 L240,240 L60,240 Z M60,150 L60,150 L240,150",
  equal:"M60,60 L60,60 L240,60 M60,120 L60,120 L240,120 M60,180 L60,180 L240,180 M60,240 L60,240 L240,240",
  render:"M150,60 L150,60 L240,150 L150,240 L60,150 Z M150,120 L150,120 L180,150 L150,180 L120,150 Z ",
  
  cache:"M60,60 L60,60 L240,60 L240,240 L60,240 Z",
  builder:"M60,60 L60,60 L150,120 L240,120 M60,150 L60,150 L240,150 M60,240 L60,240 L150,180 L240,180",
  selector:"M90,60 L90,60 L60,60 L60,90 M60,210 L60,210 L60,240 L90,240 M210,240 L210,240 L240,240 L240,210 M240,90 L240,90 L240,60 L210,60",
  dom: "M150,60 L150,60 L60,150 L150,240 L240,150 Z",
  photo: "M60,90 L60,90 L60,60 L90,60 M210,60 L210,60 L240,60 L240,90 M240,210 L240,210 L240,240 L210,240 M90,240 L90,240 L60,240 L60,210 ",
  aggregator: "M150,60 L150,60 L240,150 L150,240 M120,90 L120,90 L180,150 L120,210 M90,120 L90,120 L120,150 L90,180 M60,150 L60,150 L60,150  ",
}
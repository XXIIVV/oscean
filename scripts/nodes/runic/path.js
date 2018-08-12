function PathNode(id,rect,...params)
{
  DomNode.call(this,id,rect);

  this.type = params[0] ? params[0] : "div";
  this.glyph = NODE_GLYPHS.dom
  this.label = `${this.id}:${this.type}`
  this.el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  this.el.id = this.id
  this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  this.path.setAttribute("transform","scale(0.175,0.175) translate(-50,-50)")
  this.el.appendChild(this.path)
  this.is_installed = false;

  this.receive = function(content)
  {
    if(content && content[this.id] != null){
      this.update(content[this.id]);
      this.send(content[this.id])
    }
  }

  this.update = function(content)
  {
    if(typeof content == "string"){
      this.path.setAttribute("d",content)
    }
  }
}
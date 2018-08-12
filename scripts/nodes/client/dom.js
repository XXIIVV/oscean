function DomNode(id,rect,...params)
{
  Node.call(this,id,rect);

  this.type = params[0] ? params[0] : "div";
  this.glyph = NODE_GLYPHS.dom
  this.label = `#${this.id}`
  this.el = document.createElement(this.type)
  this.el.id = this.id
  this.is_installed = false;

  if(params[1]){
    this.el.innerHTML = params[1]
  }

  this.receive = function(content)
  {
    if(content && content[this.id] != null){
      this.update(content[this.id]);
      this.send(content[this.id])
    }
  }

  this.answer = function()
  {
    if(!this.is_installed){
      this.install(this.request());
    }
    return this.el
  }

  this.install = function(elements)
  {
    this.is_installed = true;
    for(id in elements){
      this.el.appendChild(elements[id])
    }
  }

  this.update = function(content)
  {
    if(typeof content == "string"){
      this.el.innerHTML = content;
      this.el.className = !content || content.trim() == "" ? "empty" : ""
    }
  }
}
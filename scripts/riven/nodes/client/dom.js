'use strict';

function DomNode(id,rect,...params)
{
  Node.call(this,id,rect);

  this.type = params[0] ? params[0] : "div";
  this.glyph = "M150,60 L150,60 L60,150 L150,240 L240,150 Z"
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
    for(let id in elements){
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

  // Class

  this.set_class = function(c)
  {
    this.el.className = `${c.toLowerCase()}`;
  }

  this.add_class = function(c)
  {
    if(this.has_class(c)){ return; }

    this.el.className = `${this.el.className} ${c.toLowerCase()}`.trim();
  }

  this.remove_class = function(c)
  {
    if(!this.has_class(c)){ return; }
    this.el.className = this.el.className.replace(c.toLowerCase(),"").trim();
  }

  this.has_class = function(c)
  {
    return this.el.className.indexOf(c.toLowerCase()) > -1;
  }
}
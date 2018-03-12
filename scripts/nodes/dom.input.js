function InputNode(id,rect,...params)
{
  DomNode.call(this,id,rect,...params);
  
  this.el = document.createElement("input")
  this.el.id = this.id
  this.is_installed = false;
  
  this.el.addEventListener("keydown",(e)=>{ this.on_input(e); })
  
  this.on_input = function(e)
  {
    if(e.key == "Enter"){
      this.validate(this.el.value.trim())
    }
  }
  
  this.validate = function(value)
  {
    Ø("query").bang(value);
  }
  
  this.update = function(content)
  {
    if(typeof content == "string"){
      this.el.value = content.capitalize()
    }
  }
}
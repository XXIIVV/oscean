function KeyboardNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.entry

  window.addEventListener("keyup",(e)=>{ this.key_up(e); })

  this.key_up = function(e)
  {
    if(e.key == "g" && e.ctrlKey){
      this.send("generate")
    }
  }
}
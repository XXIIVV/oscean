'use strict';

function KeyboardNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = "M60,150 L60,150 L240,150 L240,150 L150,240 M150,60 L150,60 L240,150"

  console.info(this.id,"started")
  window.addEventListener("keyup",(e)=>{ this.key_up(e); })

  this.key_up = function(e)
  {
    if(e.key == "g" && e.ctrlKey){
      Ø('rss').bang()
    }
  }
}
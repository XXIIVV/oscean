function MouseNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.entry

  console.info(this.id,"started")
  window.addEventListener("click",(e)=>{ this.click(e); })

  this.click = function(e)
  {
    if(e.target.className == 'external'){ return; }

    let el = e.target.getAttribute('data-goto') ? e.target : e.target.parentNode.getAttribute('data-goto') ? e.target.parentNode : null;

    if(!el){ return; }

    Ø('query').bang(el.getAttribute('data-goto'))
    e.preventDefault();
  }
}
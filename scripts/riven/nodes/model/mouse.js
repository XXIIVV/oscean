function MouseNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.entry

  console.info(this.id,"started")
  window.addEventListener("click",(e)=>{ this.click(e); })

  this.click = function(e)
  {
    if(e.target.getAttribute('data-goto') && e.target.className != 'external'){
      Ø('query').bang(e.target.getAttribute('data-goto'))
      e.preventDefault();
    }
  }
}
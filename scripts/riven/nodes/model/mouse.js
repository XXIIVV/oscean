function MouseNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = "M60,150 L60,150 L240,150 L240,150 L150,240 M150,60 L150,60 L240,150"

  console.info(this.id,"started")
  window.addEventListener("click",(e)=>{ this.click(e); })

  this.click = function(e)
  {
    let in_tab = e.ctrlKey || e.shiftKey || e.metaKey || 2 === e.which || (e.button && e.button == 1)

    if(e.target.className == 'external'){ return; }

    let el = e.target.getAttribute('data-goto') ? e.target : e.target.parentNode.getAttribute('data-goto') ? e.target.parentNode : null;

    if(!el){ return; }
    
    if(in_tab){ 
      let win = window.open(`https://wiki.xxiivv.com/${el.getAttribute('data-goto')}`, '_blank');
      win.focus();
      return; 
    }

    

    Ø('query').bang(el.getAttribute('data-goto'))
    e.preventDefault();
  }
}
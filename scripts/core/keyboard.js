function Keyboard()
{
  this.key_up = function(e)
  {
    if(invoke.keyboard["key_"+e.key.toLowerCase()]){
      invoke.keyboard["key_"+e.key.toLowerCase()](e);
    }
  }

  this.key_backspace = function(e)
  {
    if(document.activeElement.type){ return; }
  
    var last_page = invoke.vessel.corpse.prev;

    if(!last_page){ return; }

    e.preventDefault();

    invoke.vessel.corpse.load(last_page.name)
  }

  document.onkeyup = this.key_up;
}

invoke.seal("core","keyboard");

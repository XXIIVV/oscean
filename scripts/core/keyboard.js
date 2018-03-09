function Keyboard()
{
  this.events = {};

  this.key_up = function(e)
  {
    if(invoke.keyboard["key_"+e.key.toLowerCase()]){
      invoke.keyboard["key_"+e.key.toLowerCase()](e);
    }
  }

  this.key_down = function(e)
  {
    if(invoke.keyboard.events[e.key]){
      invoke.keyboard.events[e.key](e)
    }
  }

  this.add_event = function(key,method,target = document.body,)
  {
    console.log("keyb","added event:"+key);
    invoke.keyboard.events[key] = method;
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
  document.onkeydown = this.key_down;
}

invoke.seal("core","keyboard");

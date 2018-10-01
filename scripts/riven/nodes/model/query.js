'use strict';

function QueryNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = "M60,150 L60,150 L240,150 L240,150 L150,240 M150,60 L150,60 L240,150"
  this.label = "query"

  this.bang = function(input = window.location.hash)
  {
    const target = input.to_url() === '' ? 'home' : input.to_url()

    Ø("view").set_class("loading");

    console.log(this.id,target);
    
    this.send(target)

    if(target === ''){
      window.history.replaceState(undefined, undefined, "#" + target)
    }
    else {
      window.location.hash = target.to_url()
    }

    if(window.scrollY != 0){
      setTimeout(()=>{ window.scrollTo(0,0); },250)
    }
  }

  this.queue = function(a,speed = 1000)
  {
    if(a.length == 0){ return; }

    setTimeout(() => {
      this.send(a[0].to_url())
      this.queue(a.slice(1))
    },speed)
  }
}

const detectBackOrForward = function(onBack, onForward)
{
  let hashHistory = [window.location.hash];
  let historyLength = window.history.length;

  return function()
  {
    let hash = window.location.hash, length = window.history.length;
    if (hashHistory.length && historyLength == length) {
      if (hashHistory[hashHistory.length - 2] == hash) {
        hashHistory = hashHistory.slice(0, -1);
        onBack();
      } else {
        hashHistory.push(hash);
        onForward();
      }
    } else {
      hashHistory.push(hash);
      historyLength = length;
    }
  }
};

window.addEventListener("hashchange", detectBackOrForward(
  function() { Ø('query').bang() },
  function() { Ø('query').bang() }
));

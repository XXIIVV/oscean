function QueryNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = "M60,150 L60,150 L240,150 L240,150 L150,240 M150,60 L150,60 L240,150"
  this.label = "query"

  this.bang = function(input = window.location.hash)
  {
    let target = input.to_url() === '' ? 'home' : input.to_url()

    Ø("view").el.className = "loading"

    console.log(this.id,target);
    
    this.send(target)

    if(target === ''){
      window.history.replaceState(undefined, undefined, "#" + target)
    }
    else {
      window.location.hash = target.to_url()
    }

    setTimeout(()=>{ window.scrollTo(0,0); },250)
  }
}

let detectBackOrForward = function(onBack, onForward)
{
  hashHistory = [window.location.hash];
  historyLength = window.history.length;

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

function QueryNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.entry
  this.label = "query"

  this.bang = function(input = window.location.hash)
  {
    var target = input.to_url() === '' ? 'home' : input.to_url()

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

var detectBackOrForward = function(onBack, onForward)
{
  hashHistory = [window.location.hash];
  historyLength = window.history.length;

  return function()
  {
    var hash = window.location.hash, length = window.history.length;
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
  function() { console.log("back"); Ø('query').bang() },
  function() { console.log("forward"); Ø('query').bang() }
));

function QueryNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.entry
  this.label = "query"

  this.bang = function(target = window.location.hash.substring(1).replace(/[^0-9a-z]/gi," ").trim().toLowerCase())
  {
    Ø("view").el.className = "loading"

    target = target ? target.replace(/[^0-9a-z]/gi," ").trim().toLowerCase() : "home"
    this.label = `query:${target}`
    setTimeout(()=>{ window.scrollTo(0,0); },250)
    this.send(target)
    window.location.hash = target.to_url()
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
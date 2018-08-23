function MissingTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element
  
  this.answer = function(q)
  {
    // Operations
    var o = find_operation(q.target)

    if(o){
      return `<code>${this[o.name](q.target)} <comment># ${o.name}</comment>\n</code>`
    }

    var similar = find_similar(q.target.toUpperCase(),q.tables.lexicon)

    return `
    <p>Sorry, there are no pages for {*/${q.target.capitalize()}*}, did you mean {(${similar[0].word.capitalize()})} or {(${similar[1].word.capitalize()})}?</p>
    <p>{*Create this page*} by submitting a {Pull Request(https://github.com/XXIIVV/oscean)}, or if you believe this to be an error, please contact {@neauoire(https://twitter.com/neauoire)}. Alternatively, you locate missing pages from within the {progress status(status)}.</p>`.to_curlic()
  }

  this.desamber_to_gregorian = function(q)
  {
    return new Desamber(q).to_gregorian()
  }

  this.gregorian_to_desamber = function(q)
  {
    return !isNaN(new Date(q)) ? new Date(q).desamber() : "Invalid Date"
  }

  function find_operation(query)
  {
    var operations = [
      {name: "desamber_to_gregorian",pattern:/\d\d[a-z\+]\d\d/i},
      {name: "gregorian_to_desamber",pattern:/\d\d\d\d\-\d\d\-\d\d/i}
    ]

    for(id in operations){
      var op = operations[id]
      if(query.match(op.pattern)){
        return op;
      }
    }
    return null;
  }

  function find_similar(target,list)
  {
    var similar = []
    for(key in list){
      var word = list[key].name
      similar.push({word:word,value:similarity(target,word)});
    }
    return similar.sort(function(a, b){
      return a.value - b.value;
    }).reverse();
  }

  function similarity(a,b)
  {
    var val = 0
    for (i = 0; i < a.length; ++i) { val += b.indexOf(a.substr(i)) > -1 ? 1 : 0; }
    for (i = 0; i < b.length; ++i) { val += a.indexOf(b.substr(i)) > -1 ? 1 : 0; }
    a = a.split('').sort().join('');
    b = b.split('').sort().join('');
    for (i = 0; i < a.length; ++i) { val += b.indexOf(a.substr(i)) > -1 ? 1 : 0; }
    for (i = 0; i < b.length; ++i) { val += a.indexOf(b.substr(i)) > -1 ? 1 : 0; }
    return val
  }
}
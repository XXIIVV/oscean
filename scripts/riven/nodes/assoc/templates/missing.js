'use strict';

function MissingTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240"
  
  this.answer = function(q)
  {
    // Operations
    let o = find_operation(q.target)

    if(o){
      return `<code>${this[o.name](q.target)} <comment># ${o.name}</comment>\n</code>`
    }

    let index = Object.keys(Ø('database').index)
    let similar = find_similar(q.target.toUpperCase(),index);

    return `
    <p>Sorry, there are no pages for {*/${q.target.capitalize()}*}, did you mean {(${similar[0].word.capitalize()})} or {(${similar[1].word.capitalize()})}?</p>
    <p>{*Create this page*} by submitting a {Pull Request(https://github.com/XXIIVV/oscean)}, or if you believe this to be an error, please contact {@neauoire(https://twitter.com/neauoire)}. Alternatively, you locate missing pages from within the {progress tracker(Tracker)}.</p>`.to_curlic()
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
    let operations = [
      {name: "desamber_to_gregorian",pattern:/\d\d[a-z\+]\d\d/i},
      {name: "gregorian_to_desamber",pattern:/\d\d\d\d\-\d\d\-\d\d/i}
    ]

    for(let id in operations){
      let op = operations[id]
      if(query.match(op.pattern)){
        return op;
      }
    }
    return null;
  }

  function find_similar(target,list)
  {
    let similar = []
    for(let key in list){
      let word = list[key]
      similar.push({word:word,value:similarity(target,word)});
    }
    return similar.sort(function(a, b){
      return a.value - b.value;
    }).reverse();
  }

  function similarity(a,b)
  {
    let val = 0
    for(let i = 0; i < a.length; ++i) { val += b.indexOf(a.substr(i)) > -1 ? 1 : 0; }
    for(let i = 0; i < b.length; ++i) { val += a.indexOf(b.substr(i)) > -1 ? 1 : 0; }
    a = a.split('').sort().join('');
    b = b.split('').sort().join('');
    for(let i = 0; i < a.length; ++i) { val += b.indexOf(a.substr(i)) > -1 ? 1 : 0; }
    for(let i = 0; i < b.length; ++i) { val += a.indexOf(b.substr(i)) > -1 ? 1 : 0; }
    return val
  }
}
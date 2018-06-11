function MissingTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element
  
  this.answer = function(q)
  {    
    var similar = find_similar(q.name,q.tables.lexicon)

    return `<p>Sorry, there are no pages found for <b>${q.name.capitalize()}</b>, did you mean <a onclick='Ø("query").bang("${similar[0].word}")'>${similar[0].word.capitalize()}</a> or <a onclick='Ø("query").bang("${similar[1].word}")'>${similar[1].word.capitalize()}</a>?</p><p>If you think that a page should exist here, please contact <a href='https://twitter.com/neauoire'>@neauoire</a>, or add it as a <a href='https://github.com/XXIIVV/oscean/blob/master/scripts/dict/lexicon.js' target='_blank'>Pull Request</a>.</p>`
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
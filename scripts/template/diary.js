function DiaryTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {    
    var term = q.result
    var logs = find_logs(q.name,q.tables.horaire)
    var siblings = find_siblings(term.unde(),q.tables.lexicon)
    var children = find_children(q.name,q.tables.lexicon)

    return {
      title: q.name.capitalize(),
      view:{
        core:{
          sidebar:{
            bref:make_bref(q,term,logs),
            navi:make_navi(term,siblings,children)
          },
          content:`${q.result.long()}${make_diary(logs)}`
        }
      }
    }
  }

  function make_diary(logs)
  {
    var html = ""

    for(id in logs){
      var log = logs[id]
      if(!log.photo){ continue; }
      html += `<img src='media/diary/${log.photo}.jpg'/>`
    }
    return html
  }

  function make_bref(q,term,logs)
  { 
    return `
    <h1>${q.result.bref()}</h1>
    <h2>
      <a onclick="Ø('query').bang('${term.unde()}')">${term.unde()}</a><br />
      ${make_activity(logs)}
      ${make_links(term.links)}
    </h2>`
  }

  function find_siblings(parent,lexicon)
  {
    var a = []
    for(id in lexicon){
      var term = lexicon[id];
      if(!term.unde() || parent.toUpperCase() != term.unde().toUpperCase()){ continue; }
      a.push(term)
    }
    return a  
  }

  function find_children(name,lexicon)
  {
    var a = []
    for(id in lexicon){
      var term = lexicon[id];
      if(!term.unde() || name != term.unde().toUpperCase()){ continue; }
      a.push(term)
    }
    return a    
  }

  function make_navi(term,siblings,children)
  {
    var html = ""
    for(id in siblings){ 
      var sibling = siblings[id];
      html += `<ln class='sibling'>${sibling.bref()}</ln>`
      if(sibling.name == term.name){
        for(id in children){ 
          var child = children[id];
          html += `<ln class='child'>${child.bref()}</ln>`
        }
      }
    }
    return html
  }

  function make_links(links)
  {
    var html = ""
    for(id in links){ 
      html += `<a href='${links[id]}' target='_blank'>${id}</a>`
    }
    return `<yu class='links'>${html}</yu>`
  }

  function make_activity(logs)
  {
    if(logs.length < 10){ return "" }
    return `${logs[logs.length-1].time}—${logs[0].time}`
  }

  function find_logs(name,logs)
  {
    var a = []
    for(id in logs){
      var log = logs[id];
      if(log.term.toUpperCase() == name){ a.push(log) }
    }
    return a
  }
}
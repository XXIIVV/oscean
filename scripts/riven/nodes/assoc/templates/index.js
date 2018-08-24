function IndexTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element

  this.add = function(entries,t,s)
  {
    var term = `${t}`.capitalize().trim();
    if(!term||term == ""){ return; }
    if(!entries[term]){ entries[term] = []; }
    var source = s.capitalize();
    if(entries[term].indexOf(source) > -1){ return; }
    entries[term].push(source)
  }

  this.collect = function(q)
  {
    var h = {}
    for(var id in q.tables.lexicon){
      var term = q.tables.lexicon[id]
      this.add(h,term.name,term.parent.name)
    }
    for(var id in q.tables.glossary){
      var list = q.tables.glossary[id]
      this.add(h,list.name,list.name)
      for(var i in list.data){
        this.add(h,i,list.name)
      }
    }
    for(var id in q.tables.horaire){
      var log = q.tables.horaire[id]
      this.add(h,log.name,`${log.term}`)
    }
    return h;
  }

  function _format(name,sources)
  {
    return `<ln>{${name.capitalize()}(${sources[0]})} ${sources[0].toLowerCase() != name.toLowerCase() ? ' — '+sources[0] : ''}</ln>`
  }

  this.answer = function(q)
  {
    var entries = this.collect(q);

    var sortable = Object.keys(entries).sort();

    var prev = ""
    var html = ""
    for(id in sortable){
      var entry = sortable[id];
      var lead = entry.substr(0,1)
      if(parseInt(lead) > 0){ continue; }
      if(!entry.to_alpha()){ continue; }
      if(prev != lead){
        html += `<ln class='head'>${lead}</ln>`
      }
      html += _format(entry,entries[entry]);
      prev = lead
    }
    return `<p>The {*Wiki*} contains ${sortable.length} searchable terms.</p><list class='tidy'>${html}</list>`.to_curlic()
  }
}
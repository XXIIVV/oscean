function IndexTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element
  
  this.entries = {}

  this.add = function(t,source)
  {
    var term = t.toLowerCase().trim();
    if(!term||term == ""){ return; }
    if(!this.entries[term]){ this.entries[term] = []; }
    if(this.entries[term].indexOf(source) > -1){ return; }
    this.entries[term].push(source)
  }

  this.collect = function(q)
  {
    for(var id in q.tables.lexicon){
      var term = q.tables.lexicon[id]
      this.add(term.name,"lexicon")
    }

    for(var id in q.tables.glossary){
      var list = q.tables.glossary[id]
      this.add(list.name,"glossary")
      for(var i in list.data){
        this.add(i,"glossary")
      }
    }

    for(var id in q.tables.horaire){
      this.add(q.tables.horaire[id].name,"horaire")
    }

    this.entries;
  }

  this.answer = function(q)
  {
    this.collect(q);

    var sortable = Object.keys(this.entries).sort();

    var prev = ""
    var html = ""
    for(id in sortable){
      var lead = sortable[id].substr(0,1)
      if(parseInt(lead) > 0){ continue; }
      if(prev != lead){
        html += `<h2>${lead}</h2>`
      }
      html += `<ln>{(${sortable[id].capitalize()})} — ${this.entries[sortable[id]]}</ln>`.to_curlic()
      prev = lead
    }
    return `<list>${html}</list>`
  }
}
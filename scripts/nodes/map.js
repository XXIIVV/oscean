function MapNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.filter

  this.is_mapped = false;

  this.receive = function(q)
  {
    if(!this.is_mapped){
      this.map(q);
    }
    
    this.send(q);
  }

  this.map = function(q)
  {
    var time = performance.now();

    // Connect Parents
    for(id in q.tables.lexicon){
      var term = q.tables.lexicon[id];
      var parent = !term.dict.UNDE ? "HOME" : term.dict.UNDE.toUpperCase()
      if(!q.tables.lexicon[parent]){ console.warn("Unknown parent term:",parent); }
      term.parent = q.tables.lexicon[parent];
    }

    // Connect children
    for(id in q.tables.lexicon){
      var term = q.tables.lexicon[id];
      var parent = term.parent.name
      if(!q.tables.lexicon[parent]){ console.warn("Missing children term",log.term); continue; }
      q.tables.lexicon[parent].children.push(term)
    }

    // Connect Logs
    for(id in q.tables.horaire){
      var log = q.tables.horaire[id]
      var index = log.term.toUpperCase()
      if(!log.term){ continue; }
      if(!q.tables.lexicon[index]){ console.warn("Missing log term",index); continue; }
      q.tables.lexicon[index].logs.push(log)
      if(!q.tables.lexicon[index].latest_log){
        q.tables.lexicon[index].latest_log = log
      }
      if(!log.photo){ continue; }
      q.tables.lexicon[index].diaries.push(log)
      if(!q.tables.lexicon[index].featured_log || q.tables.lexicon[index].featured_log && !q.tables.lexicon[index].featured_log.is_featured && log.is_featured){
        q.tables.lexicon[index].featured_log = log
      }
    }

    this.is_mapped = true
    console.info(this.id,`Mapped ${q.tables.horaire.length} logs to ${Object.keys(q.tables.lexicon).length} terms, in ${(performance.now() - time).toFixed(2)}ms.`)
  }
}
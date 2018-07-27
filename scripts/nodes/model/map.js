function MapNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.filter

  this.is_mapped = false;

  this.receive = function(q)
  {
    try{
      if(!this.is_mapped){
        this.map(q);
      }
      this.send(q);  
    }
    catch(err){
      console.log(this,err)
    }
  }

  this.map = function(q)
  {
    var time = performance.now();
    var count = {links:0,diaries:0,issues:0}

    // Connect Parents
    for(id in q.tables.lexicon){
      var term = q.tables.lexicon[id];
      var parent = !term.dict.UNDE ? "HOME" : term.dict.UNDE.toUpperCase()
      if(!q.tables.lexicon[parent]){ console.warn(`Unknown parent ${parent} for ${term.name}`); }
      term.parent = q.tables.lexicon[parent];
    }

    // Connect children
    for(id in q.tables.lexicon){
      var term = q.tables.lexicon[id];
      var parent = term.parent.name
      if(!q.tables.lexicon[parent]){ console.warn("Missing children term",log.term); continue; }
      q.tables.lexicon[parent].children.push(term)
    }

    // Connect links
    for(id in q.tables.lexicon){
      var term = q.tables.lexicon[id];
      var links = term.find_outgoing()
      for(id in links){
        var link = links[id]
        term.outgoing.push(link)
        if(!q.tables.lexicon[link]){ console.warn("Missing incoming",`${term.name}->${link}`); continue; }
        q.tables.lexicon[link].incoming.push(term.name)
        count.links += 1
      }
    }

    // Connect Logs
    for(id in q.tables.horaire){
      var log = q.tables.horaire[id]
      var index = log.term.toUpperCase()
      if(!log.term){ continue; }
      if(!q.tables.lexicon[index]){ console.warn("Missing log term",index); continue; }
      log.host = q.tables.lexicon[index];
      q.tables.lexicon[index].logs.push(log)
      if(!q.tables.lexicon[index].latest_log && log.time.offset() < 0){
        q.tables.lexicon[index].latest_log = log
      }
      if(!log.photo){ continue; }
      q.tables.lexicon[index].diaries.push(log)
      count.diaries += 1
      if(!q.tables.lexicon[index].featured_log || q.tables.lexicon[index].featured_log && !q.tables.lexicon[index].featured_log.is_featured && log.is_featured){
        q.tables.lexicon[index].featured_log = log
      }
    }

    // Connect issues
    for(term in q.tables.issues){
      var index = term.toUpperCase()
      var issues = q.tables.issues[term]
      if(!q.tables.lexicon[index]){ console.warn("Missing issue parent",index); continue; }
      q.tables.lexicon[index].issues = q.tables.issues[index]
      count.issues += issues.length
    }
    this.is_mapped = true
    console.info(this.id,`Mapped ${q.tables.horaire.length} logs, ${count.links} links, ${q.tables.issues.length} issues, and ${count.diaries} diaries to ${Object.keys(q.tables.lexicon).length} terms, in ${(performance.now() - time).toFixed(2)}ms.`)
  }
}
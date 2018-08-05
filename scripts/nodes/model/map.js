function MapNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.filter

  this.is_mapped = false;

  this.receive = function(tables)
  {
    try{
      return this.map(tables);
    }
    catch(err){
      console.log(this,err)
    }
  }

  this.map = function(tables)
  {
    var time = performance.now();
    var count = {links:0,diaries:0,issues:0}

    // Connect Parents
    for(id in tables.lexicon){
      var term = tables.lexicon[id];
      var parent = !term.dict.UNDE ? "HOME" : term.dict.UNDE.toUpperCase()
      if(!tables.lexicon[parent]){ console.warn(`Unknown parent ${parent} for ${term.name}`); }
      term.parent = tables.lexicon[parent];
    }

    // Connect children
    for(id in tables.lexicon){
      var term = tables.lexicon[id];
      var parent = term.parent.name
      if(!tables.lexicon[parent]){ console.warn("Missing children term",log.term); continue; }
      tables.lexicon[parent].children.push(term)
    }

    // Connect links
    for(id in tables.lexicon){
      var term = tables.lexicon[id];
      var links = term.find_outgoing()
      for(id in links){
        var link = links[id]
        term.outgoing.push(link)
        if(!tables.lexicon[link]){ console.warn("Missing incoming",`${term.name}->${link}`); continue; }
        tables.lexicon[link].incoming.push(term.name)
        count.links += 1
      }
    }

    // Connect Logs
    for(id in tables.horaire){
      var log = tables.horaire[id]
      var index = log.term.toUpperCase()
      if(!log.term){ continue; }
      if(!tables.lexicon[index]){ console.warn("Missing log term",index); continue; }
      log.host = tables.lexicon[index];
      tables.lexicon[index].logs.push(log)
      if(!tables.lexicon[index].latest_log && log.time.offset < 0){
        tables.lexicon[index].latest_log = log
      }
      if(!log.photo){ continue; }
      tables.lexicon[index].diaries.push(log)
      count.diaries += 1
      if(!tables.lexicon[index].featured_log || tables.lexicon[index].featured_log && !tables.lexicon[index].featured_log.is_featured && log.is_featured){
        tables.lexicon[index].featured_log = log
      }
    }

    // Connect issues
    for(term in tables.issues){
      var index = term.toUpperCase()
      var issues = tables.issues[term]
      if(!tables.lexicon[index]){ console.warn("Missing issue parent",index); continue; }
      for(id in issues){
        var issue = new Issue(id,issues[id]);
        tables.lexicon[index].issues.push(issue)
        count.issues += 1
      }
    }
    this.is_mapped = true
    console.info(this.id,`Mapped ${tables.horaire.length} logs, ${count.links} links, ${count.issues} issues, and ${count.diaries} diaries to ${Object.keys(tables.lexicon).length} terms, in ${(performance.now() - time).toFixed(2)}ms.`)
  }
}
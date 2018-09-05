'use strict';

function MapNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z M150,60 L150,60 L150,240 M60,150 L60,150 L240,150 "

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
    let time = performance.now();
    let count = {links:0,diaries:0}

    // Connect Parents
    for(let id in tables.lexicon){
      let term = tables.lexicon[id];
      let parent = !term.data.UNDE ? "HOME" : term.data.UNDE.toUpperCase()
      if(!tables.lexicon[parent]){ console.warn(`Unknown parent ${parent} for ${term.name}`); }
      term.parent = tables.lexicon[parent];
    }

    // Connect children
    for(let id in tables.lexicon){
      let term = tables.lexicon[id];
      let parent = term.parent.name
      if(!tables.lexicon[parent]){ console.warn("Missing children term",log.term); continue; }
      tables.lexicon[parent].children.push(term)
    }

    // Connect links
    for(let id in tables.lexicon){
      let term = tables.lexicon[id];
      let links = term.find_outgoing()
      for(let id in links){
        let link = links[id]
        term.outgoing.push(link)
        if(!tables.lexicon[link]){ console.warn("Missing incoming",`${term.name}->${link}`); continue; }
        tables.lexicon[link].incoming.push(term.name)
        count.links += 1
      }
    }

    // Connect Logs
    for(let id in tables.horaire){
      let log = tables.horaire[id]
      let index = log.term.toUpperCase()
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
    for(let id in tables.issues){
      let issue = tables.issues[id]
      let index = issue.term.toUpperCase()
      if(!tables.lexicon[index]){ console.warn("Missing issue parent",index); continue; }
      tables.lexicon[index].issues.push(issue)
      issue.host = tables.lexicon[index]
    }
    this.is_mapped = true
    console.info(this.id,`Mapped ${tables.horaire.length} logs, ${count.links} links, ${tables.issues.length} issues, and ${count.diaries} diaries to ${Object.keys(tables.lexicon).length} terms, in ${(performance.now() - time).toFixed(2)}ms.`)
  }
}
function BuildNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.build

  this.cache = null;

  this.receive = function(q)
  {
    var builds = this.request(q)
    var featured_log = q.result && q.result.name == "HOME" ? this.find_last_diary(q.tables.horaire) : q.result && q.result.featured_log ? q.result.featured_log : null

    this.send({
      title: `XXIIVV — ${q.target.capitalize()}`,
      theme: q.result ? q.result.theme : 'default',
      view:{
        header:{
          photo:featured_log ? featured_log.photo : 0,
          info:{
            title:featured_log ? `{${featured_log.name}(${featured_log.term}:diary)} —<br />${featured_log.time.ago(60)}`.to_curlic() : '',
            glyph:q.result && q.result.glyph() ? q.result.glyph() : 'M240,240 l0,-90 a-90,-90 0 0,0 -90,-90 l-90,0 l0,90 a90,90 0 0,0 90,90 l60,0 l0,-90 a-60,-60 0 0,0 -60,-60 l-60,0 l0,60 a60,60 0 0,0 60,60 l30,0 l0,-60 a-30,-30 0 0,0 -30,-30 l-30,0 l0,30 a30,30 0 0,0 30,30'
          },
          menu:{
            search:q.target && q.target.capitalize(),
            activity:this._activity(q)
          }
        },
        core:{
          sidebar:{
            bref:builds._sidebar,
          },
          content:builds._content,
          navi:builds._navi
        },
        style:``,
        footer:{
          entaloneralie:true
        }
      }
    }) 
  
    // Install Dom
    document.body.appendChild(this.signal("view").answer())
  }

  this._activity = function(q)
  {
    var html = ""

    if(!q.result){ return ''; }

    if(q.result.name == "HOME" || q.result.name == "JOURNAL" || q.result.name == "CALENDAR" || q.result.name == "TRACKER"){
      return `<a id='issues' onclick=\"Ø('query').bang('Tracker')\">Tracker</a> <a id='diaries' onclick=\"Ø('query').bang('journal')\">Journal</a> <a id='logs' onclick=\"Ø('query').bang('Calendar')\">Calendar</a> `
    }
    
    if(q.result.issues.length > 0){
      html += `<a id='issues' onclick=\"Ø('query').bang('${q.result.name}:tracker')\">${q.result.issues.length} Issue${q.result.issues.length > 1 ? 's' : ''}</a>`
    }
    if(q.result.diaries.length > 1 && !q.result.has_tag("diary")){
      html += `<a id='diaries' onclick=\"Ø('query').bang('${q.result.name}:diary')\">${q.result.diaries.length} Diaries</a>`;
    }
    if(q.result.logs.length > 2 && q.result.latest_log.time.offset > -365 && !q.result.has_tag("journal")){
      html += `<a id='logs' onclick=\"Ø('query').bang('${q.result.name}:journal')\">${q.result.logs.length} Logs</a>`
    }

    return html;
  }

  this.find_last_diary = function(horaire)
  {
    for(id in horaire){
      var log = horaire[id]
      if(!log.is_featured){ continue; }
      if(log.time.offset > 0){ continue; }
      return log;
    }
    return null;
  }
}
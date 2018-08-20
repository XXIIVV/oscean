function TrackerTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element

  // Services

  function find_available(q)
  {
    var used = []
    for(id in q.tables.horaire){
      var log = q.tables.horaire[id]
      if(!log.photo){ continue; }
      used.push(log.photo)
    }
    var available = 1
    while(available < 999){
      if(used.indexOf(available) < 0){ return available; }
      available += 1
    }
  }

  function on_this_day(q)
  {
    var today = new Date().desamber();
    var a = []
    for(id in q.tables.horaire){
      var log = q.tables.horaire[id]
      if(!log.is_event){ continue; }
      if(!log.name){ continue; }
      if(log.time.offset >= 0){ continue; }
      if(log.time.doty != today.doty){ continue; }
      a.push(log)
    }
    return a;
  }

  this.slice = function(logs,from,to)
  {
    var a = []
    for(var id in logs){
      var log = logs[id];
      if(log.time.offset < from){ continue; }
      if(log.time.offset > to){ continue; }
      a.push(log)
    }
    return a
  }

  this._progress = function(q)
  {
    var html = ""

    var score = {ratings:0,entries:0,average:0,issues:0};

    for(var id in q.tables.lexicon){
      var term = q.tables.lexicon[id]
      score.ratings += term.rating().score
      score.entries += 1
    }
    score.average = score.ratings/score.entries;

    html += `<div class='progress'><div class='bar' style='width:${(score.average*100).toFixed(2)}%'></div></div>`
    html += `<t>${(score.average*100).toFixed(2)}% Complete</t>`
    return `<div class='progress_wrapper'>${html}</div>`
  }

  this._tasks = function(issue)
  {
    var html = ''
    for(var t in issue.tasks){
      var task = issue.tasks[t];
      html += `<tr><td colspan='20'><t class='task'>${task.to_markup()}</t></td></tr>`
    }
    return html
  }

  this._issues = function(term)
  {
    var html = ''
    for(var i in term.issues){
      var issue = term.issues[i]
      html += `<tr><td colspan='20'><t class='issue'>${issue.name}<t class='right'>${issue.tasks.length} Tasks</t></t></td></tr>`
      html += this._tasks(issue)
    }

    return html;
  }

  this._term = function(term)
  {
    var html = ''
    var r = term.rating()
    html += `<tr>`
    html += `
    <td class='${r.status}' style='width:250px'>{{${term.name.capitalize()}}}</b><t class='right'>${parseInt(r.score * 100)}%</t></td>
    <td style='padding-left:15px'>${term.incoming.length}/${term.outgoing.length} ${term && term.latest_log ? term.latest_log.time.offset : ''}</td>
    `.to_markup()
    for(i in r.points){ html += `<td title='${i}' class='bullet'>${r.points[i] ? '•' : ''}</td>` }
    html += `</tr>`

    html += this._issues(term);
    return html
  }

  this._table = function(q)
  {
    var logs = q.target == "tracker" ? q.tables.horaire : q.result.logs;

    var html = ""

    html += `<table class='tracker'>`
    for(var id in q.tables.lexicon){
      var term = q.tables.lexicon[id]
      html += this._term(term);
    }
    html += `</table>`

    return html;
  }

  this._style = function()
  {
    return `<style>
    table.tracker { width:730px}
    table.tracker td { border-bottom:1px solid #333; padding:2px 5px}
    table.tracker td.bullet { text-align: center}
    table.tracker td.perfect { color:#fff;}
    table.tracker td.good { color:#aaa;}
    table.tracker td.fair { color:#777;}
    table.tracker td.poor { color:#444;}
    table.tracker td t.right { float:right}
    table.tracker td t.issue { display:block; margin-left:15px; border-radius:2px; padding-left:10px; padding-right:10px}
    table.tracker td t.task { display:block; margin-left:45px; border-radius:2px; padding-left:10px; padding-right:5px}
    div.progress_wrapper { max-width:730px; }
    div.progress_wrapper t { color:white; width:100%; display:block; font-family:'archivo_bold'; font-size:12px; text-align:center; position:relative; top:-15px; }
    div.progress_wrapper div.progress { border:1.5px solid white; border-radius:30px; height:10px; max-width:250px; margin:0px auto 30px;}
    div.progress_wrapper div.progress div.bar { background:white; height:6px;margin:2px; border-radius:30px}
    </style>`
  }

  this.answer = function(q)
  {
    console.info("Next Available:",find_available(q))
    console.info("On This Day:",on_this_day(q))

    var html = ""

    html += `${new BalanceViz(q.tables.horaire)}`
    html += `${new StatusViz(this.slice(q.tables.horaire,-51,0))}`
    html += `${this._progress(q)}`
    html += `${this._table(q)}`
    html += `${this._style()}`

    return html
  }
}
'use strict';

function TrackerTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240"

  this.slice = function(logs,from,to)
  {
    let a = []
    for(let id in logs){
      let log = logs[id];
      if(log.time.offset < from){ continue; }
      if(log.time.offset > to){ continue; }
      a.push(log)
    }
    return a
  }

  this._progress = function(q)
  {
    let html = ""

    let score = {ratings:0,entries:0,average:0,issues:0};

    for(let id in q.tables.lexicon){
      let term = q.tables.lexicon[id]
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
    let html = ''
    for(let t in issue.tasks){
      let task = issue.tasks[t];
      html += `<tr class='task'><td colspan='20'><t class='task'>${task.to_curlic()}</t></td></tr>`
    }
    return html
  }

  this._issues = function(term)
  {
    let html = ''
    let cats = {}
    // Order by task
    for(let i in term.issues){
      let issue = term.issues[i]
      if(!cats[issue.task]){ cats[issue.task] = []; }
      cats[issue.task].push(issue.name)
    }
    // Print
    for(let i in cats){
      let cat = cats[i]
      html += `<tr><td class='task' colspan='10'><b>${i}</b></td></tr>`
      for(let i in cat){
        html += `<tr><td class='name' colspan='10'>${cat[i]}</td></tr>`
      }
    }
    return html;
  }

  this._term = function(term)
  {
    // Print
    let html = ''
    let r = term.rating()
    html += `<tr>`
    html += `
    <td class='${r.status}' style='width:250px'>{(${term.name.capitalize()})}</b><t class='right'>${parseInt(r.score * 100)}%</t></td>
    <td style='padding-left:15px'>${term.incoming.length < 1 && term.outgoing.length < 1 ? 'unlinked' : `${term.incoming.length}/${term.outgoing.length}`}</td>
    `.to_curlic()
    for(let i in r.points){ html += `<td title='${i}' class='bullet ${r.points[i] ? 'done' : 'undone'}'>•</td>` }
    html += `</tr>`

    html += term.issues.length > 0 ? `<tr><td colspan='100'>${this._issues(term)}</td></tr>` : '';
    return html
  }

  this._table = function(target,q)
  {
    let logs = q.target == "tracker" ? q.tables.horaire : q.result.logs;
    let html = ""
    let sorted = Object.keys(q.tables.lexicon).sort()

    html += `<table class='tracker'>`
    if(target == 'tracker'){
      for(let id in sorted){
        let term = q.tables.lexicon[sorted[id]]
        html += this._term(term);
      }
    }
    else{
      let term = q.tables.lexicon[target.toUpperCase()]
      html += this._term(term);
    }
    
    html += `</table>`

    return html;
  }

  this._style = function()
  {
    return `<style>
    table.tracker { width:730px}
    table.tracker tr { position:relative}
    table.tracker tr.issue td { }
    table.tracker tr.task td {position:relative}
    table.tracker tr.task td:before { content:"• "; color:#555; position: absolute; left:45px}
    table.tracker td { padding:2px 5px}
    table.tracker td.bullet { text-align: center}
    table.tracker td.bullet.done { color:black; }
    table.tracker td.bullet.undone { color:#ccc; }
    table.tracker td.task { padding-left:20px !important}
    table.tracker td.name { padding-left:40px !important}
    
    table.tracker td t.right { float:right}
    table.tracker td t.issue { display:block; margin-left:15px; border-radius:2px; padding-left:10px; padding-right:10px}
    table.tracker td t.task { display:block; margin-left:45px; border-radius:2px; padding-left:10px; padding-right:5px}

    div.progress_wrapper { max-width:730px; }
    div.progress_wrapper t { color:black; width:100%; display:block; font-family:'archivo_bold'; font-size:12px; text-align:center; position:relative; top:-15px; }
    div.progress_wrapper div.progress { border:1.5px solid black; border-radius:30px; height:10px; max-width:250px; margin:0px auto 30px;}
    div.progress_wrapper div.progress div.bar { background:black; height:6px;margin:2px; border-radius:30px}

    #view.noir div.progress_wrapper t { color:white; }
    #view.noir div.progress_wrapper div.progress { border:1.5px solid white; }
    #view.noir div.progress_wrapper div.progress div.bar { background:white; }

    #view.noir table.tracker td.perfect { color:#fff;}
    #view.noir table.tracker td.good { color:#aaa;}
    #view.noir table.tracker td.fair { color:#777;}
    #view.noir table.tracker td.poor { color:#444;}
    #view.noir table.tracker td.bullet.done { color:white; }
    #view.noir table.tracker td.bullet.undone { color:#333; }

    </style>`
  }

  this.answer = function(q)
  {
    let target = q.target.toLowerCase();
    let html = ""

    html += `${new BalanceViz(q.tables.horaire)}`
    html += `${new StatusViz(this.slice(q.tables.horaire,-51,0))}`
    html +=  target == 'tracker' ? `${this._progress(q)}` : ''
    html += `${this._table(target,q)}`
    html += `${this._style()}`

    return html
  }
}
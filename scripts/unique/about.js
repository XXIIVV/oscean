Ø("unique").seal("about",(q) => {

  var projects = []
  for(id in q.tables.lexicon){
    var term = q.tables.lexicon[id]
    if(term.logs.length < 5){ continue; }
    var horaire = new Horaire(term.logs)
    projects.push([term.name,horaire.sum,horaire.span,horaire.attention])
  }

  var tasks = {}
  for(id in q.tables.horaire){
    var log = q.tables.horaire[id]
    tasks[log.task] = tasks[log.task] ? tasks[log.task]+log.value : log.value
  }
  var tasks_sortable = []
  for(id in tasks){
    tasks_sortable.push([id,tasks[id]])
  }

  var creation = q.tables.horaire[q.tables.horaire.length-1];
  var last = q.tables.horaire.find((log)=>{ if(log.time.offset() <= 0){ return log; } })

  var html = ""
  html += `<p>Created ${(creation.time.offset()/-365).toFixed(0)} years ago, or ${creation.time.offset_format(new Date().desamber(),true)}, this {{wiki|https://en.wikipedia.org/wiki/Wiki}} is currently hosting {*${Object.keys(q.tables.lexicon).length} entries*}, {*${projects.length} projects*}, {*${q.tables.horaire.length} logs*}, recorded over {*${(new Horaire(q.tables.horaire).sum/1000).toFixed(3).replace(".","'")} hours*}. The {{last update|Journal}} was made {*${last.time.offset_format()}*}.</p>`.to_markup() 

  //

  html += "<h2>Most Active Projects</h2>"
  var active_sorted = projects.sort(function(a, b) { return a[1] - b[1]; }).reverse();
  html += "<list class='tidy'>"
  var c = 0
  for(id in active_sorted){
    var entry = active_sorted[id]
    html += `<ln>{{${entry[0].capitalize()}}} ${entry[1]}h</ln>`.to_markup()
    c++;
    if(c > 17){ break; }
  }
  html += "</list>"

  html += `
  <p>The {{Riven Engine|Riven}} is designed to run without a serving platform, using only {{front-end files|http://github.com/XXIIVV/Oscean}} written in an {{unobfuscated format|Oscean}} — With the hope that little or {{no migration|https://www.gwern.net/About#long-site}} will ever be required.</p>
  <p>So far, roughly {*${parseInt(new Horaire(q.tables.lexicon.OSCEAN.logs).sum)} hours*}(over ${q.tables.lexicon.OSCEAN.logs.length} days) were invested in the construction of {{Oscean}}, which is a considerable investment of time, enough that one might wonder if it is actually worth it. There is no singular project that had more {{impact|Aesthetics}} on my work than the usage and creation of this {{application|Nataniev}}.</p>
  ${new Runic(": Oscean",q.tables)}
  <p>{{Desamber}} Time is the current {{Time Format|Time}} used on this wiki, the current time is <b>{{$desamber}}</b> <code class='inline'>{{$clock}}</code>, visit the {{Clock}} for more details. The reason for this use of un {{unconventional|https://en.wikipedia.org/wiki/Decimal_time#See_also}} time is the perdictable {{2-weeks long periods|Desamber}} of each month, ideal for the {{sprint format|https://en.wikipedia.org/wiki/Agile_software_development}}.</p>
  `.to_markup()

  //

  html += "<h2>Most Active Tasks</h2>"
  var tasks_sorted = tasks_sortable.sort(function(a, b) { return a[1] - b[1]; }).reverse();
  html += "<list class='tidy'>"
  var c = 0
  for(id in tasks_sorted){
    var entry = tasks_sorted[id]
    html += `<ln>{*${entry[0].capitalize()}*} ${entry[1]}h</ln>`.to_markup()
    c++;
    if(c > 17){ break; }
  }
  html += "</list>"

  html += `
  <p>The {{platform code|http://github.com/XXIIVV/Oscean}} is under the {#MIT License#}, its content is under the creative common {#BY-NC-SA 4.0#}, read more about it {{here|https://creativecommons.org/licenses/by-nc-sa/4.0/}}.</p>
  <p>If you have any question or feedback, <br />please submit an {{issue|https://github.com/XXIIVV/Oscean/issues/new}}.</p>
  `.to_markup()

  return html
});

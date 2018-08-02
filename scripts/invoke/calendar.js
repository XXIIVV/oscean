Ø("invoke").seal("calendar",(q) => 
{
  var logs = q.tables.horaire;
  var html = ``;

  var prev_y = 0;
  for(var id in logs){
    var log = logs[id];
    if(!log.is_event){ continue; }
    if(log.time.y != prev_y){ html += `<ln class='head'>20${log.time.y}</ln>`; prev_y = log.time.y; }
    html += `<ln style='${log.time.offset() > 0 ? 'color:#aaa' : ''}'>{{${log.name ? log.name : log.term+' '+log.task.capitalize()}|${log.term}}}</a> <t title='${log.time}'>${log.time.offset_format()}</t></ln>`.to_markup()
  }
  return `${new BarViz(logs)}${new StatusViz(logs)}<br /><br /><list class='tidy' style='max-width:calc(100% - 15px)'>${html}</list>`;
});
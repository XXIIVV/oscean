function StatusViz(logs)
{
  this.data = {recent:[],before:[]}

  // Split the last 14 days
  for(id in logs){
    var log = logs[id]
    var offset = log.time.offset();
    if(offset > 0){ continue; }
    if(offset > -14){ this.data.recent[this.data.recent.length] = log; }
    else{ this.data.before[this.data.before.length] = log; }
  }

  this.draw = function()
  {
    var recent = new Horaire(this.data.recent)
    var before = new Horaire(this.data.before)

    return `
    <table class='graph status'>
      <tr>
        <th>
          <t class='display'>
            <t class='value'>${(recent.fh * 14) > 100 ? parseInt(recent.fh * 14) : (recent.fh * 14).toFixed(1)}</t>
            <t class='offset'>${this.offset(recent.fh * 14,before.fh * 14)}</t>
            <t class='unit'>hours/14d</t>
          </t>
        </th>
        <th>
          <t class='display'>
            <t class='value'>${recent.fh.toFixed(2)}</t>
            <t class='offset'>${this.offset(recent.fh,before.fh)}</t>
            <t class='unit'>hours/day</t>
          </t>
        </th>
        <th>
          <t class='display'>
            <t class='value'>${recent.efec.toFixed(2)}</t>
            <t class='offset'>${this.offset(recent.efec,before.efec)}</t>
            <t class='unit'>efec</t>
          </t>
        </th>
        <th>
          <t class='display'>
            <t class='value'>${recent.efic.toFixed(2)}</t>
            <t class='offset'>${this.offset(recent.efic,before.efic)}</t>
            <t class='unit'>efic</t>
          </t>
        </th>
      </tr>
    </table>`
  }

  this.offset = function(recent,before,trail = 1)
  {
    var print = recent-before > 0 ? `+${(recent-before).toFixed(trail)}` : `${(recent-before).toFixed(trail)}`
    return print != "-0.0" && print != "+0.0" ? print : '0.0'
  }

  this.style = function()
  {
    return `
    <style>
      #content .graph.status { background:transparent; padding:0px; width:730px}
      #content .graph.status th { font-size:40px; font-family:'archivo_light';line-height:40px; }
      #content .graph.status tr > * { padding:5px 0px}
      #content .graph.status th t.display { display:inline-block; border-bottom:1.5px solid black; width:180px; padding-bottom:15px}
      #content .graph.status th t.display t.value {}
      #content .graph.status th t.display t.unit { font-size:12px; font-family:'input_mono_regular';}
      #content .graph.status th t.display t.offset { font-size:12px; font-family:'input_mono_medium'; text-transform:uppercase; position:absolute; margin-top:-7.5px}
      #view.noir .graph.status { margin-bottom:0px; border-bottom:1.5px solid #333; }
    </style>
    `
  }

  this.toString = function()
  {
    return this.draw()+this.style()
  }
}
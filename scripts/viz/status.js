function StatusViz(logs,settings = {})
{
  this.logs = logs;
  this.settings = settings;

  this.parse = function(logs = this.logs)
  {
    var h = {now:[],before:[]}
    var i = 0
    for(id in logs){
      var log = logs[id];
      var offset = log.time.offset();
      if(offset > 0){ continue; }
      if(offset > -14){ h.now.push(log); continue; }
      if(offset > -24){ h.before.push(log); continue; }
      break;
    }
    return h
  }

  this.draw = function()
  {
    var data = this.parse();
    var now = new Horaire(data.now)
    var before = new Horaire(data.before)

    return `
    <table class='graph status'>
      <tr>
        <th>
          <t class='display'>
            <t class='value'>${now.sum.toFixed(1)}</t>
            <t class='offset'>${this.offset(now.sum,before.sum)}</t>
            <t class='unit'>hours/14d</t>
          </t>
        </th>
        <th>
          <t class='display'>
            <t class='value'>${now.fh.toFixed(2)}</t>
            <t class='offset'>${this.offset(now.fh,before.fh)}</t>
            <t class='unit'>hours/day</t>
          </t>
        </th>
        <th>
          <t class='display'>
            <t class='value'>${now.efec.toFixed(2)}</t>
            <t class='offset'>${this.offset(now.efec,before.efec)}</t>
            <t class='unit'>efec</t>
          </t>
        </th>
        <th>
          <t class='display'>
            <t class='value'>${now.efic.toFixed(2)}</t>
            <t class='offset'>${this.offset(now.efic,before.efic)}</t>
            <t class='unit'>efic</t>
          </t>
        </th>
      </tr>
    </table>`
  }

  this.offset = function(now,before,trail = 1)
  {
    var print = now-before > 0 ? `+${(now-before).toFixed(trail)}` : `${(now-before).toFixed(trail)}`
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
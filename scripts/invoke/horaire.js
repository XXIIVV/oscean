Ø("invoke").seal("horaire",(q) => 
{
  var logs = q.tables.horaire
  var html = "<tr><th></th><th colspan='2'>HDf</th><th colspan='2'>HDc</th><th colspan='2'>Efec</th><th colspan='2'>Efic</th><th colspan='2'>Out</th><th colspan='2'>Osc</th><th colspan='2'>Bal</th></tr>"

  var by_y = {}
  for(id in logs){
    var log = logs[id]
    if(!log.time){ continue; }
    var year = log.time.year;
    if(year > new Date().getFullYear()){ continue; }
    if(!by_y[year]){ by_y[year] = []; }
    by_y[year].push(log)
  }

  var horaires = {}

  for(id in by_y){
    horaires[id] = new Horaire(by_y[id])
  }

  var avrg = new Horaire(logs)

  function diff(a,b)
  {
    var offset = (a - b)
    return offset > 0 ? `<t style='color:black; font-family:"input_mono_medium"'>+${offset.toFixed(2)}</t>` : `<t style='color:#999'>${offset.toFixed(2)}</t>`
  }

  for(id in horaires){
    var year = horaires[id]
    html += `
    <tr>
      <th>${id}</th>
      <td>${year.fh > 0 ? `${year.fh}`.substr(0,4) : '—'}</td><td>${diff(year.fh,avrg.fh)}</td>
      <td>${year.ch > 0 ? `${year.ch}`.substr(0,4) : '—'}</td><td>${diff(year.ch,avrg.ch)}</td>
      <td>${year.efec > 0 ? `${year.efec}`.substr(0,4) : '—'}</td><td>${diff(year.efec,avrg.efec)}</td>
      <td>${year.efic > 0 ? `${year.efic}`.substr(0,4) : '—'}</td><td>${diff(year.efic,avrg.efic)}</td>
      <td>${year.focus > 0 ? `${year.focus}`.substr(0,4) : '—'}</td><td>${diff(year.focus,avrg.focus)}</td>
      <td>${year.osc > 0 ? `${year.osc}`.substr(0,4) : '—'}</td><td>${diff(year.osc,avrg.osc)}</td>
      <td>${year.balance > 0 ? `${year.balance}`.substr(0,4) : '—'}</td><td>${diff(year.balance,avrg.balance)}</td>
    </tr>`
    prev = year
  }

    html += `
    <tr>
      <th>AVRG</th>
      <td>${avrg.fh > 0 ? `${avrg.fh}`.substr(0,4) : '—'}</td><td></td>
      <td>${avrg.ch > 0 ? `${avrg.ch}`.substr(0,4) : '—'}</td><td></td>
      <td>${avrg.efec > 0 ? `${avrg.efec}`.substr(0,4) : '—'}</td><td></td>
      <td>${avrg.efic > 0 ? `${avrg.efic}`.substr(0,4) : '—'}</td><td></td>
      <td>${avrg.focus > 0 ? `${avrg.focus}`.substr(0,4) : '—'}</td><td></td>
      <td>${avrg.osc > 0 ? `${avrg.osc}`.substr(0,4) : '—'}</td><td></td>
      <td>${avrg.balance > 0 ? `${avrg.balance}`.substr(0,4) : '—'}</td><td></td>
    </tr>`

  function style()
  {
    return `
    <style>
      #content table.horaire { font-size:11px; font-family:'input_mono_regular'; width:100%; max-width:700px}
      #content table.horaire tr > * { padding:0px 5px !important; }
      #content table.horaire tr td { font-size:11px !important; text-transform:uppercase; line-height:20px !important;}
      #content table.horaire tr td:hover { background:#fff}
      #content table.horaire tr td a { font-family:'input_mono_medium'}
      #content table.horaire tr td.today { text-decoration:underline; background:#fff}
      #content table.horaire tr td.event { background:#000; color:white}
      #content table.horaire tr td.misc { color:#777}
      #content table.horaire tr th { line-height:20px !important; }
      #content list ln.head { line-height:30px !important; border-bottom:1.5px solid black; margin-bottom:15px !important; display:block}
    </style>`
  }

  return `
  <h2>All Time Summary</h2>
  <table class='horaire' width='740'>${html}</table>
  <code><b>HDf</b>, or Hour Day Focus, is Fh/Days.
<b>HDc</b>, or Hour Day Concrete, is Ch/Days.
<b>Efec</b>, or Effectiveness, is AVRG(Fh)/Topics.
<b>Efic</b>, or Efficiency, is AVRG(Ch)/Topics.
<b>Out</b>, is an Average Focus Index AVRG(EFEC+EFIC).
<b>Osc</b>, is an Oscillation index of ABS(EFEC-EFIC).</code>
  ${style()}`
});

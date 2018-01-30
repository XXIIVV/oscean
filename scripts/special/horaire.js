function horaire_view()
{
  this.html = function()
  {
    var html = "";

    var summary = invoke.vessel.horaire.parse(invoke.vessel.horaire.recent());
    var all_time = invoke.vessel.horaire.parse();

    html += this.draw_graph(all_time)
    html += this.draw_summary(summary,all_time);
    html += this.legend()

    return html;
  }

  this.draw_graph = function()
  {
    var years = this.make_yearly();

    var html = "";

    for(y in years){
      var year = years[y];
      html += this.draw_year(y);      
      html += this.draw_line(years,y,"fh","black");
      html += this.draw_line(years,y,"ch","white");
      html += this.draw_line(years,y,"efec","black","stroke-dasharray:4,4");
      html += this.draw_line(years,y,"efic","white","stroke-dasharray:4,4");
    }

    return `<svg style='width:calc(100% - 47px);height:200px; margin-bottom:45px; border-bottom:1px solid black; padding-bottom:15px; padding-left:15px; padding-right:2px'>${html}</svg>`
  }

  this.draw_year = function(y)
  {
    if(y == 2018){ return ""; }
    return `<text x='${(y-2008) * 10}%' y='100%' style="font-size:11px; font-family:'archivo_bold'">${y}</text>`
  }

  this.draw_line = function(all,y,name,stroke,style)
  {
    var from = all[y-1] ? all[y-1][name] : all[y][name];
    var to = all[y][name];
    var from_p = 90 - (from * 10);
    var to_p = 90 - (to * 10);
    var step = 5;
    return `<line x1="${(y-2008) * 10}%" y1="${round(from_p,step)}%" x2="${(y-2007) * 10}%" y2="${round(to_p,step)}%" stroke="${stroke}" style="${style}"></line><circle cx="${(y-2008) * 10}%" cy="${round(from_p,step)}%" r="2" fill="${stroke}"></circle>`;
  }

  this.make_yearly = function()
  {
    var h = {};

    var y = 2008;
    while(y <= 2018){
      var logs = invoke.vessel.horaire.yearly(y);
      var parsed = invoke.vessel.horaire.parse(logs);
      parsed.output = (parsed.fh + parsed.ch + parsed.efec + parsed.efic)/4
      h[y] = parsed
      y += 1;
    }

    return h;
  }

  this.draw_summary = function(summary,all_time)
  {
    var offset = this.make_offset(all_time,summary);

    return `
    <list class='summary'>
      <ln><h2>${summary.fh.toFixed(2)}<hs>hdf</hs><hs class='sub'>${offset.fh>0?"+":""}${offset.fh != 0? offset.fh.toFixed(2) : ""}</hs></h2></ln>
      <ln><h2 style='border-bottom:1px solid white'>${summary.ch.toFixed(2)}<hs>hdc</hs><hs class='sub'>${offset.ch>0?"+":""}${offset.ch != 0 ? offset.ch.toFixed(2) : ""}</hs></h2></ln>
      <ln><h2 style='border-bottom:1px dashed black'>${summary.efec.toFixed(2)}<hs>efec</hs><hs class='sub'>${offset.efec>0?"+":""}${offset.efec != 0 ? offset.efec.toFixed(2) : ""}</hs></h2></ln>
      <ln><h2 style='border-bottom:1px dashed white'>${summary.efic.toFixed(2)}<hs>efic</hs><hs class='sub'>${offset.efic>0?"+":""}${offset.efic != 0 ? offset.efic.toFixed(2) : ""}</hs></h2></ln>
      <ln><h2>${((summary.fh + summary.ch + summary.efec + summary.efic)/4).toFixed(2)}<hs>Output</hs></h2></ln>
      <hr />
    </list>`;
  }

  this.make_offset = function(a,b)
  {
    return {
      fh: b.fh-a.fh,
      ch: b.ch-a.ch,
      efec: b.efec-a.efec,
      efic: b.efic-a.efic
    }
  }

  this.legend = function()
  {
    return `
    <h2>
      <b>Effectiveness</b>, is doing the right thing.<br>
      <b>Efficiency</b>, is doing it the right way.
      </h2>
    <list class='mini'>
      <ln><b>HDF</b>, or Hour Day Focus, is Fh/Days.</ln>
      <ln><b>HDC</b>, or Hour Day Concrete, is Ch/Days.</ln>
      <ln><b>EFEC</b>, or Effectiveness, is AVRG(Fh)/Topics.</ln>
      <ln><b>EFIC</b>, or Efficiency, is AVRG(Ch)/Topics.</ln>
      <ln><b>OUTPUT</b>, is an Average Focus Index.</ln>
      <ln><br />See the <a href='Calendar'>Calendar</a>.</ln>
    </list>`;
  }

  function round(a,b){
    return parseInt(a/b)*b;
  }
};

var payload = new horaire_view();

invoke.vessel.seal("special","horaire",payload);


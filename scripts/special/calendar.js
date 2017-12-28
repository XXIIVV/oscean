function calendar_view()
{
  this.styles = function()
  {
    return `<style>
    #hd { padding-bottom:0px !important}
    #hd > h1 { display:none}
    #hd > icon { display:none}
    #hd > h2 { display:none}
    #hd { background: #fff;color: white;padding-bottom: 40px }
    #sd { color:white}
    #sd icon { display:none}
    #sd > h3 { background:none; padding:0px}
    #sd > h3 list.navi ln.active { color:white}
    #sd > h3 list.navi ln:hover { color:white }
    #md { background:#000; color:white }
    #md > wr > m1 { display:none}
    #md > wr > m2 { display:block; width:680px; margin:0px auto}
    #md > wr > m3 { display:none}
    #md > wr > .monitor { display:none}

    month { display:block; margin-bottom:30px; width:225px; height:140px; overflow:hidden; float:left; font-size:12px; line-height:20px; font-family:'input_mono_regular' }
    month span.name { display:block; text-transform:uppercase; font-family:'input_mono_medium'; color:#555; line-height:40px}
    month day { display:block; width:30px; float:left}
    month day span.audio { color:#72dec2}
    month day span.visual { color:#ffbf05}
    month day span.research { color:#fff}
    month day span.value { color:#999}
    month day span.rune { color:#333}
    list.tidy ln { color:#999}
    list.tidy ln a { color:#fff}
    </style>`;
  }

  this.calendar_graph = function(logs)
  {
    var html = "";
    var prev_month = null;
    var month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September",  "October",  "November",  "December"]

    for(id in logs){
      var log = logs[id];
      var year = log.time.gregorian.y;
      var month = log.time.gregorian.m;
      var day = log.time.gregorian.d;
      if(month != prev_month){
        if(prev_month){ html += "</month>"; }
        html += "<month><span class='name'>"+month_names[parseInt(month)-1]+" "+year+"</span>"
      }
      html += "<day><span class='"+log.sector+"'>"+day+"</span><span class='value'>"+log.value+"</span><span class='rune'>"+log.rune+"</span></day>"
      prev_month = month
    }

    html += "</month><hr />";

    return html;
  }

  this.event_graph = function(logs)
  {
    var html = "";

    for(id in logs){
      var log = logs[id];
      if(!log.is_event){ continue; }
      html += "<ln>"+log.time.gregorian.y+" <a href='"+log.term+"'>"+log.name+"</a></ln>"
    }

    return "<list class='tidy'>"+html+"</list>";
  }

  this.html = function()
  {
    var html = "";

    var logs = invoke.vessel.horaire.logs.slice()

    html += this.calendar_graph(logs.splice(0,365).reverse());
    html += this.event_graph(invoke.vessel.horaire.logs);
    html += this.styles();

    return html;
  }
}; 

var payload = new calendar_view();

invoke.vessel.seal("special","calendar",payload);


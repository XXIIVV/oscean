function horaire_view()
{
  this.styles = function()
  {
    return `<style>
    #oscean { background:#72dec2}
    #hd photo, #hd info { display:none}
    #sd { color:white; display:none}
    #sd > h3 { background:none; padding:0px}
    #sd > h3 list.navi ln.active { color:white}
    #sd > h3 list.navi ln:hover { color:white }
    #md { background:transparent; color:white; padding-left:0px }
    #md > wr { float:none; margin:0px; max-width: 100%; }
    #md > wr > m1 { display:block}
    #md > wr > m2 { display:block; width:100%; margin:0px auto;}
    #md > wr > m3 { display:none}
    #md > wr > .monitor { display:none}

    yu.monitor { display:block; position:relative; height:100px; margin-bottom:45px;margin-left:1%; max-width:900px; font-family:'archivo_bold'; font-size:12px; margin-bottom:200px}
    yu.monitor bar { display:block; width:calc(1% - 1px); background:black; position:absolute; bottom:0px; min-height:3px; border-radius:2px; transition:all 250ms}
    yu.monitor span.from,yu.monitor span.to { color:black;  position:absolute; top:110px;}
    yu.monitor span.from { left:-1% }
    yu.monitor span.to { right:0px}
    yu.monitor .timeline { position: relative;top: 95px;left: -1%;border-bottom: 1px solid black;color: black;line-height: 45px;width: 101%;text-align: center}
    yu.monitor .timeline span { display:inline-block; margin-right:10px}
    yu.monitor .timeline span:hover { text-decoration:underline; cursor:pointer}
    yu.monitor .summary { position:absolute; top:180px; width:100%; margin-left:-1% }
    yu.monitor .summary yu { line-height:30px; width:calc(20% - 30px); margin-right:30px; float:left}
    yu.monitor .summary yu h2 { border-bottom: 1px solid black; font-family:'archivo_light' !important; color:black; font-size:46px !important; letter-spacing:-4px; line-height:60px !important}
    yu.monitor .summary yu h2 value { display:inline-block; font-family:'input_mono_medium'; font-size:12px; letter-spacing:0px; text-transform:uppercase; margin-left:10px}

    .legend { color:white; font-family:'input_mono_regular'; font-size:11px; line-height:16px}
    </style>`;
  }
  
  this.el = document.createElement('yu');
  this.el.className = "monitor";
  this.from_el = document.createElement('span');
  this.from_el.className = "from";
  this.to_el = document.createElement('span');
  this.to_el.className = "to";
  this.timeline_el = document.createElement('yu');
  this.timeline_el.className = "timeline";
  this.summary_el = document.createElement('yu');
  this.summary_el.className = "summary";

  this.el.appendChild(this.from_el);
  this.el.appendChild(this.to_el);
  this.el.appendChild(this.timeline_el);
  this.el.appendChild(this.summary_el);

  this.lod = 100.0;
  this.height = 100;
  this.seg = [];

  var i = 0;
  while(i <= this.lod){
    this.el.appendChild(this.seg[i] = document.createElement('bar'))
    this.seg[i].style.right = `${i}%`;
    i += 1;
  }

  this.update = function(logs)
  {
    if(logs.length < 1){ this.el.className = "monitor inactive"; return; }

    this.el.className = "monitor active";
    this.from_el.textContent = logs[logs.length-1].time;
    this.to_el.textContent = logs[0].time;

    var value_segments = this.parse(logs,"value");
    var vector_segments = this.parse(logs,"vector");

    // Find Max
    var max = 0;
    for(id in value_segments){
      max = value_segments[id]+vector_segments[id] > max ? value_segments[id]+vector_segments[id] : max;
    }
    // Draw
    var i = 0
    while(i < this.lod){
      var val = (value_segments[i]/max);
      var vec = (vector_segments[i]/max);
      this.seg[i].style.height = parseInt(val * this.height)+"px";
      this.seg[i].style.borderTop = parseInt(vec * this.height)+"px solid white";
      i += 1
    }

    this.update_summary(logs);
  }

  this.update_summary = function(logs)
  {
    var html = "";

    var h = {fh:0,ch:0,topics:{}};

    for(id in logs){
      var log = logs[id];
      h.fh += log.value;
      h.ch += log.vector;
      if(log.term != ""){
        if(!h.topics[log.term]){ h.topics[log.term] = {fh:0,ch:0,count:0}; }
        h.topics[log.term].fh += log.value;
        h.topics[log.term].ch += log.vector;
        h.topics[log.term].count += 1;
      }
    }

    // Calculate EFEC/EFIC

    var efec_sum = 0
    var efic_sum = 0
    for(id in h.topics){
      h.topics[id].hdf = h.topics[id].fh/h.topics[id].count;
      h.topics[id].hdc = h.topics[id].ch/h.topics[id].count;
      efec_sum += h.topics[id].hdf
      efic_sum += h.topics[id].hdc
    }

    var summary = {
      fh:(h.fh/logs.length),
      ch:(h.ch/logs.length),
      efec:(efec_sum/Object.keys(h.topics).length),
      efic:(efic_sum/Object.keys(h.topics).length)
    }

    html += `
    <yu><h2>${summary.fh.toFixed(2)}<value>hdf</value></h2></yu>
    <yu><h2>${summary.ch.toFixed(2)}<value>hdc</value></h2></yu>
    <yu><h2>${summary.efec.toFixed(2)}<value>efec</value></h2></yu>
    <yu><h2>${summary.efic.toFixed(2)}<value>efic</value></h2></yu>
    <yu><h2>${((summary.fh + summary.ch + summary.efec + summary.efic)/4).toFixed(2)}<value>Output</value></h2></yu>
    `

    this.summary_el.innerHTML = html;
  }

  this.parse = function(logs,type = "value")
  {
    var segments = {};
    var range = {from:logs[logs.length-1].time.ago,to:logs[0].time.ago};
    for(id in logs){
      var log = logs[id];
      var pos = id/logs.length
      var level = pos * this.lod;
      var level_prev = Math.floor(level)
      var level_next = Math.ceil(level)
      var distr_prev = level_next - level
      var distr_next = 1 - distr_prev
      if(!segments[level_prev]){ segments[level_prev] = 0; }
      if(!segments[level_next]){ segments[level_next] = 0; }
      segments[level_prev] += parseFloat(log[type]) * distr_prev
      segments[level_next] += parseFloat(log[type]) * distr_next
    }
    return segments;
  }
  
  this.html = function()
  {
    var html = "";
    
    invoke.vessel.corpse.m1.innerHTML = "";
    invoke.vessel.corpse.m1.appendChild(this.el);
    this.update(invoke.vessel.horaire.logs);

    html += "<h2 class='end'><b>Effectiveness</b>, is doing the right thing. <br> <b>Efficiency</b>, is doing it the right way.</h2>"
    html += `<div class='legend'>HDF, or Hour Day Focus, is Fh/Days.<br />HDC, or Hour Day Concrete, is Ch/Days.<br />EFEC, or Effectiveness, is AVRG(Fh)/Topics<br />EFIC, or Efficiency, is AVRG(Ch)/Topics<br />OUTPUT, is an Average Focus Index.</div>`;

    this.timeline_el.innerHTML = "";
    // Years
    var y = 2006;
    while(y <= 2018){
      var link = document.createElement('span');
      link.textContent = y;
      link.onclick = (e) => { this.update(this.filter(e.target.textContent)) };
      this.timeline_el.appendChild(link)
      y += 1;
    }
    html += this.styles();

    return html;
  }

  this.filter = function(f)
  {
    var a = [];
    for(id in invoke.vessel.horaire.logs){
      var log = invoke.vessel.horaire.logs[id];
      if(log.time.year == f){
        a.push(log);
      }
    }
    return a;
  }
};

var payload = new horaire_view();

invoke.vessel.seal("special","horaire",payload);


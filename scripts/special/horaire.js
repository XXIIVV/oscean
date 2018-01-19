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

    yu.monitor { display:block; position:relative; height:100px; margin-bottom:45px;margin-left:1%; max-width:900px; font-family:'archivo_bold'; font-size:12px; }
    yu.monitor bar { display:block; width:calc(1% - 1px); background:black; position:absolute; bottom:0px; min-height:3px; border-radius:2px; transition:height 250ms}
    yu.monitor span.from,yu.monitor span.to { color:black;  position:absolute; top:110px;}
    yu.monitor span.from { left:-1% }
    yu.monitor span.to { right:0px}
    yu.monitor .timeline { position: relative;top: 95px;left: -1%;border-bottom: 1px solid black;color: black;line-height: 45px;width: 101%;text-align: center}
    yu.monitor .timeline span { display:inline-block; margin-right:10px}
    yu.monitor .timeline span:hover { text-decoration:underline; cursor:pointer}
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

  this.el.appendChild(this.from_el);
  this.el.appendChild(this.to_el);
  this.el.appendChild(this.timeline_el);

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
    console.log("Update")
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
    console.log(f)
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


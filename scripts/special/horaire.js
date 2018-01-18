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
    #md > wr > m2 { display:block; width:100%; margin:0px auto}
    #md > wr > m3 { display:none}
    #md > wr > .monitor { display:none}

    a.monitor { display:block; position:relative; height:100px }
    a.monitor bar { display:block; width:2px; background:red; position:absolute; bottom:0px}
    </style>`;
  }
  
  this.el = document.createElement('a'); this.el.className = "monitor"; this.el.setAttribute("href","/horaire")
  this.lod = 50.0;
  this.height = 100;
  this.seg = [];

  var i = 0;
  while(i <= this.lod){
    this.el.appendChild(this.seg[i] = document.createElement('bar'))
    this.seg[i].style.right = (i*4)+"px";
    i += 1;
  }

  this.update = function(logs)
  {
    if(logs.length < 1){ this.el.className = "monitor inactive"; return; }

    this.el.className = "monitor active";

    var segments = this.parse(logs);

    // Find Max
    var max = 0;
    for(id in segments){
      max = segments[id] > max ? segments[id] : max;
    }
    // Draw
    var i = 0
    while(i < this.lod){
      var s = (segments[i]/max);
      var soft_s = ((segments[i-1] ? (segments[i-1]/max) : 0) + (segments[i+1] ? (segments[i+1]/max) : 0) + s)/3
      this.seg[i].style.height = soft_s > 0 ? parseInt(soft_s * this.height)+"px" : "3px";
      i += 1
    }
  }

  this.parse = function(logs)
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
      segments[level_prev] += parseFloat(log.value) * distr_prev
      segments[level_next] += parseFloat(log.value) * distr_next
    }
    return segments;
  }
  
  this.html = function()
  {
    var html = "";
    
    invoke.vessel.corpse.m1.innerHTML = "";
    invoke.vessel.corpse.m1.appendChild(this.el);
    this.update(invoke.vessel.lexicon.find("oquonie").logs);
    
    html += "<p>Hello</p>"
    html += this.styles();

    return html;
  }
};

var payload = new horaire_view();

invoke.vessel.seal("special","horaire",payload);


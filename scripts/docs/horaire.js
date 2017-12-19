function horaire_view()
{
  this.parse = function(logs)
  {
    var h = {fh:0,by_date:{},by_day:{},by_sector:{},by_year:{},by_month:{},by_term:{sum:0},by_task:{sum:0}};

    var topics = {}
    var tasks = {}

    for(id in logs){
      var log = logs[id];
      if(log.time.gregorian.y < 2010){ continue; }
      h.fh += log.value;
      // By Date
      if(!h.by_date[log.time.gregorian.y+log.time.gregorian.m]){
        h.by_date[log.time.gregorian.y+log.time.gregorian.m] = {sum:0,sectors:{}};
      }
      if(!h.by_date[log.time.gregorian.y+log.time.gregorian.m][log.sector]){
        h.by_date[log.time.gregorian.y+log.time.gregorian.m][log.sector] = 0;
      }
      h.by_date[log.time.gregorian.y+log.time.gregorian.m].sum += log.value;
      h.by_date[log.time.gregorian.y+log.time.gregorian.m][log.sector] += log.value;

      // By Sector
      if(!h.by_sector[log.sector]){
        h.by_sector[log.sector] = 0
      }
      h.by_sector[log.sector] += log.value;

      // By Year
      if(!h.by_year[log.time.gregorian.y]){
        h.by_year[log.time.gregorian.y] = 0
      }
      h.by_year[log.time.gregorian.y] += log.value;

      // By Month
      if(!h.by_month[log.time.gregorian.m]){
        h.by_month[log.time.gregorian.m] = {sum:0}
      }
      if(!h.by_month[log.time.gregorian.m][log.sector]){
        h.by_month[log.time.gregorian.m][log.sector] = 0
      }
      h.by_month[log.time.gregorian.m].sum += log.value;
      h.by_month[log.time.gregorian.m][log.sector] += log.value;

      // By Day
      if(!h.by_day[log.time.date.getDay()]){
        h.by_day[log.time.date.getDay()] = {sum:0}
      }
      if(!h.by_day[log.time.date.getDay()][log.sector]){
        h.by_day[log.time.date.getDay()][log.sector] = 0
      }
      h.by_day[log.time.date.getDay()].sum += log.value;
      h.by_day[log.time.date.getDay()][log.sector] += log.value;

      // By Term
      if(!h.by_term[log.term]){
        h.by_term[log.term] = {sum:0}
      }
      if(!h.by_term[log.term][log.sector]){
        h.by_term[log.term][log.sector] = 0
      }
      h.by_term[log.term].sum += log.value;
      h.by_term[log.term][log.sector] += log.value;

      // By Task
      if(!h.by_task[log.task]){
        h.by_task[log.task] = {sum:0}
      }
      if(!h.by_task[log.task][log.sector]){
        h.by_task[log.task][log.sector] = 0
      }
      h.by_task[log.task].sum += log.value;
      h.by_task[log.task][log.sector] += log.value;

      topics[log.term] = topics[log.term] ? topics[log.term]+log.value : log.value;
      tasks[log.task] = tasks[log.task] ? tasks[log.task]+log.value : log.value;
    }

    h.d = logs.length
    h.t = Object.keys(topics).length;
    h.tasks = Object.keys(tasks).length;
    h.hdf = h.fh/parseFloat(h.d);
    h.htof = h.fh/parseFloat(h.t);
    h.htaf = h.fh/parseFloat(h.tasks);

    return h;
  }

  this.styles = function()
  {
    return `<style>
    #hd > h1 { display:none}
    #hd > h2 { display:none}
    #hd { background: #fff;color: white;padding-bottom: 40px }
    #md { background:#000; color:white }
    #md > wr > m1 { display:none}
    #md > wr > m3 { display:none}
    #md > wr > .monitor { display:none}

    .general_graph { width:900px; margin:0px auto; height:150px; position:relative; font-family:'input_mono_regular'; font-size:11px; padding-top:50px; padding-bottom:30px}
    .general_graph bar { display:block; position:absolute; bottom:30px; overflow:hidden}
    .general_graph subbar { display:block; width:100%; min-height:0px; margin-bottom:1px}
    .general_graph subbar.audio { background:#72dec2}
    .general_graph subbar.visual { background:#ffbf05}
    .general_graph subbar.research { background:#fff}
    .general_graph span.year { position:absolute; top:0px; color:#555; margin-left:10px}
    .general_graph span.year:before { display: block;height: 200px;content: "";position: absolute;margin-left: -10px;border-left: 1px dashed #333}
    .general_graph span.year i { font-style: normal;display: inline-block;margin-left:10px;font-family: 'input_mono_medium'; color:#999}
    .general_graph span.year i.gain { color:#fff; }
    .general_graph span.year i.gain:before { content:"+"}

    .value_graph { display:inline-block; font-family:'input_mono_regular'; margin-bottom:30px; margin-right:30px}
    .value_graph span.value { font-family: 'input_mono_thin';font-size:40px;display: block;line-height: 35px; }
    .value_graph span.name { font-size:11px; text-transform:uppercase; padding-left:5px}
    .value_graph.right { float:right}
    .value_graph dot { display: inline;padding-right:5px }
    .value_graph dot:before { display: inline;content: ".";position: absolute;margin-left: -9px; color:#555 }
    .value_graph.percent .value:after { content:'%'; color:#555}
    .value_graph.audio .name { color:#72dec2}
    .value_graph.visual .name { color:#ffbf05}
    .value_graph.research .name { color:#fff}
    .value_graph.tasks { margin-left:460px}
    .value_graph.htof { color:#999}
    .value_graph.htaf { color:#999}

    .any_graph { width:900px; margin:0px auto; height:150px; position:relative; font-family:'input_mono_regular'; font-size:11px; padding-top:50px; padding-bottom:30px}
    .any_graph span.project { position:absolute; top:0px; color:#555; margin-left:10px}
    .any_graph span.project:before { display: block;height: 200px;content: "";position: absolute;margin-left: -10px;border-left: 1px dashed #333}
    .any_graph bar { display:block; position:absolute; bottom:30px; overflow:hidden;}
    .any_graph subbar { display:block; width:100%; min-height:0px; margin-bottom:1px}
    .any_graph subbar.audio { background:#72dec2}
    .any_graph subbar.visual { background:#ffbf05}
    .any_graph subbar.research { background:#fff}

    .any_graph.terms { max-width: 630px;overflow: hidden;float: left}
    .any_graph.tasks { max-width: 215px;float: right;overflow: hidden;margin-right:30px}
    </style>`;
  }

  this.value_graph = function(value,name,special = "",trim = true)
  {
    var html = "";
    var value = trim == true ? parseInt(value) : value.toString().substr(0,4);
    var value_str = value > 10000 ? value.toString().substr(0,2)+"K" : value.toString();
    value_str = value_str.indexOf(".") > -1 ? value_str.replace(".","<dot></dot>") : value_str
    html += "<span class='value'>"+value_str+"</span><span class='name'>"+name+"</span>"
    return "<div class='value_graph "+special+"'>"+html+"</div>";
  }

  this.general_graph = function(parsed)
  {
    var html = "";

    var highest_val = 0.0;
    var height = 150.0;
    var bar_width = 8;
    var year_average = parseInt(parsed.fh/8);

    for(date in parsed.by_date){
      var val = parsed.by_date[date].sum;
      highest_val = val > highest_val ? val : highest_val;
    }

    var count = 0;
    var prev_year = 0
    for(date in parsed.by_date){
      var val = parsed.by_date[date].sum;
      var year = date.substr(0,4);
      var offset_val = parsed.by_year[year] - year_average;
      var offset = "<i class='"+(offset_val > 0 ? "gain" : "loss")+"'>"+offset_val+"</i>";
      if(year != prev_year){ html += "<span class='year' style='left:"+(count * (bar_width+1))+"px;'>"+year+offset+"</span>"}

      var sector_html = "<subbar class='audio' style='height:"+((parsed.by_date[date].audio/val)*100)+"%'></subbar>"
      sector_html += "<subbar class='visual' style='height:"+((parsed.by_date[date].visual/val)*100)+"%'></subbar>"
      sector_html += "<subbar class='research' style='height:"+((parsed.by_date[date].research/val)*100)+"%'></subbar>"
      
      html += "<bar style='height:"+parseInt((val/highest_val) * height)+"px; left:"+(count * (bar_width+1))+"px; width:"+bar_width+"px'>"+sector_html+"</bar>"
      count += 1;
      prev_year = year;
    }
    return "<div class='general_graph'>"+html+"</div>";
  }

  this.any_graph = function(parsed,sample,special = "")
  {
    var html = "";

    var height = 150.0;
    var bar_width = 8;
    var highest_val = 0.0;
    var sorted_terms = [];
    for(var name in sample) {
      var val = sample[name].sum;
      highest_val = val > highest_val ? val : highest_val;
      sorted_terms.push([name, val]);
    }

    sorted_terms.sort(function(a, b) {
      return a[1] - b[1];
    });

    sorted_terms = sorted_terms.reverse();

    var count = 0;
    for(name in sorted_terms){
      if(count > 95){ break; }
      var term = sorted_terms[name][0];
      var val = sorted_terms[name][1];

      if(count % 12 == 0){ html += "<span class='project' style='left:"+(count * (bar_width+1))+"px;'>"+term+"</span>"}

      var sector_html = "<subbar class='audio' style='height:"+((sample[term].audio/val)*100)+"%'></subbar>"
      sector_html += "<subbar class='visual' style='height:"+((sample[term].visual/val)*100)+"%'></subbar>"
      sector_html += "<subbar class='research' style='height:"+((sample[term].research/val)*100)+"%'></subbar>"
      
      html += "<bar style='height:"+parseInt((val/highest_val) * height)+"px; left:"+(count * (bar_width+1))+"px; width:"+bar_width+"px'>"+sector_html+"</bar>"
      count += 1;
    }

    return "<div class='any_graph "+special+"'>"+html+"</div>";
  }

  this.html = function()
  {
    var html = "";

    var logs = invoke.vessel.horaire.logs;
    var parsed = this.parse(invoke.vessel.horaire.logs)

    html += this.general_graph(parsed);
    html += this.value_graph(parsed.d,"Logs");
    html += this.value_graph(parsed.fh,"Hours");
    html += this.value_graph((parsed.by_sector.research/parsed.fh) * 100,"Research","right percent research");
    html += this.value_graph((parsed.by_sector.visual/parsed.fh) * 100,"Visual","right percent visual");
    html += this.value_graph((parsed.by_sector.audio/parsed.fh) * 100,"Audio","right percent audio");
    html += "<hr />"

    html += this.any_graph(parsed,parsed.by_term,"terms");
    html += this.any_graph(parsed,parsed.by_task,"tasks");
    html += "<hr />";
    html += this.value_graph(parsed.t,"Topics");
    html += this.value_graph(parsed.htof,"Avg/Topic","htof",true);
    html += this.value_graph(parsed.tasks,"Tasks","tasks");
    html += this.value_graph(parsed.htaf,"Avg/Task","htaf",true);

    html += "<hr />";
    console.log(parsed);

    html += this.styles();
    return html;
  }
}; 

var payload = new horaire_view();

invoke.vessel.seal("docs","horaire",payload);
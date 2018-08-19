function BalanceViz(logs)
{
  Viz.call(this);

  this.logs = this.slice(logs,-52 * 2,0);

  this.balance_at = function(offset)
  {
    var logs = this.slice(this.logs,offset-52,offset);
    var sectors = {audio:0,visual:0,research:0,sum:0}

    for(id in logs){
      var log = logs[id];
      if(!log.term){ continue; }
      sectors[log.sector] += (log.fh+log.ch)/2;
      sectors.sum += (log.fh+log.ch)/2;
    }

    return {
      audio:sectors.audio > 0 ? (sectors.audio/sectors.sum) : 0,
      visual:sectors.visual > 0 ? (sectors.visual/sectors.sum) : 0,
      research:sectors.research ? (sectors.research/sectors.sum) : 0
    };
  }

  this.parse = function()
  {
    var days = []
    var day = 53;
    while(day > 0){
      days.push(this.balance_at(-day))
      day -= 1
    }
    return days;
  }

  this.draw = function()
  {
    var data = this.parse();

    var html = ""
    var day = 52
    var cell = 13
    var height = 95
    var y = 0
    while(day > 0){
      var x = parseInt(day * (cell+1) - (cell))
      var bal = data[day];
      var h_research = parseInt(100 * bal.research)
      var h_visual = parseInt(100 * bal.visual)
      var h_audio = height - h_visual - h_research
      html += `<rect class='research' x='${x}' y='${y}' width='${cell}' height='${h_research}' rx="2" ry="2"></rect>`
      html += `<rect class='visual' x='${x}' y='${h_research+1}' width='${cell}' height='${h_visual}' rx="2" ry="2"></rect>`
      html += `<rect class='audio' x='${x}' y='${h_research+h_visual+2}' width='${cell}' height='${h_audio}' rx="2" ry="2"></rect>`
      day -= 1
    }

    html += this.legend(this.slice(this.logs,-52,0));

    return `<svg class='viz'>${html}</svg>`
  }
}
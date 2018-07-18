function ForecastViz(logs,settings = {})
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
      if(offset > -48){ h.before.push(log); continue; }
      break;
    }
    return h
  }

  this.draw = function()
  {
    var data = this.parse();
    return "hello"
  }

  this.style = function()
  {
    return `
    <style>
      
    </style>
    `
  }

  this.toString = function()
  {
    return this.draw()+this.style()
  }
}
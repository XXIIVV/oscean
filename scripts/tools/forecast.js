function Forecast(logs,limit = 14)
{
  function predict(logs,limit)
  {
    var a = []
    var d = 0
    var offset = make_offset(logs)
    var logs = logs
    while(d < limit){
      var log = make_log(offset)
      a.push({sector:log.sector,value:log.fh,offset:offset})
      logs = [log].concat(logs)
      offset = make_offset(logs)
      d += 1
    }
    return a
  }

  function make_offset(logs)
  {
    var habits = []
    var recents = []

    var i = 0
    for(id in logs){
      var log = logs[id];
      if(id < 14){ recents.push(log); continue; }
      if(id < 14 * 20){ habits.push(log); continue; }
      break;
    }

    var habit = new Horaire(habits).sectors
    var recent = new Horaire(recents).sectors

    return {audio:habit.audio-recent.audio,visual:habit.visual-recent.visual,research:habit.research-recent.research};
  }

  function make_log(offset)
  {
    var sectors = sort_sectors(offset)
    var sector = sort_sectors(offset)[0]
    var sector_code = ["audio","visual","research"].indexOf(sector[0])+1
    var sector_value = clamp(parseInt((sectors[0][1] - sectors[2][1])*1.5),0,9)
    return new Log({code:`-${sector_code}0${sector_value}`})
  }

  function sort_sectors(offset)
  {
    var sectors = []
    for(key in offset){
      sectors.push([key,offset[key]]);
    }
    return sectors.sort(function(a, b){
      return a[1] - b[1];
    }).reverse();
  }

  function clamp(v, min, max){ return v < min ? min : v > max ? max : v; }

  return predict(logs,limit)
}

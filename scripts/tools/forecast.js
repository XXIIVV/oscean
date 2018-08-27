'use strict';

function Forecast(logs,limit = 14)
{
  function predict(logs,limit)
  {
    let a = []
    let d = 0
    let offset = make_offset(logs)
    while(d < limit){
      let log = make_log(offset)
      a.push({sector:log.sector,value:log.fh,offset:offset})
      logs = [log].concat(logs)
      offset = make_offset(logs)
      d += 1
    }
    return a
  }

  function make_offset(logs)
  {
    let habits = []
    let recents = []

    let i = 0
    for(let id in logs){
      let log = logs[id];
      if(id < 14){ recents.push(log); continue; }
      if(id < 14 * 20){ habits.push(log); continue; }
      break;
    }

    let habit = new Horaire(habits).sectors
    let recent = new Horaire(recents).sectors

    return {audio:habit.audio-recent.audio,visual:habit.visual-recent.visual,research:habit.research-recent.research};
  }

  function make_log(offset)
  {
    let sectors = sort_sectors(offset)
    let sector = sort_sectors(offset)[0]
    let sector_code = ["audio","visual","research"].indexOf(sector[0])+1
    let sector_value = clamp(parseInt((sectors[0][1] - sectors[2][1])*1.5),0,9)
    return new Log({code:`-${sector_code}0${sector_value}`})
  }

  function sort_sectors(offset)
  {
    let sectors = []
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

'use strict';

function Forecast(logs)
{
  function predict(logs)
  {
    let offset = make_offset(logs)
    let sectors = sort_sectors(offset)
    let normalized = normalize(sectors);
    let sector = normalized[0]
    let sector_code = ["audio","visual","research"].indexOf(sector[0])+1
    let sector_value = 1-normalized[1][1]
    let code = `-${sector_code}0${parseInt(sector_value*10)}`
    return new Log({code:code})
  }

  function make_offset(logs)
  {
    let habits = []
    let recents = []

    let i = 0
    for(let id in logs){
      let log = logs[id];
      if(id < 14 * 2){ recents.push(log); continue; }
      if(id < 14 * 10){ habits.push(log); continue; }
      break;
    }

    let habit = new Horaire(habits).sectors
    let recent = new Horaire(recents).sectors

    return {audio:habit.audio-recent.audio,visual:habit.visual-recent.visual,research:habit.research-recent.research};
  }

  function normalize(sectors)
  {
    let bump = -sectors[sectors.length-1][1];
    let sectors_mined = sectors.map((val) => { return [val[0],val[1]+bump]; })
    let limit = sectors_mined[0][1];
    let sectors_maxed = sectors_mined.map((val) => { return [val[0],val[1]/limit]; })
    return sectors_maxed
  }

  function sort_sectors(offset)
  {
    let sectors = []
    for(let key in offset){
      sectors.push([key,offset[key]]);
    }
    return sectors.sort(function(a, b){
      return a[1] - b[1];
    }).reverse();
  }

  function clamp(v, min, max){ return v < min ? min : v > max ? max : v; }

  return predict(logs)
}

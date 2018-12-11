'use strict'

function Forecast (logs) {
  function predict (logs) {
    const offset = make_offset(logs)
    const sectors = sortHash(offset)
    const normalized = normalize(sectors)
    const sector = normalized[0]
    const sector_code = ['audio', 'visual', 'research'].indexOf(sector[0]) + 1
    const sector_value = 1 - normalized[1][1]
    const code = `-${sector_code}0${parseInt(sector_value * 10)}`
    return new Log({ code: code })
  }

  function make_offset (logs) {
    const habits = []
    const recents = []

    for (const id in logs) {
      const log = logs[id]
      if (id < 14 * 2) { recents.push(log); continue }
      if (id < 14 * 10) { habits.push(log); continue }
      break
    }

    const habit = new Horaire(habits).sectors
    const recent = new Horaire(recents).sectors

    return { audio: habit.audio - recent.audio, visual: habit.visual - recent.visual, research: habit.research - recent.research }
  }

  function normalize (sectors) {
    const bump = -sectors[sectors.length - 1][1]
    const sectors_mined = sectors.map((val) => { return [val[0], val[1] + bump] })
    const limit = sectors_mined[0][1]
    return sectors_mined.map((val) => { return [val[0], val[1] / limit] })
  }

  return predict(logs)
}

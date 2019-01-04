'use strict'

function Status (logs) {
  this.toString = function () {
    const now = new Horaire(logs.filter(__onlyCurrentMonth))
    const average = new Horaire(logs.filter(__onlyCurrentYear))
    const elapsed = parseInt(now.range.to.time.d)

    const available = {
      stamina: average.fhs * 14,
      productivity: average.chs * 14,
      focus: average.focus * 14
    }
    return `
    <div class='status'>
      <ul>
        <li><b style='color:#72dec2'>Devine Lu Linvega</b></li>
        <li style='color:#666; border-bottom:1.5px solid #333; padding-bottom:10px; margin-bottom:10px'>${now.range.from.time}—${now.range.to.time}, ${14 - now.range.to.time.d} days left</li>
        ${_item('Stamina', available.stamina - (now.fhs * elapsed), available.stamina)}
        ${_item('Productivity', available.productivity - (now.chs * elapsed), available.productivity)}
        ${_item('Focus', available.focus - (now.focus * elapsed), available.focus)}
      </ul>
      <hr />
    </div>`
  }

  function _rating (val, max) {
    return (val / max) > 0.6 ? 'high' : (val / max) > 0.4 ? 'med' : 'low'
  }

  function _progress (val, max, width = 40) {
    return `<svg style='width:${width}px' class='${_rating(val, max)}'><rect x='0' y='0' width='${parseInt((val / max) * width)}' height='13'/></svg>`
  }

  function _item (name, val, max) {
    return `<li class='${name}'><b>${name}</b> <span class='score'>${parseInt(val)}/${parseInt(max)}<i>${name.substr(0, 1)}P</i></span> ${_progress(val, max)}</li>`
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

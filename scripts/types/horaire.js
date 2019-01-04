'use strict'

function Horaire (logs) {
  const h = { fhs: 0, chs: 0, topics: {}, tasks: {}, osc: { sum: 0, average: 0 }, sectors: { audio: 0, visual: 0, research: 0, misc: 0, sum: 0 } }

  for (const id in logs) {
    const log = logs[id]
    h.fhs += log.fh
    h.chs += log.ch
    h.osc.sum += Math.abs(log.fh - log.ch)
    h.tasks[log.task] = h.tasks[log.task] ? h.tasks[log.task] + log.fh : log.fh
    h.sectors[log.sector] += log.fh / 2
    h.sectors.sum += log.fh / 2
    if (!h.topics[log.term]) { h.topics[log.term] = { fh: 0, ch: 0, count: 0 } }
    h.topics[log.term].fh += log.fh
    h.topics[log.term].ch += log.ch
    h.topics[log.term].count += 1
  }

  let efec_sum = 0
  let efic_sum = 0
  for (const id in h.topics) {
    h.topics[id].hdf = h.topics[id].fh / h.topics[id].count
    h.topics[id].hdc = h.topics[id].ch / h.topics[id].count
    efec_sum += h.topics[id].hdf
    efic_sum += h.topics[id].hdc
  }

  h.osc = h.osc.sum / logs.length

  const fh = (h.fhs / logs.length)
  const ch = (h.chs / logs.length)
  const efec = (efec_sum / Object.keys(h.topics).length)
  const efic = (efic_sum / Object.keys(h.topics).length)
  const audio = h.sectors.audio > 0 ? (h.sectors.audio / h.sectors.sum) * 10 : 0
  const visual = h.sectors.visual > 0 ? (h.sectors.visual / h.sectors.sum) * 10 : 0
  const research = h.sectors.research > 0 ? (h.sectors.research / h.sectors.sum) * 10 : 0
  const focus = ((h.fhs + h.chs) / 2) / ((Object.keys(h.topics).length + Object.keys(h.tasks).length) / 2)
  const balance = (1 - ((Math.abs(3.3333 - audio) + Math.abs(3.3333 - visual) + Math.abs(3.3333 - research)) / 13.3333)) * 100

  return {
    fhs: h.fhs,
    chs: h.chs,
    fh: fh,
    ch: ch,
    focus: focus,
    balance: balance,
    efec: efec,
    efic: efic,
    sum: h.fh,
    count: logs.length,
    osc: h.osc,
    sectors: { audio: audio, visual: visual, research: research },
    tasks: h.tasks,
    range: {
      from: logs[logs.length - 1],
      to: logs[0]
    }
  }
}

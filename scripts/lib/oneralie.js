'use strict';

function Oneralie()
{
  this.time = function()
  {
    let d = new Date(), e = new Date(d);
    return (e - d.setHours(0,0,0,0)/8640) * 100;
  }

  this.toString = function()
  {
    let t = `${this.time()}`;
    return t.substr(0,3)+":"+t.substr(3,3);
  }
}

Date.prototype.oneralie = function()
{
  return new Oneralie();
}
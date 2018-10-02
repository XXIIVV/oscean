'use strict';

function Issue(data = {})
{
  Entry.call(this,data.name,data);

  this.host  = null; // From Ø('map')
  
  this.term  = data.term;
  this.task  = data.task;
  this.index = false;

  this.sc     = data.code.length == 2 ? parseInt(data.code.substr(0,1)) : 0
  this.ch     = data.code.length == 2 ? parseInt(data.code.substr(1,1)) : 0
  this.sector = ["misc","audio","visual","research","misc"][this.sc]

  this.body = function()
  {
    return `${this.name}`;
  }

  this.toString = function()
  {
    return `<div><b>${this.task}</b>: ${this.name}</div>`
  }
}
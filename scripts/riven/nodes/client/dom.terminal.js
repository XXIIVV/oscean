'use strict';

function TerminalNode(id,rect,...params)
{
  DomNode.call(this,id,rect,"pre");

  this.glyph = "M65,65 L65,65 L245,65 M65,125 L65,125 L245,125 M65,185 L65,185 L245,185 M65,245 L65,245 L245,245 "

  this.bang = function(q)
  {
    if(q.substr(0,1) == "~"){ q = q.replace("~","").trim(); }

    this.input(q);
  }

  this.input = function(q)
  {
    this.el.innerHTML += `<b>${q}</b>: ${this.reply(q)}\n`
    Ø("search").el.value = "~"
  }

  this.reply = function(q)
  {
    return "Unknown command."
  }
}
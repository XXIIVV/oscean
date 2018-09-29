'use strict';

function BuildNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z M150,60 L150,60 L240,150 L150,240 "

  this.receive = function(q)
  {
    const builds = this.request(q)

    this.send({
      title: `XXIIVV — ${q.target.capitalize()}`,
      theme: q.result ? q.result.theme : 'default',
      view:{
        header:builds._header,
        core:{
          sidebar:builds._sidebar,
          content:builds._content,
          navi:builds._navi
        }
      }
    })

    // Install Dom
    document.body.appendChild(this.signal("view").answer())
  }
}
function BuildContentNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template

  this.cache = null;

  this.answer = function(q)
  {
    if(!q.result){ return this.signal('missing').answer(q) }

    var template = q.params ? q.params.toLowerCase() : q.result.type ? q.result.type.toLowerCase() : null

    if(!template){ return this.signal('default').answer(q) }

    var responder = this.signal(template)

    if(!responder){ return `<p>Sorry, there is no <b>:${template}</b> template for {{${q.result.name.capitalize()}}}.</p>`.to_markup() }

    return responder.answer(q)
  }
}
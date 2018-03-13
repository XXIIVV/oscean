function SpecialTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {    
    var target = q.result.name.toLowerCase()

    if(this.signal(target)){
      return this.signal(target).answer(q);
    }
    console.warn(`Missing spcial template: ${target}`)
  }
}
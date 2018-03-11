function CalendarTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {    
    console.log(q)
    return {
      title: q.name.capitalize(),
      view:{
        core:{
          content:"hey"
        }
      }
    }
  }
}
function HomeTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {    
    return {
      title: q.name.capitalize(),
      view:{
        core:{
          content:"Hey!"
        }
      }
    }
  }
}
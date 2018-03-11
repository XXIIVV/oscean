function PageTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {
    return {
      title: q.name.capitalize(),
      view:{
        header:{
          photo: "heyyy"
        },
        core:{
          content:"hey2"
        }
      }
    }
  }
}
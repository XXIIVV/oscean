function DocumentNode(id,rect,...params)
{
  DomNode.call(this,id,rect);

  this.glyph = NODE_GLYPHS.render
  
  this.receive = function(content = {title:"Unknown"})
  {
    document.title = content.title
    this.label = `${content.title}`

    if(content && content[this.id] != null){
      this.update(content[this.id]);
      this.send(content[this.id])
    }
  }
}

function on_scroll()
{
  var info_el = document.getElementById("info")
  var scroll = window.scrollY;

  // Info
  if(scroll > 0){
    if(info_el.className != "ghost"){
      info_el.className = "ghost"
    }
  }
  else{
    if(info_el.className == "ghost"){
      info_el.className = ""
    }
  }

  // Logo/Search
  var header_el = document.getElementById("header")
  var logo_el = document.getElementById("logo")
  var menu_el = document.getElementById("menu")
  if(scroll > header.offsetHeight - 110){
    if(logo_el.className != "sticky"){ logo_el.className = "sticky" }
    if(menu_el.className != "sticky"){ menu_el.className = "sticky" }
  }
  else{
    if(logo_el.className == "sticky"){ logo_el.className = "" }
    if(menu_el.className == "sticky"){ menu_el.className = "" }
  }
}

window.addEventListener("scroll", on_scroll);
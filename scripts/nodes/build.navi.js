function BuildNaviNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.builder

  this.cache = null;

  this.answer = function(q)
  {
    var html = ""
    var portal = this.find_portal(q.result,q.tables.lexicon);

    if(!portal){ return "<table></table>" }

    return `
    <table>
    <tr><td><svg id="glyph"><path transform="scale(0.175,0.175) translate(-50,-125)" d="${portal.glyph}"></path></svg></td></tr>
    <tr><td>${this.make_table(portal,q.tables.lexicon,3,q.result)}</td></tr>
    </table>`
  }

  this.make_table = function(term,lexicon,depth = 3, selection = null)
  {
    if(depth <= 0){ return "" }
    var children = term.children
    if(children.length == 0){ return ""}

    var html = ""

    if(depth == 2){
      for(id in children){
        var child = children[id];
        html += selection && child.name == selection.name ?  `<t class='depth${depth}'>{*${child.name.capitalize()}*}${this.make_table(child,lexicon,depth-1,selection)}</t> `.to_markup() : `<t class='depth${depth}'>{{${child.name.capitalize()}}}${this.make_table(child,lexicon,depth-1,selection)}</t> `.to_markup()
      }
      return html
    }

    if(depth == 1){
      for(id in children){
        var child = children[id];
        html += selection && child.name == selection.name ? `<t class='depth${depth}'>{*${child.name.capitalize()}*}</t> `.to_markup() : `<t class='depth${depth}'>{{${child.name.capitalize()}}}</t> `.to_markup()
      }
      return children.length > 0 ? `(${html.trim()})` : ''
    }
    html += "<table width='100%'>"
    for(id in children){
      var child = children[id];
      html += `<tr class='head'><th class='${selection && child.name == selection.name ? 'selected' : ''}'>{{${child.name.capitalize()}}}</th><td>${this.make_table(child,lexicon,depth-1,selection)}</td></tr>`.to_markup()
    }
    html += "</table>"
    return html
  }

  this.find_portal = function(term,lexicon)
  {
    if(!term || !lexicon[term.unde().toUpperCase()]){ console.log("Parent is missing"); return "" }

    var portal = null
    var parent = lexicon[term.unde().toUpperCase()]
    if(term.type && term.type.toLowerCase() == "portal"){
      portal = term
    }
    else if(parent.is_portal){
      portal = parent
    }
    else{
      var parent_parent = lexicon[parent.unde().toUpperCase()]
      if(parent_parent.is_portal){
        portal = parent_parent
      }
      else{
        var parent_parent_parent = lexicon[parent_parent.unde().toUpperCase()]
        if(parent_parent_parent.is_portal){
          portal = parent_parent_parent
        }
      }
    }
    return portal;
  }
}
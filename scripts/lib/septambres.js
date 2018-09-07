function Septambres(aeth)
{
  this.aeth = aeth.toLowerCase();
  
  this.template = function(glyph_id,seg_id,grid,style)
  {
    let offset = glyph_id*(style.size.w+style.spacing);
    let rect = {w:style.size.w,h:style.size.h}
    
    if(grid == 1){
      rect = {x:offset,y:0,w:style.size.w,h:style.size.h}
    }
    else if(grid == 2){
      if(seg_id == 0){ rect = {x:offset,y:0,w:(style.size.w),h:(style.size.h/2)} }
      if(seg_id == 1){ rect = {x:offset,y:(style.size.w/2),w:(style.size.w),h:(style.size.h/2)} }
    }
    else if(grid == 3){
      if(seg_id == 0){ rect = {x:offset,y:0,w:(style.size.w),h:(style.size.h/2)} }
      if(seg_id == 1){ rect = {x:offset,y:(style.size.w/2),w:(style.size.w/2),h:(style.size.h/2)} }
      if(seg_id == 2){ rect = {x:offset+(style.size.w/2),y:(style.size.w/2),w:(style.size.w/2),h:(style.size.h/2)} }
    }
    else if(grid == 4){
      if(seg_id == 0){ rect = {x:offset,y:0,w:(style.size.w/2),h:(style.size.h/2)} }
      if(seg_id == 1){ rect = {x:offset+(style.size.w/2),y:0,w:(style.size.w/2),h:(style.size.h/2)} }
      if(seg_id == 2){ rect = {x:offset,y:(style.size.w/2),w:(style.size.w/2),h:(style.size.h/2)} }
      if(seg_id == 3){ rect = {x:offset+(style.size.w/2),y:(style.size.w/2),w:(style.size.w/2),h:(style.size.h/2)} }
    }
    else{
      console.warn('Unknown grid',grid)
    }
    
    return {
      TL:{x:rect.x,y:rect.y},
      TC:{x:rect.x+(rect.w/2),y:rect.y},
      TR:{x:rect.x+rect.w,y:rect.y},
      CL:{x:rect.x,y:rect.y+(rect.h/2)},
      CC:{x:rect.x+(rect.w/2),y:rect.y+(rect.h/2)},
      CR:{x:rect.x+rect.w,y:rect.y+(rect.h/2)},
      BL:{x:rect.x,y:rect.y+rect.h},
      BC:{x:rect.x+(rect.w/2),y:rect.y+rect.h},
      BR:{x:rect.x+rect.w,y:rect.y+rect.h},
      PUSH:{x:style.thickness*0.5,y:style.thickness*0.5}
    }
  }
  
  this.draw = function(seg,template)
  {
    let html = ''
    let consonant = seg.substr(0,1)
    let vowel = seg.substr(1,1)
    let path = ''
    let x = (consonant == "d" || consonant == "l" || consonant == "f") ? 1 : (consonant == "t" || consonant == "s" || consonant == "v") ? 0 : -1
    let y = (consonant == "k" || consonant == "t" || consonant == "d") ? 1 : (consonant == "r" || consonant == "s" || consonant == "l") ? 0 : -1
      
    // Int
    for(let id in template){
      template[id] = {x:parseInt(template[id].x),y:parseInt(template[id].y)}
    }
      
    // Consonant
    if(consonant == "k"){ path += `M${template.CL.x},${template.CL.y} L${template.TL.x},${template.TL.y} L${template.TR.x},${template.TR.y} `; }
    else if(consonant == "t"){ path += `M${template.TL.x},${template.TL.y} L${template.TR.x},${template.TR.y} M${template.TC.x},${template.TC.y} L${template.CC.x},${template.CC.y} `; }
    else if(consonant == "d"){ path += `M${template.TL.x},${template.TL.y} L${template.TR.x},${template.TR.y} L${template.CR.x},${template.CR.y} `; }
    else if(consonant == "r"){ path += `M${template.TL.x},${template.TL.y} L${template.BL.x},${template.BL.y} M${template.CL.x},${template.CL.y} L${template.CC.x},${template.CC.y} `; }
    else if(consonant == "s"){ path += `M${template.TC.x},${template.TC.y} L${template.BC.x},${template.BC.y} `; }
    else if(consonant == "l"){ path += `M${template.TR.x},${template.TR.y} L${template.BR.x},${template.BR.y} M${template.CC.x},${template.CC.y} L${template.CR.x},${template.CR.y} `; }
    else if(consonant == "j"){ path += `M${template.CL.x},${template.CL.y} L${template.BL.x},${template.BL.y} L${template.BR.x},${template.BR.y} `; }
    else if(consonant == "v"){ path += `M${template.BL.x},${template.BL.y} L${template.BR.x},${template.BR.y} M${template.CC.x},${template.CC.y} L${template.BC.x},${template.BC.y} `; }
    else if(consonant == "f"){ path += `M${template.BL.x},${template.BL.y} L${template.BR.x},${template.BR.y} L${template.CR.x},${template.CR.y} `; }
    else if(consonant == "-"){ }
    else{ console.warn("Missing consonant",consonant); }
    
    // Vowel
    if(vowel == "i"){
      if(consonant == "-"){ path += `M${template.CC.x},${template.CC.y} L${template.CC.x-template.PUSH.x},${template.CC.y} L${template.BL.x+template.PUSH.x},${template.BL.y} L${template.BL.x},${template.BL.y} `; }
      else if(y == -1 || x == -1 && y <= 0){ path += `M${template.CC.x},${template.CC.y} L${template.CC.x+template.PUSH.x},${template.CC.y} L${template.TR.x-template.PUSH.x},${template.TR.y} L${template.TR.x},${template.TR.y} `; }
      else{ path += `M${template.CC.x},${template.CC.y} L${template.CC.x-template.PUSH.x},${template.CC.y} L${template.BL.x+template.PUSH.x},${template.BL.y} L${template.BL.x},${template.BL.y} `; }
    }
    else if(vowel == "o"){
      if(consonant == "-"){ path += `M${template.CC.x},${template.CC.y} L${template.CC.x-template.PUSH.x},${template.CC.y} L${template.TL.x+template.PUSH.x},${template.TL.y} L${template.TL.x},${template.TL.y} `; }
      else if(y == -1 || x == 1 && y == 0){ path += `M${template.CC.x},${template.CC.y} L${template.CC.x-template.PUSH.x},${template.CC.y} L${template.TL.x+template.PUSH.x},${template.TL.y} L${template.TL.x},${template.TL.y} `; }
      else{ path += `M${template.CC.x},${template.CC.y} L${template.CC.x+template.PUSH.x},${template.CC.y} L${template.BR.x-template.PUSH.x},${template.BR.y} L${template.BR.x},${template.BR.y} `; }
    }
    else if(vowel == "a"){
      if(consonant == "-"){ path += `M${template.CC.x},${template.CC.y} L${template.CL.x},${template.CL.y} `; }
      else if(consonant == "k" || consonant == "r" || consonant == "j" || consonant == "t"){ path += `M${template.CC.x},${template.CC.y} L${template.CR.x},${template.CR.y} `; }
      else if(consonant == "d" || consonant == "l" || consonant == "f" || consonant == "v"){ path += `M${template.CC.x},${template.CC.y} L${template.CL.x},${template.CL.y} `; }
      else{ path += `M${template.CL.x},${template.CL.y} L${template.CR.x},${template.CR.y} `; }
    }
    else if(vowel == "-" || vowel == "y"){ }
    else{ console.warn("Missing vowel",vowel); }
    
    return path
  }
  
  this.glyph = function(id,aeth,style)
  {
    let path = ""
    let segs = []
    if(aeth.length > 0){ segs.push(aeth.substr(0,2)); }
    if(aeth.length > 2){ segs.push(aeth.substr(2,2)); }
    if(aeth.length > 4){ segs.push(aeth.substr(4,2)); }
    if(aeth.length > 6){ segs.push(aeth.substr(6,2)); }
    
    for(let i in segs){
      let template = this.template(parseInt(id),parseInt(i),aeth.length/2,style)
      path += this.draw(segs[i],template);
    }
  
    return path
  }
  
  this.small = function()
  {
    return this.toString({pad:5,size:{w:20,h:20},spacing:5,thickness:3.5})
  }
  
  this.medium = function(weight = 400)
  {
    var t = {200:3.5,400:5.5,600:7.5}
    return this.toString({pad:15,size:{w:40,h:40},spacing:10,thickness:t[weight]})
  }
  
  this.large = function(weight = 400)
  {
    var t = {200:3.5,400:5.5,600:29.5}
    return this.toString({pad:15,size:{w:200,h:200},spacing:0,thickness:t[weight]})
  }
  
  this.toString = function(style = {pad:15,size:{w:40,h:40},spacing:10,thickness:7.5})
  {
    let path = ""
    let parts = this.aeth.split(" ")
    for(let id in parts){
      path += this.glyph(parseInt(id),parts[id],style)
    }
    return `<svg style='width:${parts.length * (style.size.w+style.spacing) - style.spacing}px; height:${style.size.h}px; padding:${style.pad}'><path d='${path}' stroke='black' fill='none' stroke-width='${style.thickness}' stroke-linecap='square'/></svg>`;
  }
}
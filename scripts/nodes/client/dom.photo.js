function DomPhotoNode(id,rect,...params)
{
  DomNode.call(this,id,rect);

  this.media = document.createElement("media")
  this.glyph = NODE_GLYPHS.photo

  this.install = function(elements)
  {
    this.is_installed = true;
    this.el.appendChild(this.media);

    for(id in elements){
      this.el.appendChild(elements[id])
    }
  }

  this.update = function(content)
  {
    if(content > 0){
      is_dark(`media/diary/${content}.jpg`,this.update_header)  
      this.media.style.backgroundImage = `url(media/diary/${content}.jpg)`;
      this.el.className = ""
    }
    else{
      this.el.className = "empty"
      Ø("header").el.className = "no_photo"
    }
  }

  this.update_header = function(v = true)
  {
    Ø("header").el.className = v ? "dark" : "light"
  }

  function is_dark(imageSrc,callback)
  {
    var fuzzy = -0.4;
    var img = document.createElement("img");
    img.src = imageSrc;

    img.onload = function(){
      var canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(this,0,0);
      var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
      var data = imageData.data;
      var r,g,b, max_rgb;
      var light = 0, dark = 0;
      for(var x = 0, len = data.length; x < len; x+=4){
          r = data[x];
          g = data[x+1];
          b = data[x+2];
          max_rgb = Math.max(Math.max(r, g), b);
          if (max_rgb < 128)
              dark++;
          else
              light++;
      }
      var dl_diff = ((light - dark) / (this.width*this.height));
      callback(dl_diff + fuzzy < 0 ? true : false);
    }
  }
}
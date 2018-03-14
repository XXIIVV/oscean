function Term(name,dict)
{
  this.name = name;
  this.glyph = "M240,240 l0,-90 a-90,-90 0 0,0 -90,-90 l-90,0 l0,90 a90,90 0 0,0 90,90 l60,0 l0,-90 a-60,-60 0 0,0 -60,-60 l-60,0 l0,60 a60,60 0 0,0 60,60 l30,0 l0,-60 a-30,-30 0 0,0 -30,-30 l-30,0 l0,30 a30,30 0 0,0 30,30"

  this.dict = dict;
  this.type = dict.TYPE;
  this.links = this.dict.LINK ? this.dict.LINK : [];
  this.flag = this.dict.FLAG ? this.dict.FLAG : [];
  this.glyph = this.dict.ICON ? this.dict.ICON : this.glyph;
  
  this.bref = function()
  {
    return this.dict && this.dict.BREF ? this.dict.BREF.to_markup() : ''
  }

  this.long = function()
  {
    return new Runic(this.dict.LONG).html()
  }

  this.unde = function()
  {
    return this.dict.UNDE
  }
}
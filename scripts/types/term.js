function Term(name,dict)
{
  this.name = name;

  this.dict = dict;
  this.type = dict.TYPE ? dict.TYPE.toLowerCase() : 'none';
  this.links = this.dict.LINK ? this.dict.LINK : [];
  this.flag = this.dict.FLAG ? this.dict.FLAG : [];
  this.glyph = this.dict.ICON ? this.dict.ICON : '';

  // Filled with Ø('map')
  this.parent = null
  this.children = []
  this.logs = []
  this.diaries = []
  this.latest_log = null
  this.featured_log = null

  this.is_portal = this.type && (this.type.toLowerCase() == "portal")
  
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
    return this.dict.UNDE ? this.dict.UNDE : "Home"
  }
}
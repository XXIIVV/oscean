function Term(name,dict)
{
  this.name = name;
  this.diaries = [];
  this.children = [];
  this.parent = null;
  this.logs = [];

  if(dict){
    this.dict = dict;
    this.type = dict.TYPE;
    this.links = this.dict.LINK ? this.dict.LINK : [];
    this.flag = this.dict.FLAG ? this.dict.FLAG : [];
  }
  
  this.start = function()
  {
    if(dict){
      this.bref = this.dict.BREF ? this.dict.BREF.to_markup() : "Missing";
    }
    this.diaries = this.find_diaries();
  }

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
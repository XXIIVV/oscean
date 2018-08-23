function Entry(name,data)
{
  this.name = name;
  this.data = data;
  this.unde = "Home"

  this.span = {from:null,to:null}
  this.issues = []
  this.logs = []
  this.diaries = []
  this.tags = []

  this.glyph = function()
  {
    return null;
  }

  this.portal = function()
  {
    return null;
  }

  this.has_tag = function()
  {
    return false
  }

  this.toString = function()
  {
    return `<div class='error'>Unformatted Entry: ${name}</div>`
  }
}
function Issue(data = {})
{
  Entry.call(this,name,data);

  this.host  = null; // From Ø('map')
  
  this.term = data.term;
  this.name = data.name;
  this.task = data.task;

  this.toString = function()
  {
    return `<div>${this.task}: ${this.name}</div>`
  }
}
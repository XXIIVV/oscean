function Issue(data = {})
{
  Entry.call(this,data.name,data);

  this.host  = null; // From Ø('map')
  
  this.term  = data.term;
  this.task  = data.task;
  this.index = false;

  this.toString = function()
  {
    return `<div>${this.task}: ${this.name}</div>`
  }
}
function Issue(name,tasks = [])
{
  this.host  = null; // From Ø('map')
  
  this.name = name.capitalize();
  this.tasks = tasks ? tasks : [];

  this.toString = function()
  {
    var html = ``
    for(id in this.tasks){
      html += `<ln class='task'>${this.tasks[id]}</ln>`
    }
    return `<issue><div class='name'>${this.name.capitalize()}${this.tasks.length > 1 ? `, ${this.tasks.length} Tasks` : ''}</div><list>${html}</list></issue>`.to_markup()
  }
}
function Issue(data)
{
  this.data = data;

  this.term = null; // Assigned in Map

  this.time = this.data.date && this.data.date != '-----' ? new Desamber(this.data.date) : null;

  this.is_active = function()
  {

  }
  
  this.toString = function()
  {
    return `
    <issue>
      ${this.time ? `<t class='flag date'>${this.time}</t>` : ''}
      <t class='term'>${this.term.name}</t>
    </issue>`.to_markup()
  }
}
function Issue(data)
{
  this.data = data;

  this.term = null; // Assigned in Map

  this.toString = function()
  {
    return `
    <issue>
      ${this.data}
    </issue>`.to_markup()
  }
}
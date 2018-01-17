function Desamber(time_str)
{
  this.time_str = time_str;

  this.months_in_year = 26;
  this.days_in_month = 14;

  this.gregorian = {
    y : time_str.substr(0,4),
    m : time_str.substr(4,2),
    d : time_str.substr(6,2),
    format : time_str.substr(0,4)+"-"+time_str.substr(4,2)+"-"+time_str.substr(6,2)
  }

  this.date = new Date(this.gregorian.format); 

  var start = new Date(this.date.getFullYear(), 0, 0);
  var diff = (this.date - start) + ((start.getTimezoneOffset() - this.date.getTimezoneOffset()) * 60 * 1000);

  this.doty = Math.floor(diff/86400000); // day of the year
  this.month = Math.floor(this.doty / this.months_in_year);
  this.day = (this.doty % this.days_in_month); this.day = this.day == 0 ? 14 : this.day;

  this.is_today = function()
  {
    if(new Date().getDate() != this.date.getDate()){ return false; }
    if(new Date().getMonth() != this.date.getMonth()){ return false; }
    if(new Date().getFullYear() != this.date.getFullYear()){ return false; }
    return true;
  }

  this.offset = function(d2)
  {
    return (this.date - d2.getTime())/1000/86400;
  }

  this.is_leap_year = function()
  {
    var year = this.gregorian.y;
    return (year & 3) == 0 && ((year % 25) != 0 || (year & 15) == 0);
  }

  this.toString = function()
  {
    var d = this.day;
    var m = String.fromCharCode(98 + this.month).toUpperCase();
    var y = this.date.getFullYear().toString().substr(2,2);
    return `<span title='${this.gregorian.format}'>${y}${m}${d}</span>`;
  }
}

invoke.seal("core","desamber");
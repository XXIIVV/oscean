function Desamber(time_str)
{
  this.time_str = time_str;

  this.gregorian = {
    y : time_str.substr(0,4),
    m : time_str.substr(4,2),
    d : time_str.substr(6,2),
    format : time_str.substr(0,4)+"-"+time_str.substr(4,2)+"-"+time_str.substr(6,2)
  }

  this.date = new Date(this.gregorian.format)
  this.time = this.date.getTime()
  this.ago = (new Date().getTime() - this.time)/1000/86400
  this.year = (new Date(this.gregorian.y+"-01-01").getTime() - new Date().getTime())/1000/86400;

  this.offset = function(d2)
  {
    return (this.time - d2.getTime())/1000/86400;
  }

  this.of_the_year = function()
  {
    var now = this.date;
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay)
  }

  this.is_leap_year = function()
  {
    var year = this.gregorian.y;
    return (year & 3) == 0 && ((year % 25) != 0 || (year & 15) == 0);
  }
}

invoke.seal("core","desamber");
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
}

invoke.seal("core","desamber");
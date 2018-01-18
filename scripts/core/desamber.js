function Desamber(str)
{
  this.str = str;
  this.year = parseInt(`20${str.substr(0,2)}`);

  this.toString = function()
  {
    return this.str;
  }
}

Date.prototype.desamber = function()
{
  var start = new Date(this.getFullYear(), 0, 0);
  var diff = (this - start) + ((start.getTimezoneOffset() - this.getTimezoneOffset()) * 60 * 1000);
  var doty = Math.floor(diff/86400000);
  var y = this.getFullYear().toString().substr(2,2);
  var m = String.fromCharCode(97 + Math.floor(((doty-1)/364) * 26)).toUpperCase();
  var d = (doty % 14); d = d < 10 ? `0${d}` : d; d = d == "00" ? "14" : d;
  return new Desamber(`${y}${m}${d}`);
}

invoke.seal("core","desamber");
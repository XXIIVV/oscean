function Desamber(str)
{
  this.str = str.match(/\d\d[a-z\+]\d\d/i) ? str : "01+01";

  this.y = str.substr(0,2);
  this.m = str.substr(2,1).toUpperCase(); 
  this.d = str.substr(3,2);

  this.year = parseInt(`20${this.y}`);
  this.month = this.m == "+" ? 26 : this.m.charCodeAt(0) - 65;
  this.doty = (parseInt(this.month) * 14) + parseInt(this.d);

  this.date = new Date(this.year, 0).setDate(this.doty)
  this.offset = parseInt((this.date - new Date())/86400000)

  this.to_gregorian = function()
  {
    return `${this.date.getFullYear()}-${prepend(this.date.getMonth()+1,2)}-${prepend(this.date.getDate(),2)}`;
  }

  this.to_date = function()
  {
    return new Date(this.date);
  }

  this.ago = function(cap = 9999)
  {
    var days = this.offset;

    if(-days > cap)  { return `${this.toString()}`; }

    if(days == -1)   { return `yesterday`; }
    if(days == 1)    { return "tomorrow"; }
    if(days == 0)    { return "today"; }
    if(days < -365)  { return `${parseInt(days/-365)} years ago`; }
    if(days < 1)     { return `${days*-1} days ago`; }
    return `in ${days} days`;
  }

  this.toString = function()
  {
    return this.str.toUpperCase();
  }

  function prepend(s,l,c="0"){ while(s.length < l){ s = `${c}${s}`; }; return s; }
}

Date.prototype.desamber = function()
{
  var year = this.getFullYear()
  var start = new Date(year, 0, 0);
  var diff = (this - start) + ((start.getTimezoneOffset() - this.getTimezoneOffset()) * 60 * 1000);
  var doty = Math.floor(diff/86400000);
  var leap = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)
  var days = leap ? 366 : 365

  var y = year.toString().substr(2,2);
  var m = String.fromCharCode(97 + Math.floor(((doty)/days) * 26)).toUpperCase(); m = doty == 365 || doty == 366 ? "+" : m;
  var d = (doty % 14); d = d < 10 ? `0${d}` : d; d = d == "00" ? "14" : d; d = doty == 365 ? "01" : (doty == 366 ? "02" : d);
  
  return new Desamber(`${y}${m}${d}`);
}

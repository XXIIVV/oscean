function Desamber(str)
{
  this.str = str;

  this.y = str.substr(0,2);
  this.m = str.substr(2,1); 
  this.d = str.substr(3,2);

  this.year = parseInt(`20${this.y}`);
  this.month = this.m == "+" ? 26 : this.m.charCodeAt(0) - 65;
  this.doty = (parseInt(this.month) * 14) + parseInt(this.d);

  this.to_gregorian = function()
  {
    var date = this.to_date();
    return `${date.getFullYear()}-${prepend(date.getMonth()+1,2)}-${prepend(date.getDate(),2)}`;
  }

  this.offset = function(b = new Date().desamber())
  {
    return parseInt((this.to_date() - b.to_date())/86400000);
  }

  this.offset_format = function(b = new Date().desamber())
  {
    var days = this.offset();

    if(days == 1){ return "tomorrow"; }
    if(days == 0){ return "today"; }
    if(days > 0){ return `in ${days} days`; }
    // if(days < -14){ return `${this.toString()}`; }
    if(days < 0){ return `${days*-1} days ago`; }
    
    return `in ${days} days`;
  }

  this.to_date = function()
  {
    var year = new Date(this.year, 0);
    return new Date(year.setDate(this.doty)); 
  }

  this.to_offset = function(offset)
  {
    var from = this.to_date()

    return new Date(from.getFullYear(),from.getMonth(),from.getDate()+offset,from.getHours(),from.getMinutes(),from.getSeconds()).desamber();
  }

  this.toString = function()
  {
    return this.str;
  }

  function prepend(s,length,char = "0")
  {
    var p = "";
    while((p+s).length < length){
      p += char;
    }
    return p+s;
  }
}

Date.prototype.desamber = function()
{
  var start = new Date(this.getFullYear(), 0, 0);
  var diff = (this - start) + ((start.getTimezoneOffset() - this.getTimezoneOffset()) * 60 * 1000);
  var doty = Math.floor(diff/86400000);
  var y = this.getFullYear().toString().substr(2,2);
  var m = String.fromCharCode(97 + Math.floor(((doty-1)/364) * 26)).toUpperCase(); m = doty == 365 || doty == 366 ? "+" : m;
  var d = (doty % 14); d = d < 10 ? `0${d}` : d; d = d == "00" ? "14" : d; d = doty == 365 ? "01" : (doty == 366 ? "02" : d);
  return new Desamber(`${y}${m}${d}`);
}

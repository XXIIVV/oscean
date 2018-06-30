function Clock()
{
  this.start = function()
  {
    clock.update();
  }

  this.time = function()
  {
    var d = new Date(), e = new Date(d);
    var msSinceMidnight = e - d.setHours(0,0,0,0);
    var val = msSinceMidnight / 8640 / 10000;
    return val.toFixed(6).substr(2,6);
  }

  this.toString = function()
  {
    var t = this.time().toString();
    return t.substr(0,3)+":"+t.substr(3,3);
  }
}

function Entaloneralie()
{
  var clock = new Clock();
  
  this.radius = 90;
  this.circ = this.radius * 2 * Math.PI;
  this.center = 105;
  this.el = document.createElement("yu")

  this.size = {width:window.innerWidth,height:window.innerHeight,ratio:2};

  this.update = function(w,h)
  {
    this.el.innerHTML = `<svg width="${w}" height="${h}"><path d="${this.path(w,h)}"></path></svg>`;
  }

  this.path = function(w,h,second_needle = false)
  {
    var t        = clock.time();
    var pad      = 0;
    var needle_1 = parseInt(((t/1000000) % 1) * (h - (pad*2))) + pad;
    var needle_2 = parseInt(((t/100000) % 1) * (w - (pad*2))) + pad;
    var needle_3 = needle_1 + parseInt(((t/10000) % 1) * (h - pad - needle_1));
    var needle_4 = needle_2 + parseInt(((t/1000) % 1) * (w - pad - needle_2));
    var needle_5 = needle_3 + parseInt(((t/100) % 1) * (h - pad - needle_3));
    var needle_6 = needle_4 + parseInt(((t/10) % 1) * (w - pad - needle_4));

    // Make sure there are no double lines
    if(needle_4 == needle_2+1){
      needle_4 += 1
    }
    if(needle_3 == needle_1+1){
      needle_3 += 1
    }

    var path = `M${pad},${needle_1} L${w-pad},${needle_1} M${needle_2},${needle_1} L${needle_2},${h-pad} M${needle_2},${needle_3} L${w-pad},${needle_3} M${needle_4},${needle_3} L${needle_4},${h-pad} `;
    return second_needle ? `M${needle_2},${pad} L ${needle_2},${needle_1}` : `${path}`;
  }
}

Date.prototype.clock = function()
{
  return new Clock();
}
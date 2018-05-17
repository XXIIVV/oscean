function Clock()
{
  var clock = this;
  
  this.radius = 90;
  this.circ = this.radius * 2 * Math.PI;
  this.center = 105;
  this.el = document.getElementById("clock");

  this.size = {width:window.innerWidth,height:window.innerHeight,ratio:2};

  this.style = {padding:100,font_size:20,stroke_width:1.5};

  this.start = function()
  {
    clock.update();
  }

  this.time = function()
  {
    var d = new Date(), e = new Date(d);
    var msSinceMidnight = e - d.setHours(0,0,0,0);
    var val = (msSinceMidnight/864)/100;
    var format = val.toFixed(3).padStart(7,"0").replace(".",":")
    return format
  }

  this.update = function()
  {
    this.el.innerHTML = `<svg width="${w}" height="${h}"><path d="${this.path()}"></path></svg>`;

    setTimeout(function(){ clock.update(); }, 864.0);
  }

  this.toString = function()
  {
    return this.time();
  }

  this.path = function(w,h,second_needle = false)
  {
    var t        = this.time().replace(":","");
    var pad      = 0;
    var needle_1 = parseInt(((t/1000000) % 1) * (h - (pad*2))) + pad;
    var needle_2 = parseInt(((t/100000) % 1) * (w - (pad*2))) + pad;
    var needle_3 = needle_1 + parseInt(((t/10000) % 1) * (h - pad - needle_1));
    var needle_4 = needle_2 + parseInt(((t/1000) % 1) * (w - pad - needle_2));
    var needle_5 = needle_3 + parseInt(((t/100) % 1) * (h - pad - needle_3));
    var needle_6 = needle_4 + parseInt(((t/10) % 1) * (w - pad - needle_4));
    var path = `M${pad},${needle_1} L${w-pad},${needle_1} M${needle_2},${needle_1} L${needle_2},${h-pad} M${needle_2},${needle_3} L${w-pad},${needle_3} M${needle_4},${needle_3} L${needle_4},${h-pad} `;
    return second_needle ? `M${needle_2},${pad} L ${needle_2},${needle_1}` : `${path}`;
  }

  this.svg = function(w,h)
  {
    return `<svg width="${w}" height="${h}"><path d="${this.path(w,h)}"></path></svg>`;
  }
}

Date.prototype.clock = function()
{
  return new Clock();
}
function Clock()
{
  var clock = this;
  
  this.radius = 90;
  this.circ = this.radius * 2 * Math.PI;
  this.center = 105;
  this.el = document.getElementById("clock");

  this.start = function()
  {
    clock.update();
  }

  this.time = function()
  {
    var d = new Date(), e = new Date(d);
    var msSinceMidnight = e - d.setHours(0,0,0,0);
    var val = (msSinceMidnight/864) * 10;
    return parseInt(val);
  }

  this.update = function()
  {
    this.redraw_app();

    setTimeout(function(){ clock.update(); }, 864.0);
  }

  this.formatted = function()
  {
    var t = this.time().toString();
    return t.substr(0,3)+":"+t.substr(3,3);
  }

  this.redraw_app = function()
  {
    var t        = this.time();
    var t_s      = new String(t);
    var t_a      = [t_s.substr(0,3),t_s.substr(3,3)];
    var w        = 30;
    var h        = 30;
    var needle_1 = parseInt(((t/1000000) % 1) * w);
    var needle_2 = parseInt(((t/100000) % 1) * h);
    var needle_3 = needle_1 + parseInt(((t/10000) % 1) * (w - needle_1));
    var needle_4 = needle_2 + parseInt(((t/10000) % 1) * (h - needle_2));
    var needle_5 = needle_3 + parseInt(((t/1000) % 1) * (w - needle_3));
    var needle_6 = needle_4 + parseInt(((t/100) % 1) * (h - needle_4));

    var path = "";
    path += "M"+needle_1+","+0+" L"+needle_1+","+h+" ";
    path += "M"+needle_1+","+needle_2+" L"+w+","+needle_2+" ";
    path += "M"+needle_3+","+needle_2+" L"+needle_3+","+h+" ";
    path += "M"+needle_3+","+needle_4+" L"+w+","+needle_4+" ";
    path += "M"+needle_5+","+needle_4+" L"+needle_5+","+h+" ";
    path += "M"+needle_5+","+needle_6+" L"+w+","+needle_6+" ";

    // Outline
    path += "M0.5,0.5 L"+(w-0.5)+",0.5 ";
    path += "L0.5,0.5 L0.5,"+(h-0.5)+" ";
    path += "L"+(w-0.5)+","+(h-0.5)+" L0.5,"+(h-0.5)+" ";
    path += "L"+(w-1)+","+(h-0.5)+" L"+(w-1)+",0.5 Z";

    this.el.innerHTML = '<svg width="'+w+'" height="'+h+'" style="fill:none; stroke-width:1; stroke-linecap:butt; stroke:white"><path class="fh" d="'+path+'"></path></svg>';
  }
}

invoke.seal("core","clock");

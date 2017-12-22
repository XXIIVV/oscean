function Console()
{
  document.body.appendChild(this.el = document.createElement('console'));
  this.wr_el = document.createElement('wr')
  this.el.appendChild(this.wr_el)

  this.queue = [];

  this.wr_el.innerHTML += `<style>
  console { color: white;position: fixed;z-index: 9999;background:#000;display: block;width: 100%;padding:0px 20px;font-size:11px;font-family: 'input_mono_regular'; width:calc(100vw - 40px); top:0px; max-height:300px; overflow:hidden; overflow-y:scroll; transition: height 150ms; }
  console.show { height:100vh}
  console.hide { height:0px; overflow-y:hidden}
  console wr { padding:10px 0px}
  console wr ln { display:block; line-height:15px}
  console wr ln.line { border-bottom:1px solid #333; margin-bottom:5px; padding-bottom:5px}
  console wr ln b { font-family:'input_mono_medium'; font-weight:normal}
  console wr ln span.prefix { color:#999; font-style:normal; display:inline-block;}
  console wr ln span.type { color:#999; font-style:normal; display:inline-block;}
  console wr ln span.time { color:#999; font-style:normal; float:right}
  console wr ln.warn span.prefix { color: #ffbf05}
  </style>`

  this.log = function(prefix,type,message = "..", line = false)
  {
    this.queue.push(`<ln class='${prefix} ${line ? "line" : ""}'><span class='prefix'>${prefix.substr(0,4)}</span> <span class='type'>${type}</span> ${message}<span class='time'>${invoke.clock.formatted()}</span></ln>`)
    this.update()
  }

  this.warn = function(source,message)
  {
    this.log("warn",source,message)
  }

  this.toggle = function()
  {
    invoke.console.el.className = invoke.console.el.className == "show" ? "hide" : "show";
    invoke.console.scroll();
  }

  this.hide = function()
  {
    this.el.className = "hide";
  }

  this.scroll = function()
  {
    this.el.scrollTop = this.el.scrollHeight;
  }

  this.update = function()
  {
    if(this.queue.length < 1){ return; }
    this.wr_el.innerHTML += this.queue[0];
    this.queue.splice(0,1);
    this.scroll();
  }

  this.log("core","console","starting..");
  invoke.keyboard.add_event("`",this.toggle);
}

invoke.seal("core","console");
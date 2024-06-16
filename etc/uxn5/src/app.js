'use strict'

let isEmbed = window.self !== window.top;

const emulator = new Emu()

if (!isEmbed) {
	document.body.className = "";
}

emulator.bgCanvas = document.getElementById("bgcanvas");
emulator.fgCanvas = document.getElementById("fgcanvas");
emulator.screen.bgctx = emulator.bgCanvas.getContext("2d", {"willReadFrequently": true})
emulator.screen.fgctx = emulator.fgCanvas.getContext("2d", {"willReadFrequently": true})
emulator.screen.init()

const share = new ShareView(document.getElementById("share"));
const target_fps = 60;

emulator.init().then(() => {
  emulator.console.write_el = document.getElementById("console_std")
  emulator.console.error_el = document.getElementById("console_err")
  document.getElementById("screen").addEventListener("pointermove", emulator.pointer_moved)
  document.getElementById("screen").addEventListener("pointerdown", emulator.pointer_down)
  document.getElementById("screen").addEventListener("pointerup", emulator.pointer_up)
  window.addEventListener("keydown", emulator.controller.keyevent);
  window.addEventListener("keyup", emulator.controller.keyevent);

  // Console Input Field
  const console_input = document.getElementById("console_input")
  console_input.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      let query = console_input.value
      for (let i = 0; i < query.length; i++)
        emulator.console.input(query.charAt(i).charCodeAt(0), 1)
      emulator.console.input(0x0a, 1)
      console_input.value = ""
    }
  });

  // Animation callback
  function step() {
    emulator.screen_callback();
  }

  setInterval(() => {
    window.requestAnimationFrame(step);
  }, 1000 / target_fps);

  if(!isEmbed) {
    // Support dropping files
    const target = document.body
    target.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
    target.addEventListener("drop", (ev) => {
      ev.preventDefault();
      let file = ev.dataTransfer.files[0], reader = new FileReader()
      reader.onload = function (event) {
        let rom = new Uint8Array(event.target.result)
		emulator.screen.init()
        loadROM(rom);
      };
      reader.readAsArrayBuffer(file)
    });
      
    document.getElementById("browser").addEventListener("change", function(event) {
        let file = event.target.files[0], reader = new FileReader()
      reader.onload = function (event) {
        let rom = new Uint8Array(event.target.result)
        emulator.screen.init()
        loadROM(rom);
      };
      reader.readAsArrayBuffer(file)
    });
  }

  const m = window.location.hash.match(/r(om)?=([^&]+)/);
  if (m) {
    let rom = b64decode(m[2]);
    if (!m[1]) {
      rom = decodeUlz(rom);
    }
    loadROM(rom);
  }
  document.title = "Varvara Emulator";
});

function loadROM(rom) {
  emulator.bgCanvas.style.width = ''
  emulator.set_zoom(1)
  emulator.uxn.load(rom).eval(0x0100);
  share.setROM(rom);
}

function toggle_zoom() {
	emulator.toggle_zoom()
}

////////////////////////////////////////////////////////////////////////////////
// Sharing
////////////////////////////////////////////////////////////////////////////////

function ShareView(el) {
  let rom;

  async function toggleSharePopup() {
    if (popupEl.style.display === "none") {
      popupEl.style.display = "block";
      inputEl.value = "...";
      copyButtonEl.disabled = true;
      const hash = "#r=" + await b64encode(encodeUlz(rom));
      inputEl.value = `${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}${hash}`;
      copyButtonEl.disabled = false;
    } else {
      popupEl.style.display = "none";
    }
  }

  const shareButtonEl = document.createElement("button");
  shareButtonEl.disabled = true;
  shareButtonEl.innerHTML = `Share`
  shareButtonEl.addEventListener("click", (ev) => {
    ev.preventDefault();
    toggleSharePopup();
  });
  el.appendChild(shareButtonEl);

  const popupEl = document.createElement("div");
  popupEl.style.display = "none";
  popupEl.className = "share-popup";
  el.appendChild(popupEl);

  const inputEl = document.createElement("input");
  inputEl.readOnly = true;
  popupEl.appendChild(inputEl);
  const copyButtonEl = document.createElement("button");
  copyButtonEl.addEventListener("click", async (ev) => {
    ev.preventDefault();
    await navigator.clipboard.writeText(inputEl.value);
    toggleSharePopup();
  });
  copyButtonEl.innerHTML = `Copy`
  popupEl.appendChild(copyButtonEl);

  this.setROM = (v) => {
    rom = v;
    shareButtonEl.disabled = false;
    popupEl.style.display = "none";
	document.getElementById("share").style.display = "initial"
  }
}

async function b64encode(bs) {
  const url = await new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = () => { resolve(reader.result); }
    reader.readAsDataURL(new Blob([bs]))
  });
  return url.slice(url.indexOf(',') + 1).replace(/\//g, '_').replace(/\+/g, '-').replace(/=+$/, '');
}

function b64decode(s) {
  if (s.length % 4 != 0){
    s += ('===').slice(0, 4 - (s.length % 4));
  }
  return new Uint8Array([...atob(s.replace(/_/g, '/').replace(/-/g, '+'))].map(c=>c.charCodeAt()));
}

function decodeUlz(src) {
  const dst = [];
  let sp = 0;
  while (sp < src.length) {
    const c = src[sp++];
    if (c & 0x80) {
      // CPY
      let length;
      if (c & 0x40) {
        if (sp >= src.length) {
          throw new Error(`incomplete CPY2`);
        }
        length = ((c & 0x3f) << 8) | src[sp++];
      } else {
        length = c & 0x3f;
      }
      if (sp >= src.length) {
        throw new Error(`incomplete CPY`);
      }
      let cp = dst.length - (src[sp++] + 1);
      if (cp < 0) {
        throw new Error(`CPY underflow`);
      }
      for (let i = 0; i < length + 4; i++) {
        dst.push(dst[cp++]);
      }
    } else {
      // LIT
      if (sp + c >= src.length) {
        throw new Error(`LIT out of bounds: ${sp} + ${c} >= ${src.length}`);
      }
      for (let i = 0; i < c + 1; i++) {
        dst.push(src[sp++]);
      }
    }
  }
  return new Uint8Array(dst);
}

const MIN_MAX_LENGTH = 4;

function findBestMatch(src, sp, dlen, slen) {
  let bmlen = 0;
  let bmp = 0;
  let dp = sp - dlen;
  for (; dlen; dp++, dlen--) {
    let i = 0;
    for (; ; i++) {
      if (i == slen) {
        return [dp, i];
      }
      if (src[sp + i] != src[dp + (i % dlen)]) {
        break;
      }
    }
    if (i > bmlen) {
      bmlen = i;
      bmp = dp;
    }
  }
  return [bmp, bmlen];
}

function encodeUlz(src) {
  let dst = [];
  let sp = 0;
  let litp = -1;
  while (sp < src.length) {
    const dlen = Math.min(sp, 256);
    const slen = Math.min(src.length - sp, 0x3fff + MIN_MAX_LENGTH);
    const [bmp, bmlen] = findBestMatch(src, sp, dlen, slen);
    if (bmlen >= MIN_MAX_LENGTH) {
      // CPY
      const bmctl = bmlen - MIN_MAX_LENGTH;
      if (bmctl > 0x3f) {
        // 	CPY2
        dst.push((bmctl >> 8) | 0xc0);
        dst.push(bmctl & 0xff);
      } else {
        dst.push(bmctl | 0x80);
      }
      dst.push(sp - bmp - 1);
      sp += bmlen;
      litp = -1;
    } else {
      // LIT
      if (litp >= 0) {
        if ((dst[litp] += 1) == 127) {
          litp = -1;
        }
      } else {
        dst.push(0);
        litp = dst.length - 1;
      }
      dst.push(src[sp++]);
    }
  }
  return new Uint8Array(dst);
}
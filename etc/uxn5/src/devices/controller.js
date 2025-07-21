'use strict'

function Controller(emu)
{
	this.state = 0

	this.init = () => {
		if(keyctrl){
			window.addEventListener("keydown", emu.controller.on_button)
			window.addEventListener("keyup", emu.controller.on_button)
		}
		else {
			window.addEventListener("keydown", emu.controller.on_keybutton)
			window.addEventListener("keyup", emu.controller.on_keybutton)
		}
	}

	this.on_button = (event) => {
		let mask = 0;
		console.log(event.keyCode)
		switch (event.keyCode) {
		case 90: // Z Control
		case 49: // 1 Control
			mask = 0x01; break;
		case 88: // X Alt
		case 50: // 2 Alt
			mask = 0x02; break;
		case 67: // C Shift
		case 51: // 3 Shift
			mask = 0x04; break;
		case 86: // V Escape
		case 52: // 4 Escape
			mask = 0x08; break;
		case 38: // Up
			mask = 0x10; break;
		case 40: // Down
			mask = 0x20; break;
		case 37: // Left
			mask = 0x40; break;
		case 39: // Right
			mask = 0x80; break;
		}
		if (event.type == "keydown") 
			this.state |= mask;
		else
			this.state &= ~mask;
		emu.uxn.dev[0x82] = this.state;
		if(mask || event.type == "keydown")
			emu.uxn.eval(peek16(emu.uxn.dev, 0x80))
		if(document.activeElement != emu.console.input_el)
			event.preventDefault();
	}

	this.on_keybutton = (event) => {
		let mask = 0;
		switch (event.keyCode) {
		case 17: // Control
			mask = 0x01;
			break;
		case 18: // Alt
			mask = 0x02;
			break;
		case 16: // Shift
			mask = 0x04;
			break;
		case 27: // Escape
			mask = 0x08;
			break;
		case 38: // Up
			mask = 0x10;
			break;
		case 40: // Down
			mask = 0x20;
			break;
		case 37: // Left
			mask = 0x40;
			break;
		case 39: // Right
			mask = 0x80;
			break;
		}
		let charCode = 0;
		if (event.type == "keydown") {
			this.state |= mask;
			if (event.key.length == 1) {
				charCode = event.key.charCodeAt(0);
			} else if (mask == 0 && event.keyCode < 20) {
				charCode = event.keyCode;
			}
			emu.uxn.dev[0x83] = charCode;
		} else
			this.state &= ~mask;
		emu.uxn.dev[0x82] = this.state;
		if(mask || event.type == "keydown")
			emu.uxn.eval(peek16(emu.uxn.dev, 0x80))
		if(event.type == "keydown")
			emu.uxn.dev[0x83] = 0;
		if(document.activeElement != emu.console.input_el)
			event.preventDefault();
	}
}

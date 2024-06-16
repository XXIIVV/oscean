'use strict'

function Controller(emu) {
	this.keys = 0
	this.keyevent = (event) => {
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
				this.keys |= mask;
			if (event.key.length == 1) {
				charCode = event.key.charCodeAt(0);
			} else if (mask == 0 && event.keyCode < 20) {
				charCode = event.keyCode;
			}
			emu.uxn.dev[0x83] = charCode;
		} else {
			this.keys &= ~mask;
		}
		event.preventDefault();
		emu.uxn.dev[0x82] = this.keys;
		emu.uxn.eval(peek16(emu.uxn.dev, 0x80))
	}
}

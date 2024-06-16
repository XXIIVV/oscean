'use strict'

function Console(emu)
{
	this.write_el = null
	this.error_el = null

	this.write = (char) => {
		this.write_el.innerHTML += String.fromCharCode(char)
	}

	this.error = (char) => {
		this.error_el.innerHTML += String.fromCharCode(char)
	}

	this.input = (char, type) => {
		// Get vector
		let vec = peek16(emu.uxn.dev, 0x10)
		// Set char
		emu.uxn.dev[0x12] = char
		// Set type
		emu.uxn.dev[0x17] = type
		if(vec)
			emu.uxn.eval(vec)
	}
}

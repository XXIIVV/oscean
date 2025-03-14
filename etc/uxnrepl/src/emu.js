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
		emu.uxn.dev[0x17] = type
		emu.uxn.dev[0x12] = char
		emu.uxn.eval(emu.uxn.dev[0x10] << 8 | emu.uxn.dev[0x11])
	}
}

function Emu ()
{
	this.uxn = new Uxn(this)
	this.console = new Console(this)

	this.dei = (port) => {
		return this.uxn.dev[port]
	}

	this.deo = (port, val) => {
		this.uxn.dev[port] = val
		if(port == 0x00 || port == 0x01) {
			console.log("Set system vector")
		} else if(port == 0x0e) {
			console.log(this)
		} else if(port == 0x0f) {
			console.log("Program ended.")
		} else if(port == 0x10 || port == 0x11) {
			console.log("Set console vector")
		} else if(port == 0x18) {
			this.console.write(val)
		} else if(port == 0x19) {
			this.console.error(val)
		} else {
			console.log("Unknown deo", port, val)
		}
	}
}

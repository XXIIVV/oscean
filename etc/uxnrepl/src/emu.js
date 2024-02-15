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

	this.input = (char) => {
		emu.uxn.dev[0x12] = char
		emu.uxn.eval(emu.uxn.dev[0x10] << 8 | emu.uxn.dev[0x11])
	}
}

function Emu ()
{
	this.uxn = new Uxn(this)
	this.console = new Console(this)

	this.debugger = () => {
		if(!this.uxn.wst.ptr())
			console.log("Stack is clean")
		// Stack
		let buf = ""
		for (let i = 0; i < this.uxn.wst.ptr(); i++) {
			buf += this.uxn.wst.get(i).toString(16)+" "
		}
		console.warn(buf)
	}

	this.dei = (port) => {
		return this.uxn.dev[port]
	}

	this.deo = (port, val) => {
		this.uxn.dev[port] = val
		if(port == 0x10 || port == 0x11) {
			console.log("Set console vector")
		}
		else if(port == 0x00 || port == 0x01) {
			console.log("Set system vector")
		}
		else if(port == 0x02) {
			this.uxn.wst.addr = val ? val * 0x100 : 0x10000
		}
		else if(port == 0x18) {
			this.console.write(val)
		}
		else if(port == 0x19) {
			this.console.error(val)
		}
		else if(port == 0x0f) {
			console.warn("Program ended.")
		}
		else {
			console.log("Unknown deo", port, val)
		}
	}
}

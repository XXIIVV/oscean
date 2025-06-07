'use strict'

function System(emu)
{
	this.vector = 0
	this.meta = 0

	this.dei = (port) => {
		if(port == 0x04)
			return emu.uxn.wst.ptr
		else if(port == 0x05)
			return emu.uxn.rst.ptr
		else
			return emu.uxn.dev[port]
	}

	this.deo = (port, val) => {
		if(port == 0x00 || port == 0x01)
			this.vector = (emu.uxn.dev[0x00] << 8) | emu.uxn.dev[0x01]
		else if(port == 0x06 || port == 0x07)
			this.meta = (emu.uxn.dev[0x06] << 8) | emu.uxn.dev[0x07]
		else if(port == 0x0e)
			emu.console.write_string(`${emu.uxn.wst.print()}\n${emu.uxn.rst.print()}`)
		else if(port == 0x0f)
			console.log("Evaluation ended.")
		else
			console.log("Unknown system port", port, val)
	}
}

function Console(emu)
{
	this.vector = 0
	this.stdout_body = ""
	this.stderr_body = ""

	this.write = (char) => {
		this.stdout_body += String.fromCharCode(char)
	}

	this.write_string = (s) => {
		this.stdout_body += s
	}

	this.error = (char) => {
		this.stderr_body += String.fromCharCode(char)
	}

	this.input = (char, type) => {
		emu.uxn.dev[0x17] = type
		emu.uxn.dev[0x12] = char
		emu.uxn.eval(this.vector)
	}

	this.deo = (port, val) => {
		if(port == 0x10 || port == 0x11)
			this.vector = (emu.uxn.dev[0x10] << 8) | emu.uxn.dev[0x11]
		else if(port == 0x18)
			this.write(val)
		else if(port == 0x19)
			this.error(val)
		else
			console.log("Unknown console port", port, val)
	}
}

function Emu ()
{
	this.uxn = new Uxn(this)
	this.system = new System(this)
	this.console = new Console(this)

	this.dei = (port) => {
		if(port >> 4 == 0)
			return this.system.dei(port);
		return this.uxn.dev[port]
	}

	this.deo = (port, val) => {
		this.uxn.dev[port] = val
		switch(port >> 4){
			case 0: this.system.deo(port, val); break;
			case 1: this.console.deo(port, val); break;
		}
	}
}

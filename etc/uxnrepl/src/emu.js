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

function DateTime(emu)
{
	this.dei = (port) => {
		const now = new Date();
		switch (port) {
			case 0xc0: return now.getFullYear() >> 8;
			case 0xc1: return now.getFullYear() & 0xff;
			case 0xc2: return now.getMonth();
			case 0xc3: return now.getDate();
			case 0xc4: return now.getHours();
			case 0xc5: return now.getMinutes();
			case 0xc6: return now.getSeconds();
			case 0xc8: return doty() >> 8;
			case 0xc9: return doty() & 0xff;
		}
		return 1;
	}

	function doty() {
		let now = new Date()
		let start = new Date(now.getFullYear(), 0, 0)
		let diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000)
		let oneDay = 1000 * 60 * 60 * 24
		return Math.floor(diff / oneDay) - 1
	}
}


function Emu ()
{
	this.uxn = new Uxn(this)
	this.system = new System(this)
	this.console = new Console(this)
	this.datetime = new DateTime(this)

	this.dei = (port) => {
		if(port >> 4 == 0x0)
			return this.system.dei(port);
		if(port >> 4 == 0xc)
			return this.datetime.dei(port);
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

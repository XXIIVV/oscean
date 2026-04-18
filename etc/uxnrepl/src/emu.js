'use strict'

function System(emu)
{
	this.vector = 0
	this.meta = 0

	function print_stack(id) {
		let ptr = emu.uxn.get_ptr(id)
		let stk = emu.uxn.get_stk(id)
		let res = `${id ? 'RST' : 'WST'}${ptr - 8 ? ' ' : '|'}`
		for(let i = ptr - 8; i != ptr; i++) {
			res += ('0' + stk[i & 0xff].toString(16)).slice(-2)
			res += ((i + 1) & 0xff) ? ' ' : '|'
		}
		return res;
	}

	this.print_wst = () => {
		return print_stack(0);
	}

	this.print_rst = () => {
		return print_stack(1);
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

	this.error_string = (s) => {
		this.stderr_body += s
	}

	this.error_byte = (b) => {
		this.stderr_body += b.toString(16)
	}

	this.input = (char, type) => {
		emu.uxn.dev[0x17] = type
		emu.uxn.dev[0x12] = char
		emu.uxn.eval(this.vector)
	}
}

function Emu ()
{
	this.uxn = new Uxn(this)
	this.system = new System(this)
	this.console = new Console(this)
	this.date = new Date()

	function doty(now) {
		let start = new Date(now.getFullYear(), 0, 0)
		let diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000)
		let oneDay = 1000 * 60 * 60 * 24
		return Math.floor(diff / oneDay) - 1
	}

	this.dei = (port) => {
		switch (port) {
		case 0xc0: { return new Date().getFullYear() >> 8; }
		case 0xc1: { return new Date().getFullYear() & 0xff; }
		case 0xc2: { return new Date().getMonth(); }
		case 0xc3: { return new Date().getDate(); }
		case 0xc4: { return new Date().getHours(); }
		case 0xc5: { return new Date().getMinutes(); }
		case 0xc6: { return new Date().getSeconds(); }
		case 0xc7: { return new Date().getDay(); }
		case 0xc8: { return doty(new Date()) >> 8; }
		case 0xc9: { return doty(new Date()) & 0xff; }
		}
		return this.uxn.dev[port]
	}

	this.deo = (port, val) => {
		this.uxn.dev[port] = val
		switch(port){
		/* System */
		case 0x00:
		case 0x01: this.system.vector = (this.uxn.dev[0x00] << 8) | this.uxn.dev[0x01]; break;
		case 0x06:
		case 0x07: this.system.meta = (this.uxn.dev[0x06] << 8) | this.uxn.dev[0x07]; break;
		case 0x0e: this.console.write_string(`${this.system.print_wst()}\n${this.system.print_rst()}`); break;
		case 0x0f: console.log("Evaluation ended."); break;
		/* Console */
		case 0x10:
		case 0x11: this.console.vector = (this.uxn.dev[0x10] << 8) | this.uxn.dev[0x11]; break;
		case 0x18: this.console.write(val); break;
		case 0x19: this.console.error(val); break;
		case 0x1a: this.console.error_byte(val); break;
		case 0x1b: this.console.error_byte(val); break;
		}
	}
}

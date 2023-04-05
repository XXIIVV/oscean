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
		// Get vector
		let vec = emu.uxn.peek16(emu.uxn.dev + 0x10)
		// Set char
		emu.uxn.poke8(emu.uxn.dev + 0x12, char)
		if(!vec)
			console.warn("No console vector")
		emu.uxn.eval(vec)
	}
}

function Emu ()
{
	this.debug = 0
	this.uxn = new Uxn(this)
	this.console = new Console(this)

	let opcodes = [
		"LIT", "INC", "POP", "NIP", "SWP", "ROT", "DUP", "OVR",
		"EQU", "NEQ", "GTH", "LTH", "JMP", "JCN", "JSR", "STH",
		"LDZ", "STZ", "LDR", "STR", "LDA", "STA", "DEI", "DEO",
		"ADD", "SUB", "MUL", "DIV", "AND", "ORA", "EOR", "SFT",
		"BRK"]

	function getname(byte) {
		let m2 = !!(byte & 0x20) ? "2" : ""
		let mr = !!(byte & 0x40) ? "r" : ""
		let mk = !!(byte & 0x80) ? "k" : ""
		return opcodes[byte & 0x1f] + m2 + mk + mr
	}

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

	this.onStep = (pc, instr) => {
		if(this.debug)
			console.log(getname(instr), pc)
	}

	this.dei = (port) => {
		return this.uxn.getdev(port)
	}

	this.deo = (port, val) => {
		this.uxn.setdev(port, val)
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

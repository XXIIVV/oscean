'use strict'

function Console(emu)
{
	this.write_el = null
	this.error_el = null

	this.init = () => {
		this.input_el = document.getElementById("console_input")
		this.write_el = document.getElementById("console_std")
		this.error_el = document.getElementById("console_err")
		this.input_el.addEventListener("keyup", this.on_console);
	}

	this.on_console = (event) => {
		if (event.key === "Enter") {
			let query = this.input_el.value
			for (let i = 0; i < query.length; i++)
				this.input(query.charAt(i).charCodeAt(0), 1)
			this.input(0x0a, 1)
			this.input_el.value = ""
		}
	}

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
		if(vec) emu.uxn.eval(vec)
	}
	
	this.deo = (addr) => {
		switch(addr) {
			case 0x18: this.console.write(emu.uxn.dev[0x18]); break;
			case 0x19: this.console.error(emu.uxn.dev[0x19]); break;
		}
	}
}

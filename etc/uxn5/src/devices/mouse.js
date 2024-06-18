'use strict'

function Mouse(emu) {
	this.down = (state) => {
		emu.uxn.dev[0x96] = state
		emu.uxn.eval(peek16(emu.uxn.dev, 0x90))
	}

	this.up = (state) => {
		emu.uxn.dev[0x96] = state
		emu.uxn.eval(peek16(emu.uxn.dev, 0x90))
	}

	this.move = (x, y) => {
		poke16(emu.uxn.dev, 0x92, x)
		poke16(emu.uxn.dev, 0x94, y)
		emu.uxn.eval(peek16(emu.uxn.dev, 0x90))
	}

	this.on_move = (event) => {
		const bounds = emu.screen.bgCanvas.getBoundingClientRect()
		const x = emu.screen.bgCanvas.width * (event.clientX - bounds.left) / bounds.width
		const y = emu.screen.bgCanvas.height * (event.clientY - bounds.top) / bounds.height
		this.move(x, y)
		event.preventDefault()
	}

	this.on_down = (event) => {
		this.on_move(event)
		this.down(event.buttons)
		event.preventDefault()
	}

	this.on_up = (event) => {
		this.up(event.buttons)
		event.preventDefault();
	}
}

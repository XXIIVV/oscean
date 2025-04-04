'use strict'

function Mouse(emu)
{
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
		const bounds = emu.screen.display.getBoundingClientRect()
		const x = emu.screen.display.width * (event.clientX - bounds.left) / bounds.width
		const y = emu.screen.display.height * (event.clientY - bounds.top) / bounds.height
		this.move(x, y)
	}

	this.on_down = (event) => {
		this.on_move(event)
		this.down(event.buttons)
		// event.preventDefault()
	}

	this.on_up = (event) => {
		this.up(event.buttons)
		// event.preventDefault();
	}

	this.on_scroll = (event) => {
		if(event.wheelDelta > 0)
			poke16(emu.uxn.dev, 0x9c, 0xffff)
		else
			poke16(emu.uxn.dev, 0x9c, 0x0001)
		emu.uxn.eval(peek16(emu.uxn.dev, 0x90))
		poke16(emu.uxn.dev, 0x9c, 0x0000)
		// event.preventDefault();
	}
}

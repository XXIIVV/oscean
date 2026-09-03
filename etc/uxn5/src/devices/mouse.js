'use strict'

function Mouse(emu)
{
	function parse_buttons(buttons) {
		let state = 0
		if(buttons & 0x1) state |= 0x1
		if(buttons & 0x2) state |= 0x4
		if(buttons & 0x4) state |= 0x2
		return state
	}
	
	function mouse_down(state) {
		emu.uxn.dev[0x96] = state
		emu.uxn.eval(peek16(emu.uxn.dev, 0x90))
	}

	function mouse_up(state) {
		emu.uxn.dev[0x96] = state
		emu.uxn.eval(peek16(emu.uxn.dev, 0x90))
	}

	function mouse_move(x, y) {
		poke16(emu.uxn.dev, 0x92, x)
		poke16(emu.uxn.dev, 0x94, y)
		emu.uxn.eval(peek16(emu.uxn.dev, 0x90))
	}

	this.on_move = (event) => {
		const bounds = emu.screen.display.getBoundingClientRect()
		const x = emu.screen.display.width * (event.clientX - bounds.left) / bounds.width
		const y = emu.screen.display.height * (event.clientY - bounds.top) / bounds.height
		mouse_move(x, y)
	}

	this.on_down = (event) => {
		mouse_down(parse_buttons(event.buttons))
	}

	this.on_up = (event) => {
		mouse_up(parse_buttons(event.buttons))
	}

	this.on_scroll = (event) => {
		if(event.wheelDelta > 0)
			poke16(emu.uxn.dev, 0x9c, 0xffff)
		else
			poke16(emu.uxn.dev, 0x9c, 0x0001)
		emu.uxn.eval(peek16(emu.uxn.dev, 0x90))
		poke16(emu.uxn.dev, 0x9c, 0x0000)
	}
}

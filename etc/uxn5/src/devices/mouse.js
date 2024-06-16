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
}

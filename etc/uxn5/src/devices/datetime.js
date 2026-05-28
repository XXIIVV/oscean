'use strict'

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
			// TODO dst
			// case 0xca https://stackoverflow.com/a/56429156
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

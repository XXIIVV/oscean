'use strict'

function System(emu)
{
	this.expansion = (addr) => {
		let operation = emu.uxn.ram[addr]
		let length = peek16(emu.uxn.ram, addr + 1);
		// fill
		if(operation == 0){
			let dst_page = peek16(emu.uxn.ram, addr + 3);
			let dst_addr = peek16(emu.uxn.ram, addr + 5);
			let value = emu.uxn.ram[addr + 7];
			let dst = dst_page * 0x10000;
			for(let i = 0; i < length; i++)
				emu.uxn.ram[dst + ((dst_addr + i) & 0xffff)] = value;
		}
		// cpyl
		else if(operation == 1){
			let a = peek16(emu.uxn.ram, addr + 3) * 0x10000 + peek16(emu.uxn.ram, addr + 5);
			let b = a + length;
			let c = peek16(emu.uxn.ram, addr + 7) * 0x10000 + peek16(emu.uxn.ram, addr + 9);
			for(; a < b; emu.uxn.ram[c++] = emu.uxn.ram[a++]);
		}
		// cpyr
		else if(operation == 2){
			let src_page = peek16(emu.uxn.ram, addr + 3);
			let src_addr = peek16(emu.uxn.ram, addr + 5);
			let dst_page = peek16(emu.uxn.ram, addr + 7);
			let dst_addr = peek16(emu.uxn.ram, addr + 9);
			let src = src_page * 0x10000;
			let dst = dst_page * 0x10000;
			for(let i = length - 1; i != -1; i--)
				emu.uxn.ram[dst + ((dst_addr + i) & 0xffff)] = emu.uxn.ram[src + ((src_addr + i) & 0xffff)];
		}
	}

	this.metadata = (address) => {
		let str = ""
		if(!emu.uxn.ram[address++]) {
			while(emu.uxn.ram[address]){
				let byte = emu.uxn.ram[address++]
				str += byte == 0xa ? "<br />" : String.fromCharCode(byte);
			}
			document.getElementById("metarom").innerHTML = str
		}
	}
	this.deo = (addr) => {
		switch(addr) {
			case 0x07: this.metadata(peek16(emu.uxn.dev, 0x06)); break;
			case 0x03: this.expansion(peek16(emu.uxn.dev, 0x02)); break;
			case 0x08:
			case 0x09:
			case 0x0a:
			case 0x0b:
			case 0x0c:
			case 0x0d: emu.screen.update_palette(); emu.screen.update_palette(); break;
			case 0x0f: console.warn("Program ended."); break;
		}
	}
}

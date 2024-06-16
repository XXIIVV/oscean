'use strict'

function System(emu)
{
	this.expansion = (addr) => {
		let operation = emu.uxn.ram[addr]
		// fill
		if(operation == 0){
			let length = peek16(emu.uxn.ram, addr + 1);
			let dst_page = peek16(emu.uxn.ram, addr + 3);
			let dst_addr = peek16(emu.uxn.ram, addr + 5);
			let value = emu.uxn.ram[addr + 7];
			let dst = dst_page * 0x10000;
			for(let i = 0; i < length; i++)
				emu.uxn.ram[dst + ((dst_addr + i) & 0xffff)] = value;
		}
		// cpyl
		else if(operation == 1){
			let length = peek16(emu.uxn.ram, addr + 1);
			let src_page = peek16(emu.uxn.ram, addr + 3);
			let src_addr = peek16(emu.uxn.ram, addr + 5);
			let dst_page = peek16(emu.uxn.ram, addr + 7);
			let dst_addr = peek16(emu.uxn.ram, addr + 9);
			let src = src_page * 0x10000;
			let dst = dst_page * 0x10000;
			for(let i = 0; i < length; i++)
				emu.uxn.ram[dst + ((dst_addr + i) & 0xffff)] = emu.uxn.ram[src + ((src_addr + i) & 0xffff)];
		}
		// cpyr
		else if(operation == 2){
			let length = peek16(emu.uxn.ram, addr + 1);
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
		/* body */ address++;
		while(emu.uxn.ram[address]){
			str += String.fromCharCode(emu.uxn.ram[address++]);
		}
		console.log(str)
	}
}

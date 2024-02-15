'use strict'

function Stack(u, addr)
{
	this.addr = addr
	this.ptr = 0
	this.ptrk = 0

	this.get = (index) => {
		return u.ram[this.addr + index]
	}

	this.inc = () => {
		return this.ptr++
	}

	this.dec = () => {
		return u.rk ? --this.ptrk : --this.ptr
	}

	this.pop8 = () => {
		return this.ptr == 0x00 ? u.halt(1) : u.ram[this.addr + (u.rk ? --this.ptrk : --this.ptr)]
	}

	this.push8 = (val) => {
		if(this.ptr == 0xff)
			return u.halt(2)
		u.ram[this.addr + this.ptr++] = val
	}

	this.pop16 = () => {
		return this.pop8() + (this.pop8() << 8)
	}

	this.push16 = (val) => {
		this.push8(val >> 0x08)
		this.push8(val & 0xff)
	}
}

function Uxn (emu)
{
	this.ram = new Uint8Array(0x13000)
	this.wst = new Stack(this, 0x10000)
	this.rst = new Stack(this, 0x11000)
	this.dev = 0x12000

	this.getdev = (port) => { return this.ram[this.dev + port] }
	this.setdev = (port, val) => { this.ram[this.dev + port] = val }

	this.pop = () => {
		return this.r2 ? this.src.pop16() : this.src.pop8()
	}

	this.push8 = (x) => {
		this.src.push8(x)
	}

	this.push16 = (x) => {
		this.src.push16(x)
	}

	this.push = (val) => {
		if(this.r2)
			this.push16(val)
		else
			this.push8(val)
	}

	this.peek8 = (addr) => {
		return this.ram[addr]
	}

	this.peek16 = (addr) => {
		return (this.ram[addr] << 8) + this.ram[addr + 1]
	}

	this.peek = (addr) => {
		return this.r2 ? this.peek16(addr) : this.ram[addr]
	}

	this.poke8 = (addr, val) => {
		this.ram[addr] = val
	}

	this.poke = (addr, val) => {
		if(this.r2) {
			this.ram[addr] = val >> 8;
			this.ram[addr + 1] = val;
		} else
			this.ram[addr] = val
	}

	this.devr = (port) => {
		return this.r2 ? (emu.dei(port) << 8) + emu.dei(port+1) : emu.dei(port)
	}

	this.devw = (port, val) => {
		if(this.r2) {
			emu.deo(port, val >> 8);
			emu.deo(port+1, val & 0xff)
		} else
			emu.deo(port, val)
	}

	this.jump = (addr, pc) => {
		return (this.r2 ? addr : pc + rel(addr)) & 0xffff;
	}

	this.move = (distance, pc) => {
		return pc = (pc + distance) & 0xffff
	}

	this.eval = (pc) => {
		let a, b, c, instr, opcode
		if(!pc || this.dev[0x0f])
			return 0;
		while((instr = this.ram[pc++])) {
			emu.onStep(pc, instr)
			// registers
			this.r2 = instr & 0x20
			this.rr = instr & 0x40
			this.rk = instr & 0x80
			if(this.rk) {
				this.wst.ptrk = this.wst.ptr
				this.rst.ptrk = this.rst.ptr
			}
			if(this.rr) {
				this.src = this.rst
				this.dst = this.wst
			} else {
				this.src = this.wst
				this.dst = this.rst
			}
			
			opcode = instr & 0x1f;
			switch(opcode - (!opcode * (instr >> 5))) {
			/* Literals/Calls */
			case -0x0: /* BRK */ return 1;
			case -0x1: /* JCI */ if(!this.src.pop8(b)) { pc = this.move(2, pc); break; }
			case -0x2: /* JMI */ pc = this.move(this.peek16(pc) + 2, pc); break;
			case -0x3: /* JSI */ this.rst.push16(pc + 2); pc = this.move(this.peek16(pc) + 2, pc); break;
			case -0x4: /* LIT */
			case -0x6: /* LITr */ 
			case -0x5: /* LIT2 */
			case -0x7: /* LIT2r */ 
			// Stack
			case 0x00: /* LIT */ this.push(this.peek(pc)); pc = this.move(!!this.r2 + 1, pc); break;
			case 0x01: /* INC */ this.push(this.pop() + 1); break;
			case 0x02: /* POP */ this.pop(); break;
			case 0x03: /* NIP */ a = this.pop(); this.pop(); this.push(a); break;
			case 0x04: /* SWP */ a = this.pop(); b = this.pop(); this.push(a); this.push(b); break;
			case 0x05: /* ROT */ a = this.pop(); b = this.pop(); c = this.pop(); this.push(b); this.push(a); this.push(c); break;
			case 0x06: /* DUP */ a = this.pop(); this.push(a); this.push(a); break;
			case 0x07: /* OVR */ a = this.pop(); b = this.pop(); this.push(b); this.push(a); this.push(b); break;
			// Logic
			case 0x08: /* EQU */ a = this.pop(); b = this.pop(); this.push8(b == a); break;
			case 0x09: /* NEQ */ a = this.pop(); b = this.pop(); this.push8(b != a); break;
			case 0x0a: /* GTH */ a = this.pop(); b = this.pop(); this.push8(b > a); break;
			case 0x0b: /* LTH */ a = this.pop(); b = this.pop(); this.push8(b < a); break;
			case 0x0c: /* JMP */ pc = this.jump(this.pop(), pc); break;
			case 0x0d: /* JCN */ a = this.pop(); if(this.src.pop8()) pc = this.jump(a, pc); break;
			case 0x0e: /* JSR */ this.dst.push16(pc); pc = this.jump(this.pop(), pc); break;
			case 0x0f: /* STH */ if(this.r2){ this.dst.push16(this.src.pop16()); } else{ this.dst.push8(this.src.pop8()); } break;
			// Memory
			case 0x10: /* LDZ */ this.push(this.peek(this.src.pop8())); break;
			case 0x11: /* STZ */ this.poke(this.src.pop8(), this.pop()); break;
			case 0x12: /* LDR */ this.push(this.peek(pc + rel(this.src.pop8()))); break;
			case 0x13: /* STR */ this.poke(pc + rel(this.src.pop8()), this.pop()); break;
			case 0x14: /* LDA */ this.push(this.peek(this.src.pop16())); break;
			case 0x15: /* STA */ this.poke(this.src.pop16(), this.pop()); break;
			case 0x16: /* DEI */ this.push(this.devr(this.src.pop8())); break;
			case 0x17: /* DEO */ this.devw(this.src.pop8(), this.pop()); break;
			// Arithmetic
			case 0x18: /* ADD */ a = this.pop(); b = this.pop(); this.push(b + a); break;
			case 0x19: /* SUB */ a = this.pop(); b = this.pop(); this.push(b - a); break;
			case 0x1a: /* MUL */ a = this.pop(); b = this.pop(); this.push(b * a); break;
			case 0x1b: /* DIV */ a = this.pop(); b = this.pop(); if(!a) return this.halt(3); this.push(b / a); break;
			case 0x1c: /* AND */ a = this.pop(); b = this.pop(); this.push(b & a); break;
			case 0x1d: /* ORA */ a = this.pop(); b = this.pop(); this.push(b | a); break;
			case 0x1e: /* EOR */ a = this.pop(); b = this.pop(); this.push(b ^ a); break;
			case 0x1f: /* SFT */ a = this.src.pop8(); b = this.pop(); this.push(b >> (a & 0x0f) << ((a & 0xf0) >> 4)); break;
			}
		}
	}

	this.load = (program) => {
		for (let i = 0; i <= program.length; i++)
			this.ram[0x100 + i] = program[i];
		return this
	}

	this.errors = [
		"underflow",
		"overflow",
		"division by zero"
	]

	this.halt = (err) => {
		let vec = this.peek16(emu.uxn.dev)
		if(vec)
			this.eval(vec)
		else
			emu.console.error_el.innerHTML = "<b>Error</b>: " + (this.rr ? "Return-stack" : "Working-stack") + " " + this.errors[err] + "."
		this.pc = 0x0000
	}

	function rel(val) {
		return (val > 0x80 ? val - 256 : val)
	}
}

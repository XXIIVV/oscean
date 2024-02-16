'use strict'

function Stack(u)
{
	this.ram = new Uint8Array(0x100)
	this.ptr = 0
	this.ptrk = 0
	this.pop1 = () => { return this.ram[(u.rk ? --this.ptrk : --this.ptr) & 0xff] }
	this.pop2 = () => { return this.pop1() | (this.pop1() << 8) }
	this.push1 = (val) => { this.ram[this.ptr++ & 0xff] = val }
	this.push2 = (val) => { this.push1(val >> 8), this.push1(val) }
}

function Uxn (emu)
{
	this.ram = new Uint8Array(0x10000)
	this.dev = new Uint8Array(0x100)
	this.wst = new Stack(this)
	this.rst = new Stack(this)
	this.move = (distance, pc) => { return (pc + distance) & 0xffff }
	this.jump = (addr, pc) => { return this.r2 ? addr : this.move(rel(addr), pc) }
	this.pop1 = () => { return this.src.pop1() }
	this.pop2 = () => { return this.src.pop2() }
	this.popx = () => { return this.r2 ? this.src.pop2() : this.src.pop1() }
	this.push1 = (x) => { this.src.push1(x) }
	this.push2 = (x) => { this.src.push2(x) }
	this.pushx = (x) => { if(this.r2) this.push2(x); else this.push1(x) }
	this.peek1 = (addr, m = 0xffff) => { return this.ram[addr] }
	this.peek2 = (addr, m = 0xffff) => { return (this.ram[addr] << 8) | this.ram[(addr + 1) & m] }
	this.peekx = (addr, m = 0xffff) => { return this.r2 ? this.peek2(addr, m) : this.peek1(addr, m) }
	this.poke1 = (addr, x, m = 0xffff) => { this.ram[addr] = x }
	this.poke2 = (addr, x, m = 0xffff) => { this.ram[addr] = x >> 8; this.ram[(addr + 1) & m] = x }
	this.pokex = (addr, x, m = 0xffff) => { if(this.r2) this.poke2(addr, x, m); else this.poke1(addr, x, m) }

	this.devr = (port) => { 
		if(this.r2)
			return (emu.dei(port) << 8) | emu.dei((port + 1) & 0xff)
		else
			return emu.dei(port)
	}

	this.devw = (port, val) => {
		if(this.r2)
			emu.deo(port, val >> 8), emu.deo((port + 1) & 0xff, val & 0xff)
		else
			emu.deo(port, val)
	}

	this.eval = (pc) => {
		let a, b, c, instr, opcode
		if(!pc || this.dev[0x0f])
			return 0
		while((instr = this.ram[pc++])) {
			// registers
			this.r2 = instr & 0x20
			this.rr = instr & 0x40
			this.rk = instr & 0x80
			if(this.rr) 
				this.src = this.rst, this.dst = this.wst
			else 
				this.src = this.wst, this.dst = this.rst
			if(this.rk) 
				this.src.ptrk = this.src.ptr
			opcode = instr & 0x1f;
			switch(opcode - (!opcode * (instr >> 5))) {
			/* Literals/Calls */
			case -0x0: /* BRK */ return 1;
			case -0x1: /* JCI */ if(!this.pop1()) { pc = this.move(2, pc); break }
			case -0x2: /* JMI */ pc = this.move(this.peek2(pc) + 2, pc); break;
			case -0x3: /* JSI */ this.rst.push2(pc + 2); pc = this.move(this.peek2(pc) + 2, pc); break;
			case -0x4: /* LIT */
			case -0x6: /* LITr */ 
			case -0x5: /* LIT2 */
			case -0x7: /* LIT2r */ 
			// Stack
			case 0x00: /* LIT */ this.pushx(this.peekx(pc)); pc = this.move(!!this.r2 + 1, pc); break;
			case 0x01: /* INC */ this.pushx(this.popx() + 1); break;
			case 0x02: /* POP */ this.popx(); break;
			case 0x03: /* NIP */ a = this.popx(); this.popx(); this.pushx(a); break;
			case 0x04: /* SWP */ a = this.popx(); b = this.popx(); this.pushx(a); this.pushx(b); break;
			case 0x05: /* ROT */ a = this.popx(); b = this.popx(); c = this.popx(); this.pushx(b); this.pushx(a); this.pushx(c); break;
			case 0x06: /* DUP */ a = this.popx(); this.pushx(a); this.pushx(a); break;
			case 0x07: /* OVR */ a = this.popx(); b = this.popx(); this.pushx(b); this.pushx(a); this.pushx(b); break;
			// Logic
			case 0x08: /* EQU */ a = this.popx(); b = this.popx(); this.push1(b == a); break;
			case 0x09: /* NEQ */ a = this.popx(); b = this.popx(); this.push1(b != a); break;
			case 0x0a: /* GTH */ a = this.popx(); b = this.popx(); this.push1(b > a); break;
			case 0x0b: /* LTH */ a = this.popx(); b = this.popx(); this.push1(b < a); break;
			case 0x0c: /* JMP */ pc = this.jump(this.popx(), pc); break;
			case 0x0d: /* JCN */ a = this.popx(); if(this.pop1()) pc = this.jump(a, pc); break;
			case 0x0e: /* JSR */ this.dst.push2(pc); pc = this.jump(this.popx(), pc); break;
			case 0x0f: /* STH */ if(this.r2){ this.dst.push2(this.pop2()) } else{ this.dst.push1(this.pop1()) } break;
			// Memory
			case 0x10: /* LDZ */ this.pushx(this.peekx(this.pop1(), 0xff)); break;
			case 0x11: /* STZ */ this.pokex(this.pop1(), this.popx(), 0xff); break;
			case 0x12: /* LDR */ this.pushx(this.peekx(pc + rel(this.pop1()))); break;
			case 0x13: /* STR */ this.pokex(pc + rel(this.pop1()), this.popx()); break;
			case 0x14: /* LDA */ this.pushx(this.peekx(this.pop2())); break;
			case 0x15: /* STA */ this.pokex(this.pop2(), this.popx()); break;
			case 0x16: /* DEI */ this.pushx(this.devr(this.pop1())); break;
			case 0x17: /* DEO */ this.devw(this.pop1(), this.popx()); break;
			// Arithmetic
			case 0x18: /* ADD */ a = this.popx(); b = this.popx(); this.pushx(b + a); break;
			case 0x19: /* SUB */ a = this.popx(); b = this.popx(); this.pushx(b - a); break;
			case 0x1a: /* MUL */ a = this.popx(); b = this.popx(); this.pushx(b * a); break;
			case 0x1b: /* DIV */ a = this.popx(); b = this.popx(); this.pushx(a ? b / a : 0); break;
			case 0x1c: /* AND */ a = this.popx(); b = this.popx(); this.pushx(b & a); break;
			case 0x1d: /* ORA */ a = this.popx(); b = this.popx(); this.pushx(b | a); break;
			case 0x1e: /* EOR */ a = this.popx(); b = this.popx(); this.pushx(b ^ a); break;
			case 0x1f: /* SFT */ a = this.pop1(); b = this.popx(); this.pushx(b >> (a & 0xf) << (a >> 4)); break;
			}
		}
	}

	this.load = (program) => {
		for (let i = 0; i <= program.length; i++)
			this.ram[0x100 + i] = program[i]
		return this
	}

	function rel(val) {
		return val > 0x80 ? val - 256 : val
	}
}

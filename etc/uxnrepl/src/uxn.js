'use strict'

function Stack(u, name)
{
	const ram = new Uint8Array(0x100)
	this.ptr = 0
	this.ptrk = 0
	this.PO1 = () => { return ram[(u.rk ? --this.ptrk : --this.ptr) & 0xff] }
	this.PO2 = () => { return this.PO1() | (this.PO1() << 8) }
	this.PU1 = (val) => { ram[this.ptr++ & 0xff] = val }
	this.PU2 = (val) => { this.PU1(val >> 8), this.PU1(val) }
	this.print = () => {
		let res = `${name} `
		for(let i = this.ptr - 8; i != this.ptr; i++) {
			res += ('0' + ram[i & 0xff].toString(16)).slice(-2)
			res += ((i + 1) & 0xff) ? ' ' : '|'
		}
		return res; }
}

function Uxn (emu)
{
	let a, b, c, pc, m2;
	const x = new Uint8Array(2);
	const y = new Uint8Array(2);
	const z = new Uint8Array(2);
	const ram = new Uint8Array(0x10000)
	this.wst = new Stack(this, "WST")
	this.rst = new Stack(this, "RST")
	this.dev = new Uint8Array(0x100)

	/* Microcode */

	this.JMI = () => { let a = ram[pc] << 8 | ram[pc + 1]; pc = (pc + a + 2) & 0xffff; }
	this.PO1 = () => { return this.src.PO1() }
	this.PO2 = () => { return this.src.PO2() }
	this.POx = () => { return m2 ? this.src.PO2() : this.src.PO1() }
	this.JMP = (i) => { if(m2) pc = i & 0xffff; else pc = (pc + sig(i)) & 0xffff; }
	this.PU1 = (i) => { this.src.PU1(i) }
	this.PU2 = (i) => { this.src.PU2(i) }
	this.PUx = (x) => { if(m2) this.PU2(x); else this.PU1(x) }
	this.GET = (o) => { if(m2) o[1] = this.PO1(); o[0] = this.PO1() }
	this.PUT = (i) => { this.PU1(i[0]); if(m2) this.PU1(i[1]) }
	this.DEI = (i,o) => { o[0] = emu.dei(i); if(m2) o[1] = emu.dei((i + 1) & 0xff); this.PUT(o) }
	this.DEO = (i,j) => { emu.deo(i, j[0]); if(m2) emu.deo((i + 1) & 0xff, j[1]) }
	this.PEK = (i,o,m) => { o[0] = ram[i]; if(m2) o[1] = ram[(i + 1) & m]; this.PUT(o) }
	this.POK = (i,j,m) => { ram[i] = j[0]; if(m2) ram[(i + 1) & m] = j[1]; }

	this.step = () => {
		const ins = ram[pc++]
		if(!pc || !ins) return;
		m2 = ins & 0x20
		this.rk = ins & 0x80
		if(ins & 0x40)
			this.src = this.rst, this.dst = this.wst
		else
			this.src = this.wst, this.dst = this.rst
		if(this.rk)
			this.src.ptrk = this.src.ptr
		switch(ins & 0x1f) {
		case 0x00:
		switch(ins) {
		case 0x00: /* BRK */ return ins;
		case 0x20: /* JCI */ if(this.PO1()) this.JMI(); else pc += 2; break;
		case 0x40: /* JMI */ this.JMI(); break;
		case 0x60: /* JSI */ this.rst.PU2(pc + 2); this.JMI(); break;
		case 0xa0: /* LI2 */ this.wst.PU1(ram[pc++]);
		case 0x80: /* LIT */ this.wst.PU1(ram[pc++]); break;
		case 0xe0: /* LIr */ this.rst.PU1(ram[pc++]);
		case 0xc0: /* L2r */ this.rst.PU1(ram[pc++]); break;
		} break;
		case 0x01: /* INC */ this.PUx(this.POx() + 1); break;
		case 0x02: /* POP */ this.POx( ); break;
		case 0x03: /* NIP */ this.GET(x), this.POx( ), this.PUT(x); break;
		case 0x04: /* SWP */ this.GET(x), this.GET(y), this.PUT(x), this.PUT(y); break;
		case 0x05: /* ROT */ this.GET(x), this.GET(y), this.GET(z), this.PUT(y), this.PUT(x), this.PUT(z); break;
		case 0x06: /* DUP */ this.GET(x), this.PUT(x), this.PUT(x); break;
		case 0x07: /* OVR */ this.GET(x), this.GET(y), this.PUT(y), this.PUT(x), this.PUT(y); break;
		case 0x08: /* EQU */ a = this.POx(), b = this.POx(), this.PU1(b == a); break;
		case 0x09: /* NEQ */ a = this.POx(), b = this.POx(), this.PU1(b != a); break;
		case 0x0a: /* GTH */ a = this.POx(), b = this.POx(), this.PU1(b > a); break;
		case 0x0b: /* LTH */ a = this.POx(), b = this.POx(), this.PU1(b < a); break;
		case 0x0c: /* JMP */ a = this.POx(), this.JMP(a); break;
		case 0x0d: /* JCN */ a = this.POx(), b = this.PO1(); if(b) this.JMP(a); break;
		case 0x0e: /* JSR */ a = this.POx(), this.dst.PU2(pc), this.JMP(a); break;
		case 0x0f: /* STH */ this.GET(x), this.dst.PU1(x[0]); if(m2) this.dst.PU1(x[1]); break;
		case 0x10: /* LDZ */ a = this.PO1(), this.PEK(a, x, 0xff); break;
		case 0x11: /* STZ */ a = this.PO1(), this.GET(y), this.POK(a, y, 0xff); break;
		case 0x12: /* LDR */ a = this.PO1(), this.PEK(pc + sig(a), x, 0xffff); break;
		case 0x13: /* STR */ a = this.PO1(), this.GET(y), this.POK(pc + sig(a), y, 0xffff); break;
		case 0x14: /* LDA */ a = this.PO2(), this.PEK(a, x, 0xffff); break;
		case 0x15: /* STA */ a = this.PO2(), this.GET(y), this.POK(a, y, 0xffff); break;
		case 0x16: /* DEI */ a = this.PO1(), this.DEI(a, x); break;
		case 0x17: /* DEO */ a = this.PO1(), this.GET(y), this.DEO(a, y); break;
		case 0x18: /* ADD */ a = this.POx(), b = this.POx(), this.PUx(b + a); break;
		case 0x19: /* SUB */ a = this.POx(), b = this.POx(), this.PUx(b - a); break;
		case 0x1a: /* MUL */ a = this.POx(), b = this.POx(), this.PUx(b * a); break;
		case 0x1b: /* DIV */ a = this.POx(), b = this.POx(), this.PUx(a ? b / a : 0); break;
		case 0x1c: /* AND */ a = this.POx(), b = this.POx(), this.PUx(b & a); break;
		case 0x1d: /* ORA */ a = this.POx(), b = this.POx(), this.PUx(b | a); break;
		case 0x1e: /* EOR */ a = this.POx(), b = this.POx(), this.PUx(b ^ a); break;
		case 0x1f: /* SFT */ a = this.PO1(), b = this.POx(), this.PUx(b >> (a & 0xf) << (a >> 4)); break;
		}
		return ins
	}

	this.load = (program) => {
		for (let i = 0; i <= program.length; i++)
			ram[0x100 + i] = program[i]
		return this
	}

	this.init = () => {
		pc = 0x100
	}

	this.eval = (at) => {
		let steps = 0x80000
		pc = at;
		while(steps-- && this.step());
	}

	function sig(val) {
		return val > 0x80 ? val - 256 : val
	}
}

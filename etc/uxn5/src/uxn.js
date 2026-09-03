'use strict'

function Stack(u, name)
{
	const ram = new Uint8Array(0x100)
	this.ptr = 0
	this.ptrk = 0
	this.PO1 = () => { return ram[--this.ptr & 0xff] }
	this.PO2 = () => { return this.PO1() | (this.PO1() << 8) }
	this.PU1 = (val) => { ram[this.ptr++ & 0xff] = val }
	this.PU2 = (val) => { this.PU1(val >> 8), this.PU1(val) }
	this.print = () => {
		let res = `${name}${this.ptr - 8 ? ' ' : '|'}`
		for(let i = this.ptr - 8; i != this.ptr; i++) {
			res += ('0' + ram[i & 0xff].toString(16)).slice(-2)
			res += ((i + 1) & 0xff) ? ' ' : '|'
		}
		return res; }
}

function Uxn (emu)
{
	let a, b, pc, src, dst, m2, mk;
	const x = new Uint8Array(2);
	const y = new Uint8Array(2);
	const z = new Uint8Array(2);
	const ram = new Uint8Array(0x10000)

	this.dev = new Uint8Array(0x100)
	this.wst = new Stack(this, "WST")
	this.rst = new Stack(this, "RST")

	/* Microcode */

	function JMP(i) { if(m2) pc = i & 0xffff; else pc = (pc + sig(i)) & 0xffff; }
	function JMI() { a = ram[pc++] << 8 | ram[pc++]; pc = (pc + a) & 0xffff; }
	function POx() { return m2 ? src.PO2() : src.PO1() }
	function PUx(x) { if(m2) src.PU2(x); else src.PU1(x) }
	function GET(o) { if(m2) o[1] = src.PO1(); o[0] = src.PO1() }
	function PUT(i) { src.PU1(i[0]); if(m2) src.PU1(i[1]) }
	function DEI(i,o) { o[0] = emu.dei(i); if(m2) o[1] = emu.dei((i + 1) & 0xff); PUT(o) }
	function DEO(i,j) { emu.deo(i, j[0]); if(m2) emu.deo((i + 1) & 0xff, j[1]) }
	function PEK(i,o,m) { o[0] = ram[i]; if(m2) o[1] = ram[(i + 1) & m]; PUT(o) }
	function POK(i,j,m) { ram[i] = j[0]; if(m2) ram[(i + 1) & m] = j[1]; }

	function k() { if(mk) src.ptr = src.ptrk }

	this.step = () => {
		const ins = ram[pc++]
		m2 = ins & 0x20
		if(ins & 0x40)
			src = this.rst, dst = this.wst
		else
			src = this.wst, dst = this.rst
		mk = ins & 0x80
		if(mk)
			src.ptrk = src.ptr
		switch(ins & 0x1f) {
		case 0x00:
		switch(ins) {
		case 0x00:/*BRK*/ return 0;
		case 0x20:/*JCI*/ if(src.PO1()) JMI(); else pc += 2; break;
		case 0x40:/*JMI*/ JMI(); break;
		case 0x60:/*JSI*/ this.rst.PU2(pc + 2); JMI(); break;
		case 0xa0:/*LI2*/ this.wst.PU1(ram[pc++]);
		case 0x80:/*LIT*/ this.wst.PU1(ram[pc++]); break;
		case 0xe0:/*LIr*/ this.rst.PU1(ram[pc++]);
		case 0xc0:/*L2r*/ this.rst.PU1(ram[pc++]); break;
		} break;
		case 0x01:/*INC*/ a=POx(), k(); PUx(a + 1); break;
		case 0x02:/*POP*/ POx(), k(); break;
		case 0x03:/*NIP*/ GET(x), POx(), k(); PUT(x); break;
		case 0x04:/*SWP*/ GET(x), GET(y), k(); PUT(x), PUT(y); break;
		case 0x05:/*ROT*/ GET(x), GET(y), GET(z), k(); PUT(y), PUT(x), PUT(z); break;
		case 0x06:/*DUP*/ GET(x), k(); PUT(x), PUT(x); break;
		case 0x07:/*OVR*/ GET(x), GET(y), k(); PUT(y), PUT(x), PUT(y); break;
		case 0x08:/*EQU*/ a=POx(), b=POx(), k(); src.PU1(b == a); break;
		case 0x09:/*NEQ*/ a=POx(), b=POx(), k(); src.PU1(b != a); break;
		case 0x0a:/*GTH*/ a=POx(), b=POx(), k(); src.PU1(b > a); break;
		case 0x0b:/*LTH*/ a=POx(), b=POx(), k(); src.PU1(b < a); break;
		case 0x0c:/*JMP*/ a=POx(), k(); JMP(a); break;
		case 0x0d:/*JCN*/ a=POx(), b=src.PO1(), k(); if(b) JMP(a); break;
		case 0x0e:/*JSR*/ a=POx(), k(); dst.PU2(pc), JMP(a); break;
		case 0x0f:/*STH*/ GET(x), k(); dst.PU1(x[0]); if(m2) dst.PU1(x[1]); break;
		case 0x10:/*LDZ*/ a=src.PO1(), k(); PEK(a, x, 0xff); break;
		case 0x11:/*STZ*/ a=src.PO1(), GET(y), k(); POK(a, y, 0xff); break;
		case 0x12:/*LDR*/ a=src.PO1(), k(); PEK(pc + sig(a), x, 0xffff); break;
		case 0x13:/*STR*/ a=src.PO1(), GET(y), k(); POK(pc + sig(a), y, 0xffff); break;
		case 0x14:/*LDA*/ a=src.PO2(), k(); PEK(a, x, 0xffff); break;
		case 0x15:/*STA*/ a=src.PO2(), GET(y), k(); POK(a, y, 0xffff); break;
		case 0x16:/*DEI*/ a=src.PO1(), k(); DEI(a, x); break;
		case 0x17:/*DEO*/ a=src.PO1(), GET(y), k(); DEO(a, y); break;
		case 0x18:/*ADD*/ a=POx(), b=POx(), k(); PUx(b + a); break;
		case 0x19:/*SUB*/ a=POx(), b=POx(), k(); PUx(b - a); break;
		case 0x1a:/*MUL*/ a=POx(), b=POx(), k(); PUx(b * a); break;
		case 0x1b:/*DIV*/ a=POx(), b=POx(), k(); PUx(a ? b / a : 0); break;
		case 0x1c:/*AND*/ a=POx(), b=POx(), k(); PUx(b & a); break;
		case 0x1d:/*ORA*/ a=POx(), b=POx(), k(); PUx(b | a); break;
		case 0x1e:/*EOR*/ a=POx(), b=POx(), k(); PUx(b ^ a); break;
		case 0x1f:/*SFT*/ a=src.PO1(), b=POx(), k(); PUx(b >> (a & 0xf) << (a >> 4)); break;
		}
		return ins
	}

	this.ram = ram;

	this.load = (program) => {
		for (let i = 0; i <= program.length; i++)
			ram[0x100 + i] = program[i]
		return this
	}

	this.init = () => {
		return Promise.resolve()
	}

	this.eval = (at) => {
		let steps = 0x80000
		pc = at;
		while(steps-- && this.step());
	}

	function sig(val) {
		return val >= 0x80 ? val - 256 : val
	}
}

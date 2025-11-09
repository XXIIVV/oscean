'use strict'

function Stack(u, name)
{
	const ram = new Uint8Array(0x100)
	let ptr = 0, ptrk = 0
	this.PO1 = () => { return ram[--ptr & 0xff] }
	this.PO2 = () => { return this.PO1() | (this.PO1() << 8) }
	this.PU1 = (val) => { ram[ptr++ & 0xff] = val }
	this.PU2 = (val) => { this.PU1(val >> 8), this.PU1(val) }
	this.keep = () => { ptrk = ptr }
	this.k = (t) => { if(t) ptr = ptrk }
	this.print = () => {
		let res = `${name} `
		for(let i = ptr - 8; i != ptr; i++) {
			res += ('0' + ram[i & 0xff].toString(16)).slice(-2)
			res += ((i + 1) & 0xff) ? ' ' : '|'
		}
		return res; }
}

function Uxn (emu)
{
	let a, b, pc, src, dst, m2, mr, mk;
	const x = new Uint8Array(2);
	const y = new Uint8Array(2);
	const z = new Uint8Array(2);
	const ram = new Uint8Array(0x10000)
	const wst = new Stack(this, "WST")
	const rst = new Stack(this, "RST")

	this.dev = new Uint8Array(0x100)
	this.get_wst = () => { return wst }
	this.get_rst = () => { return rst }
	
	/* Microcode */

	function Jmp(i) { if(m2) pc = i & 0xffff; else pc = (pc + sig(i)) & 0xffff; }
	function Jmi() { a = ram[pc++] << 8 | ram[pc++]; pc = (pc + a) & 0xffff; }
	function Pox() { return m2 ? src.PO2() : src.PO1() }
	function Pux(x) { if(m2) src.PU2(x); else src.PU1(x) }
	function Get(o) { if(m2) o[1] = src.PO1(); o[0] = src.PO1() }
	function Put(i) { src.PU1(i[0]); if(m2) src.PU1(i[1]) }
	function Dei(i,o) { o[0] = emu.dei(i); if(m2) o[1] = emu.dei((i + 1) & 0xff); Put(o) }
	function Deo(i,j) { emu.deo(i, j[0]); if(m2) emu.deo((i + 1) & 0xff, j[1]) }
	function Pek(i,o,m) { o[0] = ram[i]; if(m2) o[1] = ram[(i + 1) & m]; Put(o) }
	function Pok(i,j,m) { ram[i] = j[0]; if(m2) ram[(i + 1) & m] = j[1]; }

	/* Opcodes */

	const lut = [
		IMM, INC, POP, NIP, SWP, ROT, DUP, OVR,
		EQU, NEQ, GTH, LTH, JMP, JCN, JSR, STH,
		LDZ, STZ, LDR, STR, LDA, STA, DEI, DEO,
		ADD, SUB, MUL, DIV, AND, ORA, EOR, SFT]
		
	function IMM(ins) {
		switch(ins) {
		case 0x20:/*JCI*/ if(src.PO1()) Jmi(); else pc += 2; return;
		case 0x40:/*Jmi*/ Jmi(); return;
		case 0x60:/*JSI*/ rst.PU2(pc + 2); Jmi(); return;
		case 0xa0:/*LI2*/ wst.PU1(ram[pc++]);
		case 0x80:/*LIT*/ wst.PU1(ram[pc++]); return;
		case 0xe0:/*LIr*/ rst.PU1(ram[pc++]);
		case 0xc0:/*L2r*/ rst.PU1(ram[pc++]); return;
		}
	}
	
	function INC(inc) { a=Pox(), src.k(mk); Pux(a + 1); }
	function POP(ins) { Pox(), src.k(mk); }
	function NIP(ins) { Get(x), Pox(), src.k(mk); Put(x); }
	function SWP(ins) { Get(x), Get(y), src.k(mk); Put(x), Put(y); }
	function ROT(ins) { Get(x), Get(y), Get(z), src.k(mk); Put(y), Put(x), Put(z); }
	function DUP(ins) { Get(x), src.k(mk); Put(x), Put(x); }
	function OVR(ins) { Get(x), Get(y), src.k(mk); Put(y), Put(x), Put(y); }
	function EQU(ins) { a=Pox(), b=Pox(), src.k(mk); src.PU1(b == a); }
	function NEQ(ins) { a=Pox(), b=Pox(), src.k(mk); src.PU1(b != a); }
	function GTH(ins) { a=Pox(), b=Pox(), src.k(mk); src.PU1(b > a); }
	function LTH(ins) { a=Pox(), b=Pox(), src.k(mk); src.PU1(b < a); }
	function JMP(ins) { a=Pox(), src.k(mk); Jmp(a); }
	function JCN(ins) { a=Pox(), b=src.PO1(), src.k(mk); if(b) Jmp(a); }
	function JSR(ins) { a=Pox(), src.k(mk); dst.PU2(pc), Jmp(a); }
	function STH(ins) { Get(x), src.k(mk); dst.PU1(x[0]); if(m2) dst.PU1(x[1]); }
	function LDZ(ins) { a=src.PO1(), src.k(mk); Pek(a, x, 0xff); }
	function STZ(ins) { a=src.PO1(), Get(y), src.k(mk); Pok(a, y, 0xff); }
	function LDR(ins) { a=src.PO1(), src.k(mk); Pek(pc + sig(a), x, 0xffff); }
	function STR(ins) { a=src.PO1(), Get(y), src.k(mk); Pok(pc + sig(a), y, 0xffff); }
	function LDA(ins) { a=src.PO2(), src.k(mk); Pek(a, x, 0xffff); }
	function STA(ins) { a=src.PO2(), Get(y), src.k(mk); Pok(a, y, 0xffff); }
	function DEI(ins) { a=src.PO1(), src.k(mk); Dei(a, x); }
	function DEO(ins) { a=src.PO1(), Get(y), src.k(mk); Deo(a, y); }
	function ADD(ins) { a=Pox(), b=Pox(), src.k(mk); Pux(b + a); }
	function SUB(ins) { a=Pox(), b=Pox(), src.k(mk); Pux(b - a); }
	function MUL(ins) { a=Pox(), b=Pox(), src.k(mk); Pux(b * a); }
	function DIV(ins) { a=Pox(), b=Pox(), src.k(mk); Pux(a ? b / a : 0); }
	function AND(ins) { a=Pox(), b=Pox(), src.k(mk); Pux(b & a); }
	function ORA(ins) { a=Pox(), b=Pox(), src.k(mk); Pux(b | a); }
	function EOR(ins) { a=Pox(), b=Pox(), src.k(mk); Pux(b ^ a); }
	function SFT(ins) { a=src.PO1(), b=Pox(), src.k(mk); Pux(b >> (a & 0xf) << (a >> 4)); }

	this.step = () => {
		const ins = ram[pc++]
		m2 = ins & 0x20, mr = ins & 0x40, mk = ins & 0x80
		if(mr) src = rst, dst = wst
		else   src = wst, dst = rst
		if(mk) src.keep()
		lut[ins & 0x1f](ins)
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
		let steps = 0x8000000
		pc = at;
		while(steps-- && this.step());
	}

	function sig(val) {
		return val >= 0x80 ? val - 256 : val
	}
}

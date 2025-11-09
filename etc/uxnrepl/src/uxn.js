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
	this.recover = () => { ptr = ptrk }
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
	const stk = [new Stack(this, "WST"), new Stack(this, "RST")]

	this.dev = new Uint8Array(0x100)
	this.get_wst = () => { return stk[0] }
	this.get_rst = () => { return stk[1] }
	
	/* Microcode */

	function Sig(val) { return val >= 0x80 ? val - 256 : val }
	function Jmp(i) { if(m2) pc = i & 0xffff; else pc = (pc + Sig(i)) & 0xffff; }
	function Jmi() { a = ram[pc++] << 8 | ram[pc++]; pc = (pc + a) & 0xffff; }
	function Po1() { return src.PO1() }
	function Po2() { return src.PO2() }
	function Pox() { return m2 ? Po2() : Po1() }
	function Pu1(x) { src.PU1(x) }
	function Pux(x) { if(m2) src.PU2(x); else Pu1(x) }
	function Get(o) { if(m2) o[1] = Po1(); o[0] = Po1() }
	function Put(i) { Pu1(i[0]); if(m2) Pu1(i[1]) }
	function Dei(i,o) { o[0] = emu.dei(i); if(m2) o[1] = emu.dei((i + 1) & 0xff); Put(o) }
	function Deo(i,j) { emu.deo(i, j[0]); if(m2) emu.deo((i + 1) & 0xff, j[1]) }
	function Pek(i,o,m) { o[0] = ram[i]; if(m2) o[1] = ram[(i + 1) & m]; Put(o) }
	function Pok(i,j,m) { ram[i] = j[0]; if(m2) ram[(i + 1) & m] = j[1]; }
	function Rec() { if(mk) src.recover() }

	/* Opcodes */

	const lut = [
		IMM, INC, POP, NIP, SWP, ROT, DUP, OVR,
		EQU, NEQ, GTH, LTH, JMP, JCN, JSR, STH,
		LDZ, STZ, LDR, STR, LDA, STA, DEI, DEO,
		ADD, SUB, MUL, DIV, AND, ORA, EOR, SFT]
		
	function IMM(ins) {
		switch(ins) {
		case 0x20:/*JCI*/ if(Po1()) Jmi(); else pc += 2; return;
		case 0x40:/*Jmi*/ Jmi(); return;
		case 0x60:/*JSI*/ stk[1].PU2(pc + 2); Jmi(); return;
		case 0xa0:/*LI2*/ stk[0].PU1(ram[pc++]);
		case 0x80:/*LIT*/ stk[0].PU1(ram[pc++]); return;
		case 0xe0:/*LIr*/ stk[1].PU1(ram[pc++]);
		case 0xc0:/*L2r*/ stk[1].PU1(ram[pc++]); return;
		}
	}
	
	function INC(inc) { a=Pox(), Rec(); Pux(a + 1); }
	function POP(ins) { Pox(), Rec(); }
	function NIP(ins) { Get(x), Pox(), Rec(); Put(x); }
	function SWP(ins) { Get(x), Get(y), Rec(); Put(x), Put(y); }
	function ROT(ins) { Get(x), Get(y), Get(z), Rec(); Put(y), Put(x), Put(z); }
	function DUP(ins) { Get(x), Rec(); Put(x), Put(x); }
	function OVR(ins) { Get(x), Get(y), Rec(); Put(y), Put(x), Put(y); }
	function EQU(ins) { a=Pox(), b=Pox(), Rec(); Pu1(b == a); }
	function NEQ(ins) { a=Pox(), b=Pox(), Rec(); Pu1(b != a); }
	function GTH(ins) { a=Pox(), b=Pox(), Rec(); Pu1(b > a); }
	function LTH(ins) { a=Pox(), b=Pox(), Rec(); Pu1(b < a); }
	function JMP(ins) { a=Pox(), Rec(); Jmp(a); }
	function JCN(ins) { a=Pox(), b=Po1(), Rec(); if(b) Jmp(a); }
	function JSR(ins) { a=Pox(), Rec(); dst.PU2(pc), Jmp(a); }
	function STH(ins) { Get(x), Rec(); dst.PU1(x[0]); if(m2) dst.PU1(x[1]); }
	function LDZ(ins) { a=Po1(), Rec(); Pek(a, x, 0xff); }
	function STZ(ins) { a=Po1(), Get(y), Rec(); Pok(a, y, 0xff); }
	function LDR(ins) { a=Po1(), Rec(); Pek(pc + Sig(a), x, 0xffff); }
	function STR(ins) { a=Po1(), Get(y), Rec(); Pok(pc + Sig(a), y, 0xffff); }
	function LDA(ins) { a=Po2(), Rec(); Pek(a, x, 0xffff); }
	function STA(ins) { a=Po2(), Get(y), Rec(); Pok(a, y, 0xffff); }
	function DEI(ins) { a=Po1(), Rec(); Dei(a, x); }
	function DEO(ins) { a=Po1(), Get(y), Rec(); Deo(a, y); }
	function ADD(ins) { a=Pox(), b=Pox(), Rec(); Pux(b + a); }
	function SUB(ins) { a=Pox(), b=Pox(), Rec(); Pux(b - a); }
	function MUL(ins) { a=Pox(), b=Pox(), Rec(); Pux(b * a); }
	function DIV(ins) { a=Pox(), b=Pox(), Rec(); Pux(a ? b / a : 0); }
	function AND(ins) { a=Pox(), b=Pox(), Rec(); Pux(b & a); }
	function ORA(ins) { a=Pox(), b=Pox(), Rec(); Pux(b | a); }
	function EOR(ins) { a=Pox(), b=Pox(), Rec(); Pux(b ^ a); }
	function SFT(ins) { a=Po1(), b=Pox(), Rec(); Pux(b >> (a & 0xf) << (a >> 4)); }

	this.step = () => {
		const ins = ram[pc++]
		m2 = ins & 0x20, mr = ins & 0x40, mk = ins & 0x80
		if(mr) src = stk[1], dst = stk[0]
		else   src = stk[0], dst = stk[1]
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

}

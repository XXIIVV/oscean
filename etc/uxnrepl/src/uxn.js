'use strict'

function Uxn (emu)
{
	let a, b, m2, mr, mk, pk;
	const x = new Uint8Array(2);
	const y = new Uint8Array(2);
	const z = new Uint8Array(2);
	const ram = new Uint8Array(0x10000)
	const stk = [new Stack(this, "WST"), new Stack(this, "RST")]
	const pc = new Uint16Array(1);
	this.dev = new Uint8Array(0x100)
	this.get_wst = () => { return stk[0] }
	this.get_rst = () => { return stk[1] }
	
	function Stack(u, name)
	{
		const ram = new Uint8Array(0x100)
		this.ptr = new Uint8Array(1)
		this.PO1 = () => { return ram[--this.ptr[0] & 0xff] }
		this.PO2 = () => { return this.PO1() | (this.PO1() << 8) }
		this.PU1 = (val) => { ram[this.ptr[0]++ & 0xff] = val }
		this.PU2 = (val) => { this.PU1(val >> 8), this.PU1(val) }
		this.print = () => {
			let res = `${name}${this.ptr[0] - 8 ? ' ' : '|'}`
			for(let i = this.ptr[0] - 8; i != this.ptr[0]; i++) {
				res += ('0' + ram[i & 0xff].toString(16)).slice(-2)
				res += ((i + 1) & 0xff) ? ' ' : '|'
			}
			return res; }
	}
	
	/* Microcode */
	
	function Sig(n) { return n >= 0x80 ? n - 256 : n }
	function Jmp(i) { if(m2) pc[0] = i; else pc[0] = (pc[0] + Sig(i)); }
	function Jmi() { a = ram[pc[0]++] << 8 | ram[pc[0]++]; pc[0] = (pc[0] + a); }
	
	function Po1() { return stk[mr].PO1() }
	function Po2() { return stk[mr].PO2() }
	function Pox(s) { return m2 ? s.PO2() : s.PO1() }
	
	function Pu1(x) { stk[mr].PU1(x) }
	function Pu2(x) { stk[mr].PU2(x) }
	function Pux(x) { if(m2) stk[mr].PU2(x); else Pu1(x) }
	
	function Get(o) { if(m2) o[1] = Po1(); o[0] = Po1() }
	function Put(i) { Pu1(i[0]); if(m2) Pu1(i[1]) }
	
	function Dei(i,o) { o[0] = emu.dei(i); if(m2) o[1] = emu.dei((i + 1) & 0xff); Put(o) }
	function Deo(i,j) { emu.deo(i, j[0]); if(m2) emu.deo((i + 1) & 0xff, j[1]) }
	function Pek(i,o,m) { o[0] = ram[i]; if(m2) o[1] = ram[(i + 1) & m]; Put(o) }
	function Pok(i,j,m) { ram[i] = j[0]; if(m2) ram[(i + 1) & m] = j[1]; }
	
	function Rec(s) { if(mk) s.ptr[0] = pk }

	/* Opcodes */
	
	this.init = () => {
		pc[0] = 0x100
	}
	
	this.eval = (at) => {
		let steps = 0x8000000
		pc[0] = at;
		while(steps-- && this.step());
	}
	
	this.step = () => {
		const ins = ram[pc[0]++]
		m2 = ins & 0x20
		mr = ins >> 6 & 1
		mk = ins & 0x80
		const s = stk[mr]
		pk = s.ptr[0]
		switch(ins & 0x1f) {
			case 0x00: /* IMM */ {
				switch(ins) {
					case 0x20: /*JCI*/ if(Po1()) Jmi(); else pc[0] += 2; break;
					case 0x40: /*Jmi*/ Jmi(); break;
					case 0x60: /*JSI*/ Pu2(pc[0] + 2); Jmi(); break;
					case 0xa0: /*LI2*/ Pu1(ram[pc[0]++]);
					case 0x80: /*LIT*/ Pu1(ram[pc[0]++]); break;
					case 0xe0: /*LIr*/ Pu1(ram[pc[0]++]);
					case 0xc0: /*L2r*/ Pu1(ram[pc[0]++]); break;
				} break;
			}
			case 0x01: /* INC */ { a=Pox(s), Rec(s); Pux(a + 1); break; }
			case 0x02: /* POP */ { Pox(s), Rec(s); break; }
			case 0x03: /* NIP */ { Get(x), Pox(s), Rec(s); Put(x); break; }
			case 0x04: /* SWP */ { Get(x), Get(y), Rec(s); Put(x), Put(y); break; }
			case 0x05: /* ROT */ { Get(x), Get(y), Get(z), Rec(s); Put(y), Put(x), Put(z); break; }
			case 0x06: /* DUP */ { Get(x), Rec(s); Put(x), Put(x); break; }
			case 0x07: /* OVR */ { Get(x), Get(y), Rec(s); Put(y), Put(x), Put(y); break; }
			case 0x08: /* EQU */ { a=Pox(s), b=Pox(s), Rec(s); Pu1(b == a); break; }
			case 0x09: /* NEQ */ { a=Pox(s), b=Pox(s), Rec(s); Pu1(b != a); break; }
			case 0x0a: /* GTH */ { a=Pox(s), b=Pox(s), Rec(s); Pu1(b > a); break; }
			case 0x0b: /* LTH */ { a=Pox(s), b=Pox(s), Rec(s); Pu1(b < a); break; }
			case 0x0c: /* JMP */ { a=Pox(s), Rec(s); Jmp(a); break; }
			case 0x0d: /* JCN */ { a=Pox(s), b=Po1(), Rec(s); if(b) Jmp(a); break; }
			case 0x0e: /* JSR */ { a=Pox(s), Rec(s); stk[mr^1].PU2(pc[0]), Jmp(a); break; }
			case 0x0f: /* STH */ { Get(x), Rec(s); stk[mr^1].PU1(x[0]); if(m2) stk[mr^1].PU1(x[1]); break; }
			case 0x10: /* LDZ */ { a=Po1(), Rec(s); Pek(a, x, 0xff); break; }
			case 0x11: /* STZ */ { a=Po1(), Get(y), Rec(s); Pok(a, y, 0xff); break; }
			case 0x12: /* LDR */ { a=Po1(), Rec(s); Pek(pc[0] + Sig(a), x, 0xffff); break; }
			case 0x13: /* STR */ { a=Po1(), Get(y), Rec(s); Pok(pc[0] + Sig(a), y, 0xffff); break; }
			case 0x14: /* LDA */ { a=Po2(), Rec(s); Pek(a, x, 0xffff); break; }
			case 0x15: /* STA */ { a=Po2(), Get(y), Rec(s); Pok(a, y, 0xffff); break; }
			case 0x16: /* DEI */ { a=Po1(), Rec(s); Dei(a, x); break; }
			case 0x17: /* DEO */ { a=Po1(), Get(y), Rec(s); Deo(a, y); break; }
			case 0x18: /* ADD */ { a=Pox(s), b=Pox(s), Rec(s); Pux(b + a); break; }
			case 0x19: /* SUB */ { a=Pox(s), b=Pox(s), Rec(s); Pux(b - a); break; }
			case 0x1a: /* MUL */ { a=Pox(s), b=Pox(s), Rec(s); Pux(b * a); break; }
			case 0x1b: /* DIV */ { a=Pox(s), b=Pox(s), Rec(s); Pux(a ? b / a : 0); break; }
			case 0x1c: /* AND */ { a=Pox(s), b=Pox(s), Rec(s); Pux(b & a); break; }
			case 0x1d: /* ORA */ { a=Pox(s), b=Pox(s), Rec(s); Pux(b | a); break; }
			case 0x1e: /* EOR */ { a=Pox(s), b=Pox(s), Rec(s); Pux(b ^ a); break; }
			case 0x1f: /* SFT */ { a=Po1(), b=Pox(s), Rec(s); Pux(b >> (a & 0xf) << (a >> 4)); break; }
		}
		return ins
	}

	this.load = (program) => {
		for (let i = 0; i <= program.length; i++)
			ram[0x100 + i] = program[i]
		return this
	}
}

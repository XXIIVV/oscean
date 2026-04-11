'use strict'

function Uxn (emu)
{
	let a, b, m2;
	const x = new Uint8Array(2)
	const y = new Uint8Array(2)
	const z = new Uint8Array(2)
	const pc = new Uint16Array(1)
	const ram = new Uint8Array(0x10000)
	const ptr = new Uint8Array(2);
	const stk = [new Uint8Array(0x100), new Uint8Array(0x100)]
	const Sig = n => (n << 24) >> 24
	this.dev = new Uint8Array(0x100)
	this.get_ptr = (id) => { return ptr[id]; }
	this.get_stk = (id) => { return stk[id]; }
	
	/* Microcode */

	function Jmp(i) { if(m2) pc[0] = i; else pc[0] = (pc[0] + Sig(i)); }
	function Jmi() { a = ram[pc[0]++] << 8 | ram[pc[0]++]; pc[0] = (pc[0] + a); }
	function Po1(s) { return stk[s][--ptr[s] & 0xff] }
	function Po2(s) { return stk[s][--ptr[s] & 0xff] | (stk[s][--ptr[s] & 0xff] << 8) }
	function Pox(s) { return m2 ? Po2(s) : Po1(s) }
	function Pu1(s, x) { stk[s][ptr[s]++ & 0xff] = x }
	function Pu2(s, x) { stk[s][ptr[s]++ & 0xff] = x >> 8, stk[s][ptr[s]++ & 0xff] = x }
	function Pux(s, x) { if(m2) Pu2(s, x); else Pu1(s, x) }
	function Get(s, o) { if(m2) o[1] = Po1(s); o[0] = Po1(s) }
	function Put(s, i) { Pu1(s, i[0]); if(m2) Pu1(s, i[1]) }
	function Dei(s,i,o) { o[0] = emu.dei(i); if(m2) o[1] = emu.dei((i + 1) & 0xff); Put(s, o) }
	function Deo(i,j) { emu.deo(i, j[0]); if(m2) emu.deo((i + 1) & 0xff, j[1]) }
	function Pek(s,i,o,m) { o[0] = ram[i]; if(m2) o[1] = ram[(i + 1) & m]; Put(s, o) }
	function Pok(i,j,m) { ram[i] = j[0]; if(m2) ram[(i + 1) & m] = j[1]; }

	/* Opcodes */
	
	this.init = () => {
		pc[0] = 0x100
	}
	
	function step() {
		const ins = ram[pc[0]++]
		const mk = ins >> 7
		const s = ins >> 6 & 1
		m2 = ins >> 5 & 1
		const pk = ptr[s]
		switch(ins & 0x1f) {
			case 0x00: /* IMM */ {
				switch(ins) {
					case 0x20: /*JCI*/ if(Po1(s)) Jmi(); else pc[0] += 2; break;
					case 0x40: /*Jmi*/ Jmi(); break;
					case 0x60: /*JSI*/ Pu2(s, pc[0] + 2); Jmi(); break;
					case 0xa0: /*LI2*/ Pu1(s, ram[pc[0]++]);
					case 0x80: /*LIT*/ Pu1(s, ram[pc[0]++]); break;
					case 0xe0: /*LIr*/ Pu1(s, ram[pc[0]++]);
					case 0xc0: /*L2r*/ Pu1(s, ram[pc[0]++]); break;
				} break;
			}
			case 0x01: /* INC */ { a=Pox(s);                        if(mk) ptr[s] = pk; Pux(s, a + 1); break; }
			case 0x02: /* POP */ { Pox(s);                          if(mk) ptr[s] = pk; break; }
			case 0x03: /* NIP */ { Get(s, x); Pox(s);               if(mk) ptr[s] = pk; Put(s, x); break; }
			case 0x04: /* SWP */ { Get(s, x); Get(s, y);            if(mk) ptr[s] = pk; Put(s, x); Put(s, y); break; }
			case 0x05: /* ROT */ { Get(s, x); Get(s, y); Get(s, z); if(mk) ptr[s] = pk; Put(s, y); Put(s, x); Put(s, z); break; }
			case 0x06: /* DUP */ { Get(s, x);                       if(mk) ptr[s] = pk; Put(s, x); Put(s, x); break; }
			case 0x07: /* OVR */ { Get(s, x); Get(s, y);            if(mk) ptr[s] = pk; Put(s, y); Put(s, x); Put(s, y); break; }
			case 0x08: /* EQU */ { a=Pox(s); b=Pox(s);              if(mk) ptr[s] = pk; Pu1(s, b == a); break; }
			case 0x09: /* NEQ */ { a=Pox(s); b=Pox(s);              if(mk) ptr[s] = pk; Pu1(s, b != a); break; }
			case 0x0a: /* GTH */ { a=Pox(s); b=Pox(s);              if(mk) ptr[s] = pk; Pu1(s, b > a); break; }
			case 0x0b: /* LTH */ { a=Pox(s); b=Pox(s);              if(mk) ptr[s] = pk; Pu1(s, b < a); break; }
			case 0x0c: /* JMP */ { a=Pox(s);                        if(mk) ptr[s] = pk; Jmp(a); break; }
			case 0x0d: /* JCN */ { a=Pox(s); b=Po1(s);              if(mk) ptr[s] = pk; if(b) Jmp(a); break; }
			case 0x0e: /* JSR */ { a=Pox(s);                        if(mk) ptr[s] = pk; Pu2(s^1, pc[0]); Jmp(a); break; }
			case 0x0f: /* STH */ { Get(s, x);                       if(mk) ptr[s] = pk; Pu1(s^1, x[0]); if(m2) Pu1(s^1, x[1]); break; }
			case 0x10: /* LDZ */ { a=Po1(s);                        if(mk) ptr[s] = pk; Pek(s, a, x, 0xff); break; }
			case 0x11: /* STZ */ { a=Po1(s); Get(s, y);             if(mk) ptr[s] = pk; Pok(a, y, 0xff); break; }
			case 0x12: /* LDR */ { a=Po1(s);                        if(mk) ptr[s] = pk; Pek(s, pc[0] + Sig(a), x, 0xffff); break; }
			case 0x13: /* STR */ { a=Po1(s); Get(s, y);             if(mk) ptr[s] = pk; Pok(pc[0] + Sig(a), y, 0xffff); break; }
			case 0x14: /* LDA */ { a=Po2(s);                        if(mk) ptr[s] = pk; Pek(s, a, x, 0xffff); break; }
			case 0x15: /* STA */ { a=Po2(s); Get(s, y);             if(mk) ptr[s] = pk; Pok(a, y, 0xffff); break; }
			case 0x16: /* DEI */ { a=Po1(s);                        if(mk) ptr[s] = pk; Dei(s, a, x); break; }
			case 0x17: /* DEO */ { a=Po1(s); Get(s, y);             if(mk) ptr[s] = pk; Deo(a, y); break; }
			case 0x18: /* ADD */ { a=Pox(s); b=Pox(s);              if(mk) ptr[s] = pk; Pux(s, b + a); break; }
			case 0x19: /* SUB */ { a=Pox(s); b=Pox(s);              if(mk) ptr[s] = pk; Pux(s, b - a); break; }
			case 0x1a: /* MUL */ { a=Pox(s); b=Pox(s);              if(mk) ptr[s] = pk; Pux(s, b * a); break; }
			case 0x1b: /* DIV */ { a=Pox(s); b=Pox(s);              if(mk) ptr[s] = pk; Pux(s, a ? b / a : 0); break; }
			case 0x1c: /* AND */ { a=Pox(s); b=Pox(s);              if(mk) ptr[s] = pk; Pux(s, b & a); break; }
			case 0x1d: /* ORA */ { a=Pox(s); b=Pox(s);              if(mk) ptr[s] = pk; Pux(s, b | a); break; }
			case 0x1e: /* EOR */ { a=Pox(s); b=Pox(s);              if(mk) ptr[s] = pk; Pux(s, b ^ a); break; }
			case 0x1f: /* SFT */ { a=Po1(s); b=Pox(s);              if(mk) ptr[s] = pk; Pux(s, b >> (a & 0xf) << (a >> 4)); break; }
		}
		return ins
	}

	
	this.eval = (at) => {
		let steps = 0x8000000
		pc[0] = at;
		while(steps-- && step());
	}
	

	this.load = (program) => {
		for (let i = 0; i <= program.length; i++)
			ram[0x100 + i] = program[i]
		return this
	}
}

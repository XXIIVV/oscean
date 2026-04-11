'use strict'

function Uxn (emu)
{
	const x = new Uint8Array(2)
	const y = new Uint8Array(2)
	const z = new Uint8Array(2)
	const pc = new Uint16Array(1)
	const ram = new Uint8Array(0x10000)
	const ptr = new Uint8Array(2);
	const stk = [new Uint8Array(0x100),new Uint8Array(0x100)]
	const Sig = n => (n << 24) >> 24
	this.dev = new Uint8Array(0x100)
	this.get_ptr = (id) => { return ptr[id]; }
	this.get_stk = (id) => { return stk[id]; }
	
	/* Microcode */

	function Jmp(d,i) { if(d) pc[0] = i; else pc[0] = (pc[0] + Sig(i)); }
	function Jmi() { const t = ram[pc[0]++] << 8 | ram[pc[0]++]; pc[0] = (pc[0] + t); }
	function Po1(s) { return stk[s][--ptr[s] & 0xff] }
	function Po2(s) { return stk[s][--ptr[s] & 0xff] | (stk[s][--ptr[s] & 0xff] << 8) }
	function Pox(d,s) { return d ? Po2(s) : Po1(s) }
	function Pu1(s,x) { stk[s][ptr[s]++ & 0xff] = x }
	function Pu2(s,x) { stk[s][ptr[s]++ & 0xff] = x >> 8,stk[s][ptr[s]++ & 0xff] = x }
	function Pux(d,s,x) { if(d) Pu2(s,x); else Pu1(s,x) }
	function Get(d,s,o) { if(d) o[1] = Po1(s); o[0] = Po1(s) }
	function Put(d,s,i) { Pu1(s,i[0]); if(d) Pu1(s,i[1]) }
	function Dei(d,s,i,o) { o[0] = emu.dei(i); if(d) o[1] = emu.dei((i + 1) & 0xff); Put(d,s,o) }
	function Deo(d,i,j) { emu.deo(i,j[0]); if(d) emu.deo((i + 1) & 0xff,j[1]) }
	function Pek(d,s,i,o,m) { o[0] = ram[i]; if(d) o[1] = ram[(i + 1) & m]; Put(d,s,o) }
	function Pok(d,i,j,m) { ram[i] = j[0]; if(d) ram[(i + 1) & m] = j[1]; }

	/* Opcodes */
	
	this.init = () => {
		pc[0] = 0x100
	}
	
	this.step = () => {
		const ins = ram[pc[0]++]
		const k = ins >> 7      /* Keep mode */
		const s = ins >> 6 & 1  /* Return mode */
		const d = ins >> 5 & 1  /* Short mode */
		const pk = ptr[s]
		let a, b
		switch(ins & 0x1f) {
		case 0x00: /* IMM */ {
			switch(ins) {
			case 0x20: /* JCI */ if(Po1(s)) Jmi(); else pc[0] += 2; break;
			case 0x40: /* JMI */ Jmi(); break;
			case 0x60: /* JSI */ Pu2(s,pc[0] + 2); Jmi(); break;
			case 0xa0: /* LI2 */ Pu1(s,ram[pc[0]++]);
			case 0x80: /* LIT */ Pu1(s,ram[pc[0]++]); break;
			case 0xe0: /* LIR */ Pu1(s,ram[pc[0]++]);
			case 0xc0: /* L2R */ Pu1(s,ram[pc[0]++]); break;
			} break;
		}
		case 0x01: /* INC */ { a=Pox(d,s);                         if(k) ptr[s] = pk; Pux(d,s,a + 1); break; }
		case 0x02: /* POP */ { Pox(d,s);                           if(k) ptr[s] = pk; break; }
		case 0x03: /* NIP */ { Get(d,s,x); Pox(d,s);               if(k) ptr[s] = pk; Put(d,s,x); break; }
		case 0x04: /* SWP */ { Get(d,s,x); Get(d,s,y);             if(k) ptr[s] = pk; Put(d,s,x); Put(d,s,y); break; }
		case 0x05: /* ROT */ { Get(d,s,x); Get(d,s,y); Get(d,s,z); if(k) ptr[s] = pk; Put(d,s,y); Put(d,s,x); Put(d,s,z); break; }
		case 0x06: /* DUP */ { Get(d,s,x);                         if(k) ptr[s] = pk; Put(d,s,x); Put(d,s,x); break; }
		case 0x07: /* OVR */ { Get(d,s,x); Get(d,s,y);             if(k) ptr[s] = pk; Put(d,s,y); Put(d,s,x); Put(d,s,y); break; }
		case 0x08: /* EQU */ { a=Pox(d,s); b=Pox(d,s);             if(k) ptr[s] = pk; Pu1(s,b == a); break; }
		case 0x09: /* NEQ */ { a=Pox(d,s); b=Pox(d,s);             if(k) ptr[s] = pk; Pu1(s,b != a); break; }
		case 0x0a: /* GTH */ { a=Pox(d,s); b=Pox(d,s);             if(k) ptr[s] = pk; Pu1(s,b > a); break; }
		case 0x0b: /* LTH */ { a=Pox(d,s); b=Pox(d,s);             if(k) ptr[s] = pk; Pu1(s,b < a); break; }
		case 0x0c: /* JMP */ { a=Pox(d,s);                         if(k) ptr[s] = pk; Jmp(d,a); break; }
		case 0x0d: /* JCN */ { a=Pox(d,s); b=Po1(s);               if(k) ptr[s] = pk; if(b) Jmp(d,a); break; }
		case 0x0e: /* JSR */ { a=Pox(d,s);                         if(k) ptr[s] = pk; Pu2(s^1,pc[0]); Jmp(d,a); break; }
		case 0x0f: /* STH */ { Get(d,s,x);                         if(k) ptr[s] = pk; Pu1(s^1,x[0]); if(d) Pu1(s^1,x[1]); break; }
		case 0x10: /* LDZ */ { a=Po1(s);                           if(k) ptr[s] = pk; Pek(d,s,a,x,0xff); break; }
		case 0x11: /* STZ */ { a=Po1(s); Get(d,s,y);               if(k) ptr[s] = pk; Pok(d,a,y,0xff); break; }
		case 0x12: /* LDR */ { a=Po1(s);                           if(k) ptr[s] = pk; Pek(d,s,pc[0] + Sig(a),x,0xffff); break; }
		case 0x13: /* STR */ { a=Po1(s); Get(d,s,y);               if(k) ptr[s] = pk; Pok(d,pc[0] + Sig(a),y,0xffff); break; }
		case 0x14: /* LDA */ { a=Po2(s);                           if(k) ptr[s] = pk; Pek(d,s,a,x,0xffff); break; }
		case 0x15: /* STA */ { a=Po2(s); Get(d,s,y);               if(k) ptr[s] = pk; Pok(d,a,y,0xffff); break; }
		case 0x16: /* DEI */ { a=Po1(s);                           if(k) ptr[s] = pk; Dei(d,s,a,x); break; }
		case 0x17: /* DEO */ { a=Po1(s); Get(d,s,y);               if(k) ptr[s] = pk; Deo(d,a,y); break; }
		case 0x18: /* ADD */ { a=Pox(d,s); b=Pox(d,s);             if(k) ptr[s] = pk; Pux(d,s,b + a); break; }
		case 0x19: /* SUB */ { a=Pox(d,s); b=Pox(d,s);             if(k) ptr[s] = pk; Pux(d,s,b - a); break; }
		case 0x1a: /* MUL */ { a=Pox(d,s); b=Pox(d,s);             if(k) ptr[s] = pk; Pux(d,s,b * a); break; }
		case 0x1b: /* DIV */ { a=Pox(d,s); b=Pox(d,s);             if(k) ptr[s] = pk; Pux(d,s,a ? b / a : 0); break; }
		case 0x1c: /* AND */ { a=Pox(d,s); b=Pox(d,s);             if(k) ptr[s] = pk; Pux(d,s,b & a); break; }
		case 0x1d: /* ORA */ { a=Pox(d,s); b=Pox(d,s);             if(k) ptr[s] = pk; Pux(d,s,b | a); break; }
		case 0x1e: /* EOR */ { a=Pox(d,s); b=Pox(d,s);             if(k) ptr[s] = pk; Pux(d,s,b ^ a); break; }
		case 0x1f: /* SFT */ { a=Po1(s); b=Pox(d,s);               if(k) ptr[s] = pk; Pux(d,s,b >> (a & 0xf) << (a >> 4)); break; }
		}
		return ins
	}

	this.eval = (at) => {
		let steps = 0x8000000
		let step = this.step
		pc[0] = at;
		while(steps-- && step());
	}
	
	this.load = (program) => {
		for (let i = 0; i <= program.length; i++)
			ram[0x100 + i] = program[i]
		return this
	}
}

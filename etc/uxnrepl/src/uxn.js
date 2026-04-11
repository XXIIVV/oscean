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

	function Jmi() { const t = ram[pc[0]++] << 8 | ram[pc[0]++]; pc[0] += t; }
	function Jmp(d,i) { if(d) pc[0] = i; else pc[0] += Sig(i); }
	function Po1(s) { return stk[s][--ptr[s]] }
	function Po2(s) { return stk[s][--ptr[s]] | (stk[s][--ptr[s]] << 8) }
	function Pox(d,s) { return d ? Po2(s) : Po1(s) }
	function Pu1(s,x) { stk[s][ptr[s]++] = x }
	function Pu2(s,x) { stk[s][ptr[s]++] = x >> 8,stk[s][ptr[s]++] = x }
	function Pux(d,s,x) { if(d) Pu2(s,x); else Pu1(s,x) }
	function Get(d,s,o) { if(d) o[1] = Po1(s); o[0] = Po1(s) }
	function Put(d,s,i) { Pu1(s,i[0]); if(d) Pu1(s,i[1]) }
	function Dei(d,s,i,o) { o[0] = emu.dei(i); if(d) o[1] = emu.dei((i + 1) & 0xff); Put(d,s,o) }
	function Deo(d,i,j) { emu.deo(i,j[0]); if(d) emu.deo((i + 1) & 0xff,j[1]) }
	function Pek(d,s,i,o,m) { o[0] = ram[i]; if(d) o[1] = ram[(i + 1) & m]; Put(d,s,o) }
	function Pok(d,i,j,m) { ram[i] = j[0]; if(d) ram[(i + 1) & m] = j[1]; }

	/* Opcodes */
	
	this.step = () => {
		const ins = ram[pc[0]++]
		const k = ins >> 7      /* Keep mode */
		const r = ins >> 6 & 1  /* Return mode */
		const d = ins >> 5 & 1  /* Short mode */
		const kp = ptr[r]       /* Keep mode(ptr) */
		let a, b
		switch(ins & 0x1f) {
		case 0x00: /* IMM */ {
			switch(ins) {
			case 0x20: /* JCI */ if(Po1(0)) Jmi(); else pc[0] += 2; break;
			case 0x40: /* JMI */ Jmi(); break;
			case 0x60: /* JSI */ Pu2(1,pc[0] + 2); Jmi(); break;
			case 0xa0: /* LI2 */ Pu1(0,ram[pc[0]++]);
			case 0x80: /* LIT */ Pu1(0,ram[pc[0]++]); break;
			case 0xe0: /* LIR */ Pu1(1,ram[pc[0]++]);
			case 0xc0: /* L2R */ Pu1(1,ram[pc[0]++]); break;
			} break;
		}
		case 0x01: /* INC */ { a=Pox(d,r);                         if(k) ptr[r] = kp; Pux(d,r,a + 1); break; }
		case 0x02: /* POP */ { Pox(d,r);                           if(k) ptr[r] = kp; break; }
		case 0x03: /* NIP */ { Get(d,r,x); Pox(d,r);               if(k) ptr[r] = kp; Put(d,r,x); break; }
		case 0x04: /* SWP */ { Get(d,r,x); Get(d,r,y);             if(k) ptr[r] = kp; Put(d,r,x); Put(d,r,y); break; }
		case 0x05: /* ROT */ { Get(d,r,x); Get(d,r,y); Get(d,r,z); if(k) ptr[r] = kp; Put(d,r,y); Put(d,r,x); Put(d,r,z); break; }
		case 0x06: /* DUP */ { Get(d,r,x);                         if(k) ptr[r] = kp; Put(d,r,x); Put(d,r,x); break; }
		case 0x07: /* OVR */ { Get(d,r,x); Get(d,r,y);             if(k) ptr[r] = kp; Put(d,r,y); Put(d,r,x); Put(d,r,y); break; }
		case 0x08: /* EQU */ { a=Pox(d,r); b=Pox(d,r);             if(k) ptr[r] = kp; Pu1(r,b == a); break; }
		case 0x09: /* NEQ */ { a=Pox(d,r); b=Pox(d,r);             if(k) ptr[r] = kp; Pu1(r,b != a); break; }
		case 0x0a: /* GTH */ { a=Pox(d,r); b=Pox(d,r);             if(k) ptr[r] = kp; Pu1(r,b > a); break; }
		case 0x0b: /* LTH */ { a=Pox(d,r); b=Pox(d,r);             if(k) ptr[r] = kp; Pu1(r,b < a); break; }
		case 0x0c: /* JMP */ { a=Pox(d,r);                         if(k) ptr[r] = kp; Jmp(d,a); break; }
		case 0x0d: /* JCN */ { a=Pox(d,r); b=Po1(r);               if(k) ptr[r] = kp; if(b) Jmp(d,a); break; }
		case 0x0e: /* JSR */ { a=Pox(d,r);                         if(k) ptr[r] = kp; Pu2(r^1,pc[0]); Jmp(d,a); break; }
		case 0x0f: /* STH */ { Get(d,r,x);                         if(k) ptr[r] = kp; Pu1(r^1,x[0]); if(d) Pu1(r^1,x[1]); break; }
		case 0x10: /* LDZ */ { a=Po1(r);                           if(k) ptr[r] = kp; Pek(d,r,a,x,0xff); break; }
		case 0x11: /* STZ */ { a=Po1(r); Get(d,r,y);               if(k) ptr[r] = kp; Pok(d,a,y,0xff); break; }
		case 0x12: /* LDR */ { a=Po1(r);                           if(k) ptr[r] = kp; Pek(d,r,pc[0] + Sig(a),x,0xffff); break; }
		case 0x13: /* STR */ { a=Po1(r); Get(d,r,y);               if(k) ptr[r] = kp; Pok(d,pc[0] + Sig(a),y,0xffff); break; }
		case 0x14: /* LDA */ { a=Po2(r);                           if(k) ptr[r] = kp; Pek(d,r,a,x,0xffff); break; }
		case 0x15: /* STA */ { a=Po2(r); Get(d,r,y);               if(k) ptr[r] = kp; Pok(d,a,y,0xffff); break; }
		case 0x16: /* DEI */ { a=Po1(r);                           if(k) ptr[r] = kp; Dei(d,r,a,x); break; }
		case 0x17: /* DEO */ { a=Po1(r); Get(d,r,y);               if(k) ptr[r] = kp; Deo(d,a,y); break; }
		case 0x18: /* ADD */ { a=Pox(d,r); b=Pox(d,r);             if(k) ptr[r] = kp; Pux(d,r,b + a); break; }
		case 0x19: /* SUB */ { a=Pox(d,r); b=Pox(d,r);             if(k) ptr[r] = kp; Pux(d,r,b - a); break; }
		case 0x1a: /* MUL */ { a=Pox(d,r); b=Pox(d,r);             if(k) ptr[r] = kp; Pux(d,r,b * a); break; }
		case 0x1b: /* DIV */ { a=Pox(d,r); b=Pox(d,r);             if(k) ptr[r] = kp; Pux(d,r,a ? b / a : 0); break; }
		case 0x1c: /* AND */ { a=Pox(d,r); b=Pox(d,r);             if(k) ptr[r] = kp; Pux(d,r,b & a); break; }
		case 0x1d: /* ORA */ { a=Pox(d,r); b=Pox(d,r);             if(k) ptr[r] = kp; Pux(d,r,b | a); break; }
		case 0x1e: /* EOR */ { a=Pox(d,r); b=Pox(d,r);             if(k) ptr[r] = kp; Pux(d,r,b ^ a); break; }
		case 0x1f: /* SFT */ { a=Po1(r); b=Pox(d,r);               if(k) ptr[r] = kp; Pux(d,r,b >> (a & 0xf) << (a >> 4)); break; }
		}
		return ins
	}

	this.init = () => {
		pc[0] = 0x100
	}

	this.eval = (at) => {
		let steps = 0x8000000
		pc[0] = at;
		while(steps-- && this.step());
	}
	
	this.load = (program) => {
		for (let i = 0; i < program.length; i++)
			ram[0x100 + i] = program[i]
		return this
	}
}

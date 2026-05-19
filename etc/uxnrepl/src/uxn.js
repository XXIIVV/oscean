'use strict'

function Uxn(emu) {
	const ram = new Uint8Array(0x10000)
	const ptr = new Uint8Array(2)
	const stk = [new Uint8Array(0x100), new Uint8Array(0x100)]
	const pc = new Uint16Array(1)
	const Sig = n => (n << 24) >> 24

	this.dev = new Uint8Array(0x100)
	this.get_ptr = (id) => ptr[id]
	this.get_stk = (id) => stk[id]

	/* Primitives */
	function Ld1(r, o)          { return stk[r][(ptr[r] - o) & 0xff] }
	function Ld2(r, o)          { return (stk[r][(ptr[r] - o) & 0xff] << 8) | stk[r][(ptr[r] - o + 1) & 0xff] }
	function Ldx(d, r, o8, o16) { return d ? Ld2(r, o16) : Ld1(r, o8) }
	function Re1(r, m)          { ptr[r] -= m }
	function Rex(d, r, m1, m2)  { ptr[r] -= d ? m2 : m1 }
	function Pu1(s, v)          { stk[s][ptr[s]++] = v }
	function Pu2(s, v)          { stk[s][ptr[s]++] = v >> 8; stk[s][ptr[s]++] = v }
	function Pux(d, s, v)       { if(d) Pu1(s, v >> 8); Pu1(s, v) }
	function Jmi()              { const t = ram[pc[0]++] << 8 | ram[pc[0]++]; pc[0] += t }
	function Jmp(d, i)          { if(d) pc[0] = i; else pc[0] += Sig(i) }
	function Lda(d, r, o)       { Pu1(r, ram[o & 0xffff]); if(d) Pu1(r, ram[(o + 1) & 0xffff]) }
	function Ldaz(d, r, o)      { Pu1(r, ram[o & 0xff]); if(d) Pu1(r, ram[(o + 1) & 0xff]) }
	function Sta(d, o, v)       { if(d) { ram[o & 0xffff] = v >> 8; ram[(o + 1) & 0xffff] = v; } else ram[o & 0xffff] = v }
	function Staz(d, o, v)      { if(d) { ram[o & 0xff] = v >> 8; ram[(o + 1) & 0xff] = v; } else ram[o & 0xff] = v }
	function Dei(d, r, i)       { const t = emu.dei(i), tt = d ? emu.dei((i + 1) & 0xff) : 0; Pu1(r, t); if(d) Pu1(r, tt) }
	function Deo(d, i, v)       { if(d) emu.deo(i, v >> 8); emu.deo(d ? (i + 1) & 0xff : i, v) }

	this.step = () => {
		const ins = ram[pc[0]++]
		const k = ins >> 7
		const r = (ins >> 6) & 1
		const d = (ins >> 5) & 1
		let x, y, z
		switch(ins & 0x1f) {
		case 0x00: /* IMM */
			switch(ins) {
			case 0x20: /* JCI */ if(stk[0][--ptr[0]]) Jmi(); else pc[0] += 2; break;
			case 0x40: /* JMI */ Jmi(); break;
			case 0x60: /* JSI */ Pu2(1, pc[0] + 2); Jmi(); break;
			case 0xa0: /* LI2 */ Pu1(0, ram[pc[0]++]);
			case 0x80: /* LIT */ Pu1(0, ram[pc[0]++]); break;
			case 0xe0: /* L2r */ Pu1(1, ram[pc[0]++]);
			case 0xc0: /* LIr */ Pu1(1, ram[pc[0]++]); break;
			} break;
		case 0x01: /* INC */ { x=Ldx(d,r,1,2);                 if(!k) Rex(d,r,1,2); Pux(d,r,x+1); break; }
		case 0x02: /* POP */ {                                 if(!k) Rex(d,r,1,2); break; }
		case 0x03: /* NIP */ { x=Ldx(d,r,1,2);                 if(!k) Rex(d,r,2,4); Pux(d,r,x); break; }
		case 0x04: /* SWP */ { x=Ldx(d,r,1,2); y=Ldx(d,r,2,4); if(!k) Rex(d,r,2,4); Pux(d,r,x); Pux(d,r,y); break; }
		case 0x05: /* ROT */ { x=Ldx(d,r,1,2); y=Ldx(d,r,2,4), z=Ldx(d,r,3,6); if(!k) Rex(d,r,3,6); Pux(d,r,y); Pux(d,r,x); Pux(d,r,z); break; }
		case 0x06: /* DUP */ { x=Ldx(d,r,1,2);                 if(!k) Rex(d,r,1,2); Pux(d,r,x); Pux(d,r,x); break; }
		case 0x07: /* OVR */ { x=Ldx(d,r,1,2); y=Ldx(d,r,2,4); if(!k) Rex(d,r,2,4); Pux(d,r,y); Pux(d,r,x); Pux(d,r,y); break; }
		case 0x08: /* EQU */ { x=Ldx(d,r,1,2); y=Ldx(d,r,2,4); if(!k) Rex(d,r,2,4); Pu1(r,y==x); break; }
		case 0x09: /* NEQ */ { x=Ldx(d,r,1,2); y=Ldx(d,r,2,4); if(!k) Rex(d,r,2,4); Pu1(r,y!=x); break; }
		case 0x0a: /* GTH */ { x=Ldx(d,r,1,2); y=Ldx(d,r,2,4); if(!k) Rex(d,r,2,4); Pu1(r,y>x); break; }
		case 0x0b: /* LTH */ { x=Ldx(d,r,1,2); y=Ldx(d,r,2,4); if(!k) Rex(d,r,2,4); Pu1(r,y<x); break; }
		case 0x0c: /* JMP */ { x=Ldx(d,r,1,2);                 if(!k) Rex(d,r,1,2); Jmp(d,x); break; }
		case 0x0d: /* JCN */ { x=Ldx(d,r,1,2); y=Ld1(r,d?3:2); if(!k) Rex(d,r,2,3); if(y) Jmp(d,x); break; }
		case 0x0e: /* JSR */ { x=Ldx(d,r,1,2);                 if(!k) Rex(d,r,1,2); Pu2(r^1,pc[0]); Jmp(d,x); break; }
		case 0x0f: /* STH */ { x=Ldx(d,r,1,2);                 if(!k) Rex(d,r,1,2); Pux(d,r^1,x); break; }
		case 0x10: /* LDZ */ { x=Ld1(r,1);                     if(!k) Re1(r,1);     Ldaz(d,r,x); break; }
		case 0x11: /* STZ */ { x=Ld1(r,1);     y=Ldx(d,r,2,3); if(!k) Rex(d,r,2,3); Staz(d,x,y); break; }
		case 0x12: /* LDR */ { x=Ld1(r,1);                     if(!k) Re1(r,1);     Lda(d,r,pc[0]+Sig(x)); break; }
		case 0x13: /* STR */ { x=Ld1(r,1);     y=Ldx(d,r,2,3); if(!k) Rex(d,r,2,3); Sta(d,pc[0]+Sig(x),y); break; }
		case 0x14: /* LDA */ { x=Ld2(r,2);                     if(!k) Re1(r,2);     Lda(d,r,x); break; }
		case 0x15: /* STA */ { x=Ld2(r,2);     y=Ldx(d,r,3,4); if(!k) Rex(d,r,3,4); Sta(d,x,y); break; }
		case 0x16: /* DEI */ { x=Ld1(r,1);                     if(!k) Re1(r,1);     Dei(d,r,x); break; }
		case 0x17: /* DEO */ { x=Ld1(r,1);     y=Ldx(d,r,2,3); if(!k) Rex(d,r,2,3); Deo(d,x,y); break; }
		case 0x18: /* ADD */ { x=Ldx(d,r,1,2); y=Ldx(d,r,2,4); if(!k) Rex(d,r,2,4); Pux(d,r,y+x); break; }
		case 0x19: /* SUB */ { x=Ldx(d,r,1,2); y=Ldx(d,r,2,4); if(!k) Rex(d,r,2,4); Pux(d,r,y-x); break; }
		case 0x1a: /* MUL */ { x=Ldx(d,r,1,2); y=Ldx(d,r,2,4); if(!k) Rex(d,r,2,4); Pux(d,r,y*x); break; }
		case 0x1b: /* DIV */ { x=Ldx(d,r,1,2); y=Ldx(d,r,2,4); if(!k) Rex(d,r,2,4); Pux(d,r,x?y/x:0); break; }
		case 0x1c: /* AND */ { x=Ldx(d,r,1,2); y=Ldx(d,r,2,4); if(!k) Rex(d,r,2,4); Pux(d,r,y&x); break; }
		case 0x1d: /* ORA */ { x=Ldx(d,r,1,2); y=Ldx(d,r,2,4); if(!k) Rex(d,r,2,4); Pux(d,r,y|x); break; }
		case 0x1e: /* EOR */ { x=Ldx(d,r,1,2); y=Ldx(d,r,2,4); if(!k) Rex(d,r,2,4); Pux(d,r,y^x); break; }
		case 0x1f: /* SFT */ { x=Ld1(r,1);     y=Ldx(d,r,2,3); if(!k) Rex(d,r,2,3); Pux(d,r,(y>>(x&0xf))<<(x>>4)); break; }
		}
		return ins
	}

	this.init = () => { pc[0] = 0x100; return this }

	this.eval = (at) => {
		let steps = 0x8000000
		pc[0] = at
		while(this.step())
			if(--steps == 0) {
				emu.console.error_string("\nUxn is exhausted.")
				break
			}
	}

	this.load = (program) => {
		for(let i = 0; i < program.length; i++)
			ram[0x100 + i] = program[i]
		return this
	}
}

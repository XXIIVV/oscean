'use strict'

function Screen(emu)
{
	function MAR(x) { return x + 0x8; }
	function MAR2(x) { return x + 0x10; }
	function clamp(v,a,b) { if(v < a) return a; else if(v >= b) return b; else return v; }
	function twos(v) { if(v & 0x8000) return v - 0x10000; return v; }

	const blending = [
		[0, 0, 0, 0, 1, 0, 1, 1, 2, 2, 0, 2, 3, 3, 3, 0],
		[0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3],
		[1, 2, 3, 1, 1, 2, 3, 1, 1, 2, 3, 1, 1, 2, 3, 1],
		[2, 3, 1, 2, 2, 3, 1, 2, 2, 3, 1, 2, 2, 3, 1, 2]];

	this.repaint = 0
	this.pixels = 0
	this.scale = 1
	this.zoom = 1
	this.width = this.height = 0
	this.layers = {fg: 0, bg: 0};
	this.palette = [[],[],[],[]]
	this.x1 = this.y1 = this.x2 = this.y2 = 0
	this.vector = 0

	this.init = () => {
		this.display = document.getElementById("display");
		this.displayctx = this.display.getContext("2d", {"willReadFrequently": true})
		this.display.addEventListener("pointermove", emu.mouse.on_move)
		this.display.addEventListener("pointerdown", emu.mouse.on_down)
		this.display.addEventListener("pointerup", emu.mouse.on_up)
		this.display.addEventListener("wheel", emu.mouse.on_scroll)
		this.set_zoom(1)
		this.resize(512, 320, 1)
	}

	this.changed = () => {
		this.x1 = clamp(this.x1, 0, this.width);
		this.y1 = clamp(this.y1, 0, this.height);
		this.x2 = clamp(this.x2, 0, this.width);
		this.y2 = clamp(this.y2, 0, this.height);
		return this.x2 > this.x1 && this.y2 > this.y1;
	}

	this.change = (x1, y1, x2, y2) => {
		if(x1 < this.x1) this.x1 = x1;
		if(y1 < this.y1) this.y1 = y1;
		if(x2 > this.x2) this.x2 = x2;
		if(y2 > this.y2) this.y2 = y2;
	}

	this.update_palette = () => {
		let i, sft, shift, cr,cg,cb;
		let r = emu.uxn.dev[0x8] << 8 | emu.uxn.dev[0x9]
		let g = emu.uxn.dev[0xa] << 8 | emu.uxn.dev[0xb]
		let b = emu.uxn.dev[0xc] << 8 | emu.uxn.dev[0xd]
		for(i = 0, sft = 12; i < 4; ++i, sft -= 4) {
			cr = (r >> sft) & 0xf,
			cg = (g >> sft) & 0xf,
			cb = (b >> sft) & 0xf;
			this.palette[i][0] = cr | (cr << 4)
			this.palette[i][1] = cg | (cg << 4)
			this.palette[i][2] = cb | (cb << 4)
		}
		this.repaint = 1
	}

	this.resize = (width, height, scale) => {
		width = clamp(width, 8, 0x800);
		height = clamp(height, 8, 0x800);
		scale = clamp(scale, 1, 3);
		/* on rescale */
		let length = width * height * 4 * scale * scale
		this.pixels = new Uint8ClampedArray(length)
		this.scale = scale;
		/* on resize */
		if(this.width != width || this.height != height) {
			let length = MAR2(width) * MAR2(height);
			this.layers.fg = new Uint8ClampedArray(length)
			this.layers.bg = new Uint8ClampedArray(length)
			this.width = width;
			this.height = height;
		}
		this.repaint = 1
		console.log(`Resize requested: ${width}x${height}`)
		this.displayctx.canvas.width = width;
		this.displayctx.canvas.height = height;
		this.set_zoom(this.zoom)
	}

	this.redraw = () => {
		let i, x, y, k, l;
		for(y = this.y1; y < this.y2; y++) {
			let ys = y * this.scale;
			for(x = this.x1, i = MAR(x) + MAR(y) * MAR2(this.width); x < this.x2; x++, i++) {
				let color = this.palette[this.layers.fg[i] ? this.layers.fg[i] : this.layers.bg[i]]
				for(k = 0; k < this.scale; k++) {
					let oo = ((ys + k) * this.width + x) * this.scale * 4;
					for(l = 0; l < this.scale; l++){
						this.pixels[oo + l + 0] = color[0]
						this.pixels[oo + l + 1] = color[1]
						this.pixels[oo + l + 2] = color[2]
						this.pixels[oo + l + 3] = 0xff
					}
				}
			}
		}
		this.x1 = this.y1 = this.x2 = this.y2 = 0;
	}

	let rX = 0, rY = 0, rA = 0, rMX = 0, rMY = 0, rMA = 0, rML = 0, rDX = 0, rDY = 0;

	this.dei = (addr) => {
		switch(addr) {
		case 0x22: return this.width >> 8;
		case 0x23: return this.width;
		case 0x24: return this.height >> 8;
		case 0x25: return this.height;
		case 0x28: return rX >> 8;
		case 0x29: return rX;
		case 0x2a: return rY >> 8;
		case 0x2b: return rY;
		case 0x2c: return rA >> 8;
		case 0x2d: return rA;
		default: return emu.uxn.dev[addr];
		}
	}

	this.deo = (addr) => {
		switch(addr) {
		case 0x21: this.vector = emu.uxn.dev[0x20] << 8 | emu.uxn.dev[0x21]; return;
		case 0x23: this.resize(emu.uxn.dev[0x22] << 8 | emu.uxn.dev[0x23], this.height, this.scale); return;
		case 0x25: this.resize(this.width, emu.uxn.dev[0x24] << 8 | emu.uxn.dev[0x25], this.scale); return;
		case 0x26:
			rMX = emu.uxn.dev[0x26] & 0x1;
			rMY = emu.uxn.dev[0x26] & 0x2;
			rMA = emu.uxn.dev[0x26] & 0x4;
			rML = emu.uxn.dev[0x26] >> 4;
			rDX = rMX << 3;
			rDY = rMY << 2; return;
		case 0x28:
		case 0x29: rX = (emu.uxn.dev[0x28] << 8) | emu.uxn.dev[0x29], rX = twos(rX); return;
		case 0x2a:
		case 0x2b: rY = (emu.uxn.dev[0x2a] << 8) | emu.uxn.dev[0x2b], rY = twos(rY); return;
		case 0x2c:
		case 0x2d: rA = (emu.uxn.dev[0x2c] << 8) | emu.uxn.dev[0x2d]; return;
		case 0x2e: {
			let ctrl = emu.uxn.dev[0x2e];
			let color = ctrl & 0x3;
			let len = MAR2(this.width);
			let layer = ctrl & 0x40 ? this.layers.fg : this.layers.bg;
			/* fill mode */
			if(ctrl & 0x80) {
				let x1, y1, x2, y2, ax, bx, ay, by, hor, ver;
				if(ctrl & 0x10)
					x1 = 0, x2 = rX;
				else
					x1 = rX, x2 = this.width;
				if(ctrl & 0x20)
					y1 = 0, y2 = rY;
				else
					y1 = rY, y2 = this.height;
				this.repaint = 1
				x1 = MAR(x1), y1 = MAR(y1);
				hor = MAR(x2) - x1, ver = MAR(y2) - y1;
				for(ay = y1 * len, by = ay + ver * len; ay < by; ay += len)
					for(ax = ay + x1, bx = ax + hor; ax < bx; ax++)
						layer[ax] = color & 0xff
			}
			/* pixel mode */
			else {
				if(rX >= 0 && rY >= 0 && rX < len && rY < this.height)
					layer[MAR(rX) + MAR(rY) * len] = color;
				if(!this.repaint) this.change(rX, rY, rX + 1, rY + 1);
				if(rMX) rX++;
				if(rMY) rY++;
			}
			return;
		}
		case 0x2f: {
			let ctrl = emu.uxn.dev[0x2f];
			let blend = ctrl & 0xf, opaque = blend % 5;
			let fx = ctrl & 0x10 ? -1 : 1, fy = ctrl & 0x20 ? -1 : 1;
			let qfx = fx > 0 ? 7 : 0, qfy = fy < 0 ? 7 : 0;
			let dxy = fy * rDX, dyx = fx * rDY;
			let wmar = MAR(this.width), wmar2 = MAR2(this.width);
			let hmar2 = MAR2(this.height);
			let i, x1, x2, y1, y2, ax, ay, qx, qy, x = rX, y = rY;
			let layer = ctrl & 0x40 ? this.layers.fg : this.layers.bg;
			if(ctrl & 0x80) {
				let addr_incr = rMA << 2;
				for(i = 0; i <= rML; i++, x += dyx, y += dxy, rA += addr_incr) {
					let xmar = MAR(x), ymar = MAR(y);
					let xmar2 = MAR2(x), ymar2 = MAR2(y);
					if(xmar >= 0 && xmar < wmar && ymar2 >= 0 && ymar2 < hmar2) {
						let by = ymar2 * wmar2;
						for(ay = ymar * wmar2, qy = qfy; ay < by; ay += wmar2, qy += fy) {
							let ch1 = emu.uxn.ram[rA + qy], ch2 = emu.uxn.ram[rA + qy + 8] << 1, bx = xmar2 + ay;
							for(ax = xmar + ay, qx = qfx; ax < bx; ax++, qx -= fx) {
								let color = ((ch1 >> qx) & 1) | ((ch2 >> qx) & 2);
								if(opaque || color) layer[ax] = blending[color][blend];
							}
						}
					}
				}
			} else {
				let addr_incr = rMA << 1;
				for(i = 0; i <= rML; i++, x += dyx, y += dxy, rA += addr_incr) {
					let xmar = MAR(x), ymar = MAR(y);
					let xmar2 = MAR2(x), ymar2 = MAR2(y);
					if(xmar >= 0 && xmar < wmar && ymar2 >= 0 && ymar2 < hmar2) {
						let by = ymar2 * wmar2;
						for(ay = ymar * wmar2, qy = qfy; ay < by; ay += wmar2, qy += fy) {
							let ch1 = emu.uxn.ram[rA + qy], bx = xmar2 + ay;
							for(ax = xmar + ay, qx = qfx; ax < bx; ax++, qx -= fx) {
								let color = (ch1 >> qx) & 1;
								if(opaque || color) layer[ax] = blending[color][blend];
							}
						}
					}
				}
			}
			if(fx < 0) x1 = x, x2 = rX;
			else x1 = rX, x2 = x;
			if(fy < 0) y1 = y, y2 = rY;
			else y1 = rY, y2 = y;
			if(!this.repaint) this.change(x1 - 8, y1 - 8, x2 + 8, y2 + 8);
			if(rMX) rX += rDX * fx;
			if(rMY) rY += rDY * fy;
			return;
		}
		}
	}

	this.toggle_zoom = () => {
		this.set_zoom(this.zoom == 2 ? 1 : 2)
	}

	this.set_zoom = (zoom) => {
		this.zoom = zoom
		this.display.style.width = `${(this.width * this.zoom)}px`
		this.display.style.height = `${(this.height * this.zoom)}px`
	}
}

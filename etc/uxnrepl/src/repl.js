'use strict'

let emulator
let ended = 0

const term_el = document.getElementById("term")
const editor_el = document.getElementById("editor")
const wst_el = document.getElementById("wst")
const run_el = document.getElementById("run")
const step_el = document.getElementById("step")
const save_el = document.getElementById("save")
const dump_el = document.getElementById("dump")
const examples_el = document.getElementById('examples')

const opcodes = [
	"LIT", "INC", "POP", "NIP", "SWP", "ROT", "DUP", "OVR",
	"EQU", "NEQ", "GTH", "LTH", "JMP", "JCN", "JSR", "STH",
	"LDZ", "STZ", "LDR", "STR", "LDA", "STA", "DEI", "DEO",
	"ADD", "SUB", "MUL", "DIV", "AND", "ORA", "EOR", "SFT"]

function assemble(query, program) {
	let emu_asm = new Emu()
	let rom_length = 0
	emu_asm.console.write = (char) => { program[rom_length++] = char }
	emu_asm.uxn.load(assembler).eval(0x0100)
	term_el.innerHTML = ""
	for (let i = 0; i < query.length; i++)
		emu_asm.console.input(query.charAt(i).charCodeAt(0), 1)
	emu_asm.console.input(0x0a, 2)
	emu_asm.console.input(0x00, 4)
	wst_el.innerHTML = `> ${emu_asm.console.stdout_body}`
	term_el.innerHTML = emu_asm.console.stderr_body
	term_el.scrollTop = term_el.scrollHeight;
	return rom_length
}

function make_opcode(byte) {
	if(byte == 0x00) return "BRK"
	if(byte == 0x20) return "JCI"
	if(byte == 0x40) return "JMI"
	if(byte == 0x60) return "JSI"
	if((byte & 0x1f) == 0) return "LIT" + (byte & 0x20 ? "2" : "") + (byte & 0x40 ? "r" : "")
	return opcodes[byte & 0x1f] + (byte & 0x20 ? "2" : "") + (byte & 0x80 ? "k" : "") + (byte & 0x40 ? "r" : "")
}

function status(v, run, step) {
	ended = v
	run_el.value = run
	if(step)
		step_el.value = step, step_el.style.display = "inline-block"
	else
		step_el.style.display = "none"
}

function setup() {
	let program = new Uint8Array(0x10000)
	let res = assemble(editor_el.value, program)
	emulator = new Emu()
	emulator.uxn.load(program).init()
	return res
}

function run() {
	let res = setup()
	if(!res) {
		wst_el.innerHTML = "Compilation failed."
		status(1, "Run", 0)
		return
	}
	emulator.uxn.eval(0x100)
	term_el.innerHTML += emulator.console.stdout_body
	if(emulator.console.stdout_body)
		term_el.scrollTop = term_el.scrollHeight;
	wst_el.innerHTML = emulator.uxn.wst.print()
	status(1, "Restart", "Step")
}

function step() {
	if(!emulator || ended) {
		let res = setup()
		if(!res) {
			wst_el.innerHTML = "Compilation failed."
			status(1, "Run", 0)
			return
		}
		ended = 0;
	}
	let opc = emulator.uxn.step()
	if(emulator.console.stdout_body)
		term_el.innerHTML = emulator.console.stdout_body
	term_el.scrollTop = term_el.scrollHeight;
	if(!opc) {
		status(1, "Restart", "Done")
		return;
	}
	wst_el.innerHTML = emulator.uxn.wst.print()
	status(0, "Finish", make_opcode(opc))
}

function save() {
	let program = new Uint8Array(0x10000)
	let length = assemble(editor_el.value.replace(/(\r\n|\n|\r|\t)/gm, " "), program)
	if(length) {
		let cropped = new Uint8Array(length)
		for(let i = 0; i < length; i++)
			cropped[i] = program[i]
		let blob = new Blob([cropped]);
		let blobUrl = URL.createObjectURL(blob);
		let link = document.createElement("a");
		link.href = blobUrl;
		link.download = "saved.rom"
		link.click()
		URL.revokeObjectURL(blobUrl)
		link.remove()
	}
}

function dump() {
	let program = new Uint8Array(0x10000)
	let length = assemble(editor_el.value.replace(/(\r\n|\n|\r|\t)/gm, " "), program)
	if(length) {
		let body = ""
		for(let i = 0; i < length; i++)
			body += `${program[i].toString(16).padStart(2, '0')}${(i + 1) % 0x10 ? ' ' : '\n'}`
		const popup = window.open('', 'Popup', 'width=400,height=300');
		popup.document.body.innerHTML = `<pre>${body}</pre>`;
	}
}

// Editor

document.body.className = "active"

run_el.addEventListener("click", run)
step_el.addEventListener("click", step)
save_el.addEventListener("click", save)
dump_el.addEventListener("click", dump)

editor_el.addEventListener("keydown", (e) => {
	let { keyCode } = e
	let { value, selectionStart, selectionEnd } = editor
	if (keyCode === 9) { // TAB = 9
		e.preventDefault()
		editor.value = value.slice(0, selectionStart) + "\t" + value.slice(selectionEnd);
		editor.setSelectionRange(selectionStart+1, selectionStart+1)
	}
	else if (event.ctrlKey && event.key === 'Enter')
		run();
	if(!ended)
		status(1, "Restart", "Step")
});

examples_el.addEventListener('change', (e) => {
	editor_el.value = examples[e.currentTarget.value]
	term_el.innerHTML = `Press <b>Run</b> to evaluate.`
	status(1, "Run", "Step")
}, true);

// Populate dropdown

Object.keys(examples).forEach(item => {
	const option = document.createElement('option');
	option.value = item;
	option.textContent = item;
	examples_el.appendChild(option);
})

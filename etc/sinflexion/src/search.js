'use strict'

let db = {en:{}, lo:{}, groups: {}, group:{}, types: [], warnings: 0}

function make_lo_seg(word) {
	let res = []
	let last = ""
	let letters = word.split('')
	// Combine repeated letters
	letters.forEach((letter, id) => {
		if(last != letter || letter == ' ' || letter == '.')
			res.push(letter), last = letter
	})
	// Unless it's a motule
	if(res.length < 4) {
		if(is_vowel(res[res.length-1])) {
			if(res.length < 3)
				return `${res.join('')}`
			if(!is_vowel(res[0]))
				return `${res.join('')}`
		}
	}
	// Pop ending vowels
	while(is_vowel(res[res.length-1])) 
		res.pop()
	return `${res.join('')}`
}

function make_lo(word) {
	let res = ""
	word.split(' ').forEach((seg) => {
		res += make_lo_seg(seg)+' '
	})
	return res.trim()
}

function make_def(val, note) {
	let res = val
	if(note) res += ` (${note})`
	return res
}

function find_copy(ar, val) {
	let res = 0
	ar.forEach((v) => {
		if(v == val) res = 1; })
	return res
}

function push_word(dict, key, type, val, note) {
	if(!db[dict][key]) db[dict][key] = {}
	if(!db[dict][key][type]) db[dict][key][type] = []
	// Check duplicate
	if(find_copy(db[dict][key][type], val))
		db.warnings++, console.warn(`Duplicate: ${key} -> ${val}`)
	db[dict][key][type].push(make_def(val, note))
}

dict.split('\n').forEach((value) => {
	if(!value) return
	let seg = value.split('[')
	let key = seg[0].trim().toLowerCase()
	let res = seg[1].split(']')
	let type = res[0].trim()
	let vals = res[1].split(';')
	if(!type) { 
		console.warn(`Missing type: ${res[1]}, ${key}.`)
		db.warnings++, type = '_'
	}
	vals.forEach((val) => {
		let v = val.trim()
		let note = ""
		if(v.indexOf('(') >= 0) {
			note = v.split('(')[1].split(')')[0]
			v = v.replace(`(${note})`, '').trim()
		}
		push_word("en", key, type, make_lo(v), note)
		push_word("lo", make_lo(v), type, key, note)
		if(!db.groups[note]) db.groups[note] = []
		db.groups[note].push(make_lo(v))
		db.group[key] = note
		if(!db.types[type]) db.types[type] = 0
		db.types[type]++
	})
})

console.log(`${db.warnings} warnings.`)

let en_keys = Object.keys(db.en)
let lo_keys = Object.keys(db.lo)

document.getElementById("info").innerHTML = `${en_keys.length + lo_keys.length} vocabul`

function print_entry(a,b,c) {
	let res = ""
	if(b != '_')
		res += `<li><b>${a}</b>[${b}]: ${c} </li>`
	else
		res += `<li><b>${a}</b>: ${c} </li>`
	return res
}

function is_vowel(letter) {
	return letter == 'a' || letter == 'e' || letter == 'i' || letter == 'o' || letter == 'u'
}

function print_term(t, lang, a, b) {
	let res = ""
	Object.keys(db[lang][t]).forEach((k) => { 
		res += `${a}<b>${t}</b>[${k}]: `
		db[lang][t][k].forEach((v, id) => {
			res += `${v}`
			if(id < db[lang][t][k].length -1)
				res += `, `
		})
		res += `${b}` 
	})
	return res
}

function dump() {
	let res = ""
	Object.keys(db.lo).sort().forEach((k) => { 
		res += `${k}\n`
		Object.keys(db.lo[k]).sort().forEach((t) => { 
			res += `\t[${t}] `
			db.lo[k][t].forEach((w, id) => {
				res += `${w}`
				res += id < db.lo[k][t].length - 1 ? ', ' : ''
			})
			res += `\n`
		})
	})
	console.log(res)
}

function search_term(target) {
	let res = ""
	if(target=="___") {
		dump()
		return
	}
	// Perfect matches
	if(db.en[target])
		res += print_term(target, 'en', '<p>Angl: ', '</p>')
	if(db.lo[target])
		res += print_term(target, 'lo', '<p>Lø: ', '</p>')
	// Group
	if(db.en[target] && db.group[target]) {
		let in_family = db.groups[db.group[target]]
		res += `<p><i>${db.group[target]}</i>: `
		in_family.forEach((key, id) => {
			res += `<a href='#${key}'>${key}</a>`
			res += id < in_family.length - 1 ? `, ` : `.`	
		})
		res += `</p>`
	}
	// English
	let res_a = ""
	en_keys.sort().forEach((k) => {
		if(k.indexOf(target) >= 0 && k != target) 
			res_a += print_term(k, 'en', '<li>', '</li>') })
	if(res_a !== "")
		res += `<p><i>Angl/Latin</i></p><ul>${res_a}</ul>`
	// Latin
	let res_b = ""
	lo_keys.sort().forEach((k) => {
		if(k.indexOf(target) >= 0 && k != target)
			res_b += print_term(k, 'lo', '<li>', '</li>') })
	if(res_b !== "")
		res += `<p><i>Lø/Angl</i></p><ul>${res_b}</ul>`
	if(!res)
		res += `<p>Il es <b>nul respons</b> pro quaer "${target}", tent un alter vocabul.</p>`
	document.getElementById("result").innerHTML += res
}

function run_search(target) {
	if (!target.length) return
	window.location.hash = target.replaceAll(" ", "+")
	document.getElementById("search").value = target
	document.getElementById("result").innerHTML = ""	
	target.toLowerCase().replaceAll(",","").replaceAll("!","").replaceAll("?","").replaceAll(".","").trim().split(" ").forEach(search_term)
}

// Connect interface
document.getElementById("search").addEventListener("keyup", (event) => {
	if (event.key === "Enter") run_search(event.target.value.toLowerCase())
});

document.getElementById("button").onclick = (event) => {
	run_search(document.getElementById("search").value.toLowerCase())
}

// Read anchor tag on start
if (window.location.hash.substring(1))
	run_search(window.location.hash.replaceAll("+", " ").substring(1))

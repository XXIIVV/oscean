'use strict'

let db = {en:{}, lo:{}}

function make_lo_seg(word){
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

function push_word(dict, key, type, val, note) {
	if(!db[dict][key]) db[dict][key] = {}
	if(!db[dict][key][type]) db[dict][key][type] = []
	db[dict][key][type].push(make_def(val, note))
}

let warnings = 0

dict.split('\n').forEach((value) => {
	if(!value) return
	let seg = value.split('[')
	let key = seg[0].trim().toLowerCase()
	let res = seg[1].split(']')
	let type = res[0].trim()
	let vals = res[1].split(';')
	if(!type) { 
		console.warn(`Missing type: ${res[1]}, ${key}.`)
		warnings++, type = '_'
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
	})
})

if(warnings > 0)
	console.log(`${warnings} warnings.`)

let en_keys = Object.keys(db.en)
let lo_keys = Object.keys(db.lo)

document.getElementById("info").innerHTML = `${en_keys.length + lo_keys.length} traductions`

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

function print_term(t, lang) {
	let res = ""
	Object.keys(db[lang][t]).forEach((k) => { 
		res += `<li><b>${t}</b>[${k}]: `
		db[lang][t][k].forEach((v, id) => {
			res += `${v}`
			if(id < db[lang][t][k].length -1)
				res += `, `
		})
		res += `</li>` 
	})
	return res
}

function dump() {
	let res = ""
	lo_keys.sort().forEach((key) => {
		let lo = make_lo(key)
		res += lo != key ? `${lo}, ${key}\n` : `${lo}\n`
		db.lo[key].sort().forEach((val) => {
			res += `	${val}\n` })
	})
	console.log(res)
}

function search_term(target) {
	if(target == "__dump") return dump()
	let res = ""
	// English
	let res_a = ""
	if(db.en[target])
		res_a += print_term(target, 'en')
	en_keys.forEach((k) => {
		if(k.indexOf(target) >= 0 && k != target) 
			res_a += print_term(k, 'en') })
	if(res_a !== "")
		res += `<li><i>Angl/Latin</i></li><ul>${res_a}</ul>`
	// Latin
	let res_b = ""
	if(db.lo[target])
		res_b += print_term(target, 'lo')
	lo_keys.forEach((k) => {
		if(k.indexOf(target) >= 0 && k != target)
			res_b += print_term(k, 'lo') })
	if(res_b !== "")
		res += `<li><i>Lø/Angl</i></li><ul>${res_b}</ul>`
		
	if(!res)
		res += `<p>Il es <b>nul respons</b> pro quaer "${target}", tent un alter verb.</p>`
	res += '<br />'
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

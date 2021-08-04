import { Unit } from './unit.js'
window.Unit = Unit

// // parse a SI expression like '{number} {prefix}{unit}' or '{100} {milli}{meters}'
// var p = Object.keys(prefixes).join('|')
// var u = Object.keys(units).join('|')
// const expression = RegExp(`([0-9]+) ?(?:(${p})?((${u})s?))`)
// const parseSI = str => {
// 	var exec = expression.exec(str)
// 	if(exec == null || exec.length <= 1) return { found: false }
// 	var result = { 
// 		found: true,
// 		number: Number(exec[1]) * (prefixes[exec[2]] || 1),
// 		unit: units[exec[exec.length - 1]] | null
// 	}
// 	if(result.unit == 'gram') {
// 		result.unit = 'kilogram'
// 		result.number /= 1000
// 	}
// 	return result
// }

// const parse = expr => {
// 	// regex?????????
// 	expr = expr.replaceAll('to', '→') // chars are easier to regex than words
// 	expr = expr.split(/(?=\+|\-|\*|\/|→)|(?<=\+|\-|\*|\/|→)/gi)
// 	expr = expr.map(e => e.trim())
// 	// todo: manual checks
// 	// foot: 0.3048 meter
// 	// mile: 1609.34 meter
// 	// pound: 0.453592 kilogram
// 	// ounce: 0.00283495 kilogram
// 	// horsepower: 745.7 watt
// 	// ton: 1000 kilogram
// 	console.log('expression: ', expr)
// 	var SI = parseSI(expr[1])
// 	return SI
// }

// // ''
// function recursiveSplit(list, chars) {
// 	list = [list]
// 	var currentChar = 'NULL'
// 	for (currentChar of chars) {
// 		console.log('cur: ', currentChar, 'list: ', list)
// 	}
// 	return list
// }

// var inputEl = document.querySelector('.input')
// var outputEl = document.querySelector('.output')

// const doKeypress = () => {
// 	var output = parse(inputEl.textContent)
// 	outputEl.textContent = JSON.stringify(output)
// 	if(output.found)
// 		output = output.number + ' ' + output.unit
// 	else output = 'error'
	
// }

// doKeypress()
// document.addEventListener('keyup', doKeypress)
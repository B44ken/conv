import { Factor } from './unit.js'
import { Calculator, CalcError } from './calc.js'

const calc = new Calculator({ 'precision': 1e-5 })

let settings = {
    precision: 1e-5,
    properSigFigs: false
}

const arg = process.argv[2]
try {
	console.log(calc.doLine(arg))
} catch(error) {
	if(error instanceof CalcError)
		console.error("error: " + error.message)
	else throw error
}

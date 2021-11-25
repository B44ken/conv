export const prefixes = {
	yotta: 1e+24,
	zetta: 1e+21,
	exa: 1000000000000000000,
	peta: 1000000000000000,
	tera: 1000000000000,
	giga: 1000000000,
	mega: 1000000,
	kilo: 1000,
	hecto: 100,
	deca: 10,
	micro: 0.000001,
	deci: 0.1,
	centi: 0.01,
	milli: 0.001,
	nano: 1e-9,
	pico: 1e-12,
	femto: 1e-15,
	atto: 1e-18,
	zepto: 1e-21,
	yocto: 1e-24,
}

const unit = (derived, scale = 1) => {
	var unitObject = { ..._, SCALE: scale }
	for (const part of derived.split(" ")) {
		var [name, amount] = part.split('^')
		if (amount) amount = parseInt(amount)
		else amount = 1
		unitObject[name] = amount
	}
	return unitObject
}

// the base unit so we don't have to keep recording zeroes
// all SI base units plus B, for bit
// unitName: [ factor w/ si equivalent, si derivation ]
const _ = { m: 0, s: 0, mol: 0, A: 0, K: 0, cd: 0, kg: 0, b: 0 }
export const units = {
	_,
	"meter": [1, { ..._, "m": 1 }],
	"second": [1, { ..._, "s": 1 }],
	"amp": [1, { ..._, "A": 1 }],
	"kelvin": [1, { ..._, "K": 1 }],
	"mole":	[1, { ..._, "mol": 1 }],
	"hertz": [1, { ..._, "s": -1 }],
	"watt": [1, { ..._, "kg": 1, "m": 2, "s": -3 }],
	"volt": [1, { ..._, "kg": 1, "m": 2, "s": -3, "A": -1 }],
	"newton": [1, { ..._, "kg": 1, "m": 1, "s": -2 }],
	"pascal": [1, { ..._, "kg": 1, "m": -1, "s": -2 }],
	"joule": [1, { ..._, "kg": 1, "m": 2, "s": -2 }],
	"coulomb": [1, { ..._, "s": -1, "A": 1 }],
	"bit": [1, { ..._, "b": 1 }],
	"byte": [8, { ..._, "b": 1 }],

	// SI must be listed first so reverseFactor finds them first - bad code?
	"mile": [1609.344, { ..._, "m": 1 }],
	"yard": [0.9144, { ..._, "m": 1 }],
	"foot": [0.3048, { ..._, "m": 1 }],
	"inch": [0.0254, { ..._, "m": 1 }],
	"pound": [0.45359237, { ..._, "kg": 1 }],
	"ounce": [0.028349523125, { ..._, "kg": 1 }],
	"gallon": [3.785411784, { ..._, "m": 3 }],
	"quart": [0.946352946, { ..._, "m": 3 }],
	"pint": [0.473176473, { ..._, "m": 3 }],
	"cup": [0.2365882365, { ..._, "m": 3 }],
	"gram": [0.001, { ..._, "kg": 1 }],
	"minute": [60, { ..._, "s": 1 }],
	"hour": [3600, { ..._, "s": 1 }],
	"poundal": [0.138254954376, { ..._, "kg": 1, "m": 1, "s": -2 }],	
	"psi": [6894.75729317, { ..._, "kg": 1, "m": -1, "s": -2 }],
}


// take a derivation like { m: 1 } and turn it into a unit name like 'meter'
export const reverseFactor = (derived) => {
	// loop through existing names (meter, volt, etc.)
	for (var u in units) {
		if (JSON.stringify(units[u][1]) == JSON.stringify(derived) && u != '_') {
			return u
		}
	}

	// if not, make a derived name like m/s = (m^1 s^1)
	var derivedName = ''
	for (u in derived) {
		if (derived[u] == 0) continue
		derivedName += u + '^' + derived[u] + ' '
	}
	return derivedName.trim()
}
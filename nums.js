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
	var unitObject = { ..._ }
	for (const part of derived.split(" ")) {
		var [name, amount] = part.split('^')
		if (amount) amount = parseInt(amount)
		else amount = 1
		unitObject[name] = amount
	}
	return unitObject
}

// the base unit so we don't have to keep recording zeroes 
const _ = { m: 0, s: 0, mol: 0, A: 0, K: 0, cd: 0, kg: 0 }
export const units = {
	_,
	gram: unit('kg', 0.001),
	meter: unit('m'),
	second: unit('s'),
	amp: unit('A'),
	kelvin: unit('K'),
	mole: unit('mol'),
	hertz: unit('s^-1'),
	watt: unit('kg m^2 s^-3'),
	volt: unit('m^2 s^-3 kg A^-1'),
	newton: unit('kg m s^-2'),
	pascal: unit('kg m^-1 s^-2'),
	joule: unit('kg m^2 s^-2'),
	coulomb: unit('A s^-1'),
	mile: unit('m', 1609.34),
	minute: unit('s', 60),
	hour: unit('s', 3600)
}


// take a derivation like { m: 1 } and turn it into a unit name like 'meter'
export const reverseFactor = (derived) => {
	// loop through existing names (meter, volt, etc.)
	for (var u in units) {
		if (JSON.stringify(units[u]) == JSON.stringify(derived) && u != '_') {
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
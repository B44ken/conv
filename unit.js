import { prefixes, units, reverseUnit } from './nums.js'

export class Unit {
    constructor(number=1, derived=units._) {
        this.number = number
        if (typeof derived == "string") {
            this.derived = Object.assign(units._, units[derived])
            this.name = derived
        }
        else {
            this.derived = derived
            this.name = reverseUnit(derived)
        }
    }

    static fromString(str) {
        var unit = new Unit()

        var p = Object.keys(prefixes)
        var u = Object.keys(units)
        const regex = RegExp(`([0-9\.]+)? ?(?:(${p.join('|')})?((${u.join('|')})s?))`)
	    var exec = regex.exec(str)

        for(const part of exec) {
            if (part == exec[1]) {
                unit.number = Number(part)
            }
            else if(p.includes(part)) {
                var x = new Unit(prefixes[part])
                unit = unit.multiply(x)
            }
            else if(u.includes(part)) {
                unit = new Unit(unit.number, units[part])
            }
        }

        unit.rename()
        return unit
    }

    rename() {
        this.name = 'unit name'
    }

    multiply(newUnit) {
        var product = new Unit(1, newUnit.units)
        for(var u in this.units) {
            product.units[u] += this.units[u]
        }
        return product
    }

    divide(newUnit) {
        var quot = new Unit(this.number * newUnit.number, this.derived)
        for(var base of Object.keys(newUnit.derived))
            quot.derived[base] += newUnit.derived[base]
        this.rename()
        return quot
    }
}
import { prefixes, units, reverseUnit } from './nums.js'

export class Unit {
    constructor(number=1, derived={ ...units._ }) {
        this.number = number
        if (typeof derived == "string") {
            this.derived = { ...units._, ...units[derived] }
            this.name = derived
        }
        else {
	        var derived = { ...units._, ...derived }
            this.derived = derived
            this.name = this.unitName(this.derived)
        }
    }

    static fromString(str) {
        var unit = new Unit()

        var p = Object.keys(prefixes)
        var u = Object.keys(units)
        const regex = RegExp(`([0-9\.]+)? ?(?:(${p.join('|')})?((${u.join('|')})s?))`)
	    var exec = regex.exec(str)

        if(exec == null) {
            var num = Number(str)
            if(isNaN(num)) 
                return null
            if(str == '')
                return new Unit() 
            return new Unit(num)

        }

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

        return unit
    }

    unitName() {
        return reverseUnit(this.derived)
    }

    print() {
        return this.number + ' ' + reverseUnit(this.derived)
    }

    multiply(newUnit) {
        var num = this.number * newUnit.number
        var derived = { ...units._ }
        var product = new Unit(num, derived)
        for(var u in { ...units._ }) {
            product.derived[u] = this.derived[u] + newUnit.derived[u]
        }
        return product
    }

    divide(newUnit) {   
        var quot = new Unit(this.number / newUnit.number, this.derived)
        for(var base of Object.keys(newUnit.derived))
            quot.derived[base] -= newUnit.derived[base]
        return quot
    }

    add(newUnit) {
        var derived1 = JSON.stringify(this.derived)
        var derived2 = JSON.stringify(newUnit.derived)
        if(derived1 == derived2) {
            newUnit.number += this.number
            return newUnit
        }
        return null
    }
    subtract(newUnit) {
        var derived1 = JSON.stringify(this.derived)
        var derived2 = JSON.stringify(newUnit.derived)
        if(derived1 == derived2) {
            newUnit.number = this.number - newUnit.number
            return newUnit
        }
        return null
    }
}

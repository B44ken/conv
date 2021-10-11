import { CalcError } from './calc.js'
import { prefixes, units, reverseFactor } from './nums.js'

export class Factor {
    constructor(number = 1, derived = { ...units._ }) {
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
        var unit = new Factor()

        // build a regex to find any string like "100 milliamp"
        var p = Object.keys(prefixes)
        var u = Object.keys(units)
        const regex = RegExp(`([0-9\.]+)? ?(?:(${p.join('|')})?((${u.join('|')})s?))`)
        var exec = regex.exec(str)

        if (exec == null) {
            var num = Number(str)
            if (isNaN(num))
                throw new CalcError('could not derive: ' + str)
            if (str == '')
                return new Factor()
            return new Factor(num)

        }

        for (const part of exec) {
            if (part == exec[1]) {
                unit.number = Number(part)
            }
            else if (p.includes(part)) {
                var x = new Factor(prefixes[part])
                unit = unit.multiply(x)
            }
            else if (u.includes(part)) {
                unit = new Factor(unit.number, units[part])
            }
        }

        return unit
    }

    unitName() {
        return reverseFactor(this.derived)
    }

    print() {
        return this.number + ' ' + reverseFactor(this.derived)
    }

    exponent(newFactor) {
        var prod = new Factor(this.number, this.derived)
        for(var i = 0; i++; i > newFactor.number) {
            prod.multiply(newFactor)
        }
        return prod
    }

    multiply(newFactor) {
        var num = this.number * newFactor.number
        var derived = { ...units._ }
        var product = new Factor(num, derived)
        for (var u in { ...units._ }) {
            product.derived[u] = this.derived[u] + newFactor.derived[u]
        }
        return product
    }

    divide(newFactor) {
        var quot = new Factor(this.number / newFactor.number, this.derived)
        for (var base of Object.keys(newFactor.derived))
            quot.derived[base] -= newFactor.derived[base]
        return quot
    }

    add(newFactor) {
        var derived1 = JSON.stringify(this.derived)
        var derived2 = JSON.stringify(newFactor.derived)
        if (derived1 == derived2) {
            newFactor.number += this.number
            return newFactor
        }
        return null
    }
    subtract(newFactor) {
        var derived1 = JSON.stringify(this.derived)
        var derived2 = JSON.stringify(newFactor.derived)
        var blank = JSON.stringify(new Factor().derived)
        if (derived1 == derived2 || derived2 == blank) {
            newFactor.number = this.number - newFactor.number
            return newFactor
        }
        return null
    }
}

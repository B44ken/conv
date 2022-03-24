import { CalcError } from './calc.js'
import { prefixes, units, reverseFactor } from './nums.js'

export class Factor {
    constructor(number = 1, derived = { ...units._ }, precision = undefined) {
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

        if (precision) this.precision = precision
    }

    static fromString(str) {
        var unit = new Factor()

        // build a regex to find any string like "100 milliamp"
        var p = Object.keys(prefixes).join('|')
        var u = Object.keys(units).join('|')
        const regex = RegExp(`^([0-9\.]+)? ?(?:(${p})?((${u})?)?)s?$`)
        var exec = regex.exec(str)

        if (!exec) throw new CalcError("could not derive: " + str)

        unit.number = Number(exec[1]) || 1
        var unitName = exec[3]
        if(exec[2]) unit.number = unit.number * prefixes[exec[2]]

        // special case (hack?)
        if(exec[2] && exec[2] == "M") 
            return new Factor(unit.number / 1000000, {m: 1})

        if(unitName) {
            if(!units[unitName])
                throw new CalcError("unknown unit: " + unitName)
            unit.number *= units[unitName][0]
            unit.derived = units[unitName][1]
        }
        
        return unit
    }

    unitName() {
        return reverseFactor(this.derived)
    }

    print(precision) {
        // round and delete trailing zeros
        var num = this.number.toFixed(5).replace(/0+$/, '').replace(/\.$/, '')
        return num + ' ' + reverseFactor(this.derived)
    }

    exponent(newFactor) {
        var exp = new Factor(this.number ** newFactor.number)
        for(var u in exp.derived)
            exp.derived[u] = this.derived[u] * newFactor.number
        return exp
    }

    multiply(newFactor) {
        var prod = new Factor(this.number * newFactor.number)
        for(var u in prod.derived)
            prod.derived[u] = this.derived[u] + newFactor.derived[u]
        return prod
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

    getPrecision() {
        var num = this.number.toString()
        var dec = num.indexOf('.')
        if (dec < 0) return 0
        return num.length - dec - 1
    }
}

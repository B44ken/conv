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
            derived = { ...units._, ...derived }
            this.derived = derived
            this.name = this.unitName(this.derived)
        }

        if (precision) this.precision = precision
    }

    static fromString(str) {
        let unit = new Factor()

        // build a regex to find any string like "100 milliamp"
        let p = Object.keys(prefixes).join('|')
        let u = Object.keys(units).join('|')
        const regex = RegExp(`^([0-9\.]+)? ?(?:(${p})?((${u})?)?)s?$`)
        let exec = regex.exec(str)

        if (!exec) throw new CalcError("could not derive: " + str)

        unit.number = Number(exec[1])
        if(isNaN(unit.number)) unit.number = 1

        let unitName = exec[3]
        if(exec[2]) unit.number = unit.number * prefixes[exec[2]]

        // corrections (hack?)
        if(exec[2] && exec[3] == undefined) {
            if(exec[2] == "G") return new Factor(unit.number / 1000000000000, {kg: 1})
            if(exec[2] == "M") return new Factor(unit.number / 1000000, {m: 1})
            if(exec[2] == "K") return new Factor(unit.number / 1000, {K: 1})
        }

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
        let num = this.number.toFixed(5).replace(/0+$/, '').replace(/\.$/, '')
        return num + ' ' + reverseFactor(this.derived)
    }

    exponent(newFactor) {
        let exp = new Factor(this.number ** newFactor.number)
        for(let u in exp.derived)
            exp.derived[u] = this.derived[u] * newFactor.number
        return exp
    }

    multiply(newFactor) {
        let prod = new Factor(this.number * newFactor.number)
        for(let u in prod.derived)
            prod.derived[u] = this.derived[u] + newFactor.derived[u]
        return prod
    }

    divide(newFactor) {
        let quot = new Factor(this.number / newFactor.number, this.derived)
        for (let base of Object.keys(newFactor.derived))
            quot.derived[base] -= newFactor.derived[base]
        return quot
    }

    add(newFactor) {
        let derived1 = JSON.stringify(this.derived)
        let derived2 = JSON.stringify(newFactor.derived)
        if (derived1 == derived2) {
            newFactor.number += this.number
            return newFactor
        }
        return null 
    }
    subtract(newFactor) {
        let derived1 = JSON.stringify(this.derived)
        let derived2 = JSON.stringify(newFactor.derived)
        let blank = JSON.stringify(new Factor().derived)
        if (derived1 == derived2 || derived2 == blank) {
            newFactor.number = this.number - newFactor.number
            return newFactor
        }
        return null
    }

    getPrecision() {
        let num = this.number.toString()
        let dec = num.indexOf('.')
        if (dec < 0) return 0
        return num.length - dec - 1
    }
}

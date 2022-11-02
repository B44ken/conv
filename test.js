// test suite is automatically run
// s.test(test case name, value to put into calculator, expected result)

import { Calculator } from './calc.js' 

class TestSuite {
    constructor() {
        this.calc = new Calculator()
        this.results = []
    }
    test(name, input, expected) {
        try {
            let result = this.calc.doLine(input).trim()
            if(result == expected) {
                this.results[name] = { input, expected, result, error: null }
            } else {
                this.results[name] = { input, expected, result, error: "Wrong" }
            }
        } catch(error) {
            this.results[name] = { input, expected, result: null, error }
        }
    }
    summary() {
        let bad = {}
        for(const key of Object.keys(this.results)) {
            const item = this.results[key]
            if(item.error) bad[key] = item
        }
        
        if(Object.keys(bad).length == 0) {
            console.log("All tests OK!")
        } else {
            console.table(bad)
        }
    }
}

let s = new TestSuite()

// s.test('error on purpose',    'garbage',          '')
s.test('unit declaration',  '1 amp',       '1 amp')
s.test('addition',          '1 + 1',       '2')
s.test('multiplication',    '1 * 1',       '1')
s.test('power',             '2 ^ 3',       '8')
s.test('imperial',          '1 mile',      '1609.344 meter')
s.test('variable',          'let = 3',     '3')
s.test('variable usage',    'let + 2',     '5')
s.test('power of unit',     '1 meter^2',   '1 m^2')
s.test('compounding units', '1 N / M^2',   '1 pascal')
s.test('simple bedmas',     '2 + 4*2',     '10')
s.test('KG is kilogram',    '5 KG',        '5 kilogram')
s.test('K is kelvin',       '5 K',         '5 kelvin')
s.test('MPa is megapascal', '2 MPa',       '2000000 pascal')
s.test('brackets exist',    '(8)',         '8')
s.test('brackets work',     '(2 + 4) * 4', '24')
s.test('nested brackets',   '(((1)/2)*4)', '2') 
s.test('unit cohesion',     'M*M + M*M',   '2 m^2')

s.summary()

export const testSuite = s

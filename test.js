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
            var result = this.calc.doLine(input).trim()
            if(result == expected) {
                this.results.push({ name, input, expected, result, error: null })
            } else {
                this.results.push({ name, input, expected, result, error: "Wrong" })
            }
        } catch(error) {
            this.results.push({ name, input, expected, result: null, error })
        } finally {

        }
    }
    summary() {
        var bad = this.results.filter(e => e.error != null)
        if(bad.length == 0) { console.log("All tests passed!") }
        return console.table(bad)
    }
}

var s = new TestSuite()

// s.test('error on purpose',    'garbage',          '')
// s.test('wrong on purpose',    '1',                '2')

s.test('metric declaration',  '1 amp',            '1 amp')
s.test('addition',            '1 + 1',            '2')
s.test('multiplication',      '1 * 1',            '1')
s.test('power',               '2 ^ 3',            '8')
s.test('imperial',            '1 mile',           '1609.344 meter')
s.test('variable',            'var = 3',          '3')
s.test('variable usage',      'var + 2',          '5')
s.test('power of unit',       '1 meter^2',        '1 m^2')
s.test('compounding units',   '1 newton / M^2',   '1 pascal')
s.test('simple bedmas',       '2 + 4*2',          '10')
s.test('KG is kilogram',      '5 KG',             '5 kilogram')
s.test('K is kelvin',         '5 K',              '5 kelvin')
s.test('MPa is megapascal',   '2 MPa',            '2000000 pascal')
s.test('brackets exist',      '(8)',              '8')
s.test('brackets work',       '4 * (2 + 2)',      '16')

s.summary()

export const testSuite = s

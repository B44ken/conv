// test suite is automatically run
// s.doTest(test case name, value to put into calculator, expected result)

import { Calculator } from './calc.js' 

class TestSuite {
    constructor() {
        this.calc = new Calculator()
        this.results = []
    }
    doTest(name, input, expected) {
        try {
            var result = this.calc.doLine(input).trim()
        } catch(error) {
            this.results.push({ name, input, expected, result: null, error })
        } finally {
            if(result == expected)
                this.results.push({ name, input, expected, result, error: null })
            else
                this.results.push({ name, input, expected, result, error: "Wrong" })
        }
    }
    summary() {
        var bad = this.results.filter(e => e.error != null)
        if(bad.length == 0) { console.log("All tests passed!") }
        return console.table(bad)
    }
}

var s = new TestSuite()

s.doTest('metric declaration',      '1 amp',              '1 amp')
s.doTest('addition',                '1 + 1',              '2')
s.doTest('multiplication',          '1 * 1',              '1')
s.doTest('power',                   '2 ^ 3',              '8')
s.doTest('imperial declaration',    '1 mile',             '1609.344 meter')
s.doTest('variable assignment',     'var = 3',            '3')
s.doTest('variable usage',          'var + 2',            '5')
s.doTest('power of unit',           '1 meter^2',          '1 m^2')
s.doTest('compounding units',       '1 newton / meter^2', '1 pascal')
s.doTest('simple bedmas',           '2 + 4*2',            '10')

s.summary()

export const testSuite = s

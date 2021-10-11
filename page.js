import { Factor } from './unit.js'
import { Calculator, CalcError } from './calc.js'
import { TEST } from './test.js'

window.Factor = Factor
window.Calculator = Calculator
window.CalcError = CalcError
window.TEST = TEST


var calc = new Calculator({
    'precision': 1/0.0001
})

const input = document.querySelector('.input')
const output = document.querySelector('.output')

output.textContent = calc.doLine(input.textContent)

document.addEventListener('keyup', () => {
    
    try {
        var res = calc.doLine(input.textContent)
        output.textContent = res
    } catch(error) {
        if(error.name != "CalcError")
            console.error(error)
        output.textContent = 'error: ' + error.message
    }
    
})
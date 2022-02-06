import { Factor } from './unit.js'
import { Calculator, CalcError } from './calc.js'
import { testSuite } from './test.js'

window.Factor = Factor
window.Calculator = Calculator
window.CalcError = CalcError
window.testSuite = testSuite


window.calc = new Calculator({ 'precision': 1e-5 })

const input = document.querySelector('.input')
const output = document.querySelector('.output')

output.textContent = calc.doLine(input.textContent)

document.addEventListener('keyup', () => {
    calc = new Calculator({ 'precision': 1e-5 })
    try {
        var res = ""
        var cleanInput = input.innerText.split('\n').filter(e=> e != '')
        for(const line of cleanInput) {
            res += calc.doLine(line) + '<br>'
        }
        output.innerHTML = res
    } catch(error) {
        if(error.name != "CalcError")
            console.error(error)
        output.textContent = 'error: ' + error.message
    }
})
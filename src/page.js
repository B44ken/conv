import { Unit } from './unit.js'
import { Calculator } from './calc.js'

window.Unit = Unit
window.Calculator = Calculator

var calc = new Calculator()

const input = document.querySelector('.input')
const output = document.querySelector('.output')

output.textContent = calc.doLine(input.textContent)

document.addEventListener('keyup', () => {
    output.textContent = calc.doLine(input.textContent)
})
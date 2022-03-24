import { Factor } from './unit.js'
import { Calculator, CalcError } from './calc.js'
import { testSuite } from './test.js'

// makes my life a bit easier when debugging
window.Factor = Factor
window.Calculator = Calculator
window.CalcError = CalcError
window.testSuite = testSuite
window.calc = new Calculator({ 'precision': 1e-5 })

const input = document.querySelector('.input')
const output = document.querySelector('.output')

var currentSelected = null
const manageTab = name => {
    const button = document.getElementsByClassName(name + '-button')[0]
    const content = document.getElementsByClassName(name + '-tab')[0]
    button.addEventListener("click", event => {
        if(currentSelected) currentSelected.style.display = "none"
        currentSelected = content
        content.style.display = "block"
    })
}

manageTab('settings')
manageTab('formulas')
manageTab('close')

var settings = {
    precision: 1e-5,
    properSigFigs: false
}

document.getElementById("settings-proper").addEventListener("change", event => {
    settings.properSigFigs = event.target.checked
})

const doInput = () => {
    calc = new Calculator(settings)
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
}

document.addEventListener('keyup', doInput)

var search = decodeURI(document.location.search).replace('?', '').replaceAll(':','\n')
if(search) input.innerText = search
doInput()
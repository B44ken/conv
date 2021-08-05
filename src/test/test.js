// rough manually checked test
// todo: automate?

import { Unit } from '../unit.js'
window.Unit = Unit

var s3 = new Unit(3, { s: 1 })
console.log('make a new unit from object:', s3)

var a15 = new Unit(1.5, 'amp')
console.log('make a new unit from string', a15)

var as45 = a15.multiply(s3)
console.log('multiply the two units: ', as45)

var m1 = new Unit(1, 'meter')
console.log('make another unit from string', m1)

var ms2 = new Unit(1, {m: 1, s: 1})
console.log('make nonstandard unit: ', ms2)
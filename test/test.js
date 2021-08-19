import { Factor } from '../unit.js'
window.Factor = Factor

var s3 = new Factor(3, { s: 1 })
console.log('make a new unit from object:', s3)

var a15 = new Factor(1.5, 'amp')
console.log('make a new unit from string', a15)

var as45 = a15.multiply(s3)
console.log('multiply the two units: ', as45)

var m1 = new Factor(1, 'meter')
console.log('make another unit from string', m1)

var ms2 = new Factor(1, {m: 1, s: 1})
console.log('make nonstandard unit: ', ms2)

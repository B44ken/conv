import { Unit } from './unit.js'

var seconds3 = new Unit(3, { s: 1 })
console.log('make a new unit from object:', seconds3)

var amp15 = new Unit(1.5, 'amp')
console.log('make a new unit from string', amp15)

amp15.multiply(seconds3)
console.log('multiply the two units: ', amp15)

var meter1 = new Unit(1, 'meter')
console.log('make another unit from string', meter1)
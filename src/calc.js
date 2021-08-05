import { Unit } from './unit.js'

const operations = ['+', '-', '/', '*']

// todo: rearrange for order of operations
export class Calculator {
    constructor(vars) {
        this.vars = vars || {}
        this.vars.g = 9.81
    }

    doLine(exp) {
        exp = this.tokenize(exp)
        exp = this.parse(exp)
        exp = this.evaluate(exp)
        return exp
    }

    tokenize(line) {
        var splits = [...operations]
        for(var char of splits)
            line = line.replaceAll(char, ';' + char + ';')
        line = line.split(';').map(e => e.trim())
        return line
    }

    parse(tokens) {
        for(var t in tokens) {
            const tt = tokens[t]
            if(operations.includes(tt))
                continue
            else if(this.vars[tt]) 
                tokens[t] = Unit.fromString(this.vars[tt])                
            else
                tokens[t] = Unit.fromString(tt)
        }
        return tokens
    }

    evaluate(tokens) {
        // todo: full recirsive computation
        if(tokens.length == 3) {
            if(tokens[1] == '*')
                var res = tokens[0].multiply(tokens[2])
            if(res) return res.print()
            if(tokens[1] == '/')
                var res = tokens[0].divide(tokens[2])
            if(tokens[1] == '+') {
                var res = tokens[0].add(tokens[2])
                if(!res) return 'error: different units, can\'t add/subtract'
            }
            if(res) return res.print()
        }
        return '? (only computes a *|/ b for now)'
    }
}

// c = new Calculator()
// c.parseLine('x = whatever')
// c.parseLine('4 * x')

// r = parseLine('x = whatever', variables) --> { x: 1, result: 1 }

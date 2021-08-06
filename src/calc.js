import { Unit } from './unit.js'

const operations = ["^", "*", "/", "-", "+"]

export class CalcError extends Error {
    constructor(message) {
        super(message)
        this.name = "CalcError"
    }
}

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
        if(line[line.length - 1] == "") 
            throw new CalcError('last item is an operation')
        if(line[0] == "") 
            throw new CalcError("first item is an operation")
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
        // console.log(tokens)
        var res = ''
        for(const o of operations) {
            // console.log(`searching for ${o}${'\n'}`)
            for(var t in tokens) {
                t = Number(t)
                const tt = tokens[t]
                if(tt == o) {
                    tokens = tokens.filter(e => e != "")
                    console.log(tokens, t)
                    var evaled = this.evaluateTwo([ tokens[t-1], tokens[t], tokens[t+1] ])
                    tokens[t-1] = ""
                    tokens[t] = evaled
                    tokens[t+1] = ""
                    console.log(tokens)
                }
                // if(tt == o) console.log(`found at index ${t} of ${tokens.length - 2} ${(tokens.length - 2) == t}\n`)
            }
        }
        return tokens[0]
    }
    
    // evaluate a simple expression like a + b which can be recursively applied for longer expressions: ((a + b) - c)
    evaluateTwo(tokens) {
        // todo: full recursive computation
        if(tokens.length == 3) {
            if(tokens[1] == '*')
                var res = tokens[0].multiply(tokens[2])
            if(res) return res
            if(tokens[1] == '/')
                var res = tokens[0].divide(tokens[2])
            if(tokens[1] == '+') {
                var res = tokens[0].add(tokens[2])
                if(!res) return 'error: different units, can\'t add/subtract'
            }
            if(tokens[1] == '-') {
                var res = tokens[0].subtract(tokens[2])
                if(!res) return 'error: different units, can\'t add/subtract'
            }
            if(res) return res
        }
        return '? (only computes a *|/ b for now)'
    }
}
import { Unit } from './unit.js'

const operations = ["^", "*", "/", "-", "+"]

export class CalcError extends Error {
    constructor(message) {
        super(message)
        this.name = "CalcError"
    }
}

export class Calculator {
    constructor(vars) {
        this.vars = vars || {}
        this.vars.g = 9.81
    }

    doLine(exp) {
        exp = this.tokenize(exp)
        exp = this.parse(exp)
        for(const o of operations) {
             exp = this.evaluate(exp, o)
        }
        return this.print(exp)
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

    evaluate(tokens, op) {
            for(var t in tokens) {
                t = Number(t)
                const tt = tokens[t]
                if(tt == op) {
                    var evaled = this.evaluateTwo([ tokens[t-1], tokens[t], tokens[t+1] ])
                    tokens[t-1] = ""
                    tokens[t] = evaled
                    tokens[t+1] = ""
                    tokens = tokens.filter(e => e != "")
                }
            }
        return tokens
    }
    
    // evaluate a simple expression like a + b which can be recursively applied for longer expressions: ((a + b) - c)
    evaluateTwo(tokens) {
        if(tokens.length == 3) {
            if(tokens[1] == '*')
                var res = tokens[0].multiply(tokens[2])
            else if(tokens[1] == '/')
                var res = tokens[0].divide(tokens[2])
            else if(tokens[1] == '+') {
                var res = tokens[0].add(tokens[2])
                if(!res) throw new CalcError('error: different units, can\'t add/subtract')
            }
            else if(tokens[1] == '-') {
                var res = tokens[0].subtract(tokens[2])
                if(!res) throw new CalcError('error: different units, can\'t add/subtract')
            }
            else if(tokens[1] == '^')
                var res = tokens[0].exponent(tokens[2])

            if(!res) throw new CalcError('result is null')
            return res
        }
    }

    print(result) {
        return result[0].print()
    }
}

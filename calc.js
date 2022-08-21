import { Factor } from './unit.js'

// const operations = ["^", "*", "/", "-", "+", " to ", "="]
const operations = [["(", ")"], ["^"], ["*", "/"], ["-"], ["+"], [" to "], ["="]]

export class CalcError extends Error {
    constructor(message) {
        super(message)
        this.name = "CalcError"
    }
}

export class Calculator {
    constructor(vars) {
        this.clearVars(vars)
    }

    doLine(exp) {
        var equals = exp.split("=")
        var variableName = ""
        if(equals[1]) {
            equals[0] = equals[0].trim()
            equals[1] = equals[1].trim()
            if(/[A-z]+/.test(equals[0]))
                variableName = equals[0]
            else throw new CalcError("invalid variable name")
        }

        exp = equals[equals.length - 1].trim()
        exp = this.tokenize(exp)
        exp = this.parse(exp)
        exp = this.bracketize(exp)
        exp = this.evaluate(exp)
        if(variableName) this.vars[variableName] = exp[0]
        return this.print(exp)
    }

    tokenize(line) {
        var splits = [...operations.flat()]
        for(var char of splits)
            line = line.replaceAll(char, ';' + char + ';')
        line = line.split(';').map(e => e.trim())
        if(line[line.length - 1] == "" && line[line.length - 2] != ")") 
            throw new CalcError('last item is an operation')
        if(line[0] == "" && line[1] != "(") 
            throw new CalcError("first item is an operation")
        return line.filter(e => e != '')
    }

    parse(tokens) {
        for(var t in tokens) {
            const tt = tokens[t]
            if(operations.flat().includes(tt))
                continue
            else if(this.vars[tt]) 
                tokens[t] = this.vars[tt]                
            else
                tokens[t] = Factor.fromString(tt)
        }
        return tokens
    }

    bracketize(tokens) {
        while(tokens.includes('(')) {
            const [open, close] = this.findBrackets(tokens)
            if(open == close+1) throw new CalcError('empty or unmatched brackets')

            var evaled = this.evaluate(tokens.slice(open + 1, close))
            for(var i = open; i < close + 1; i++)
                delete tokens[i] 
            tokens[open] = evaled[0]
            tokens = tokens.filter(e => e != null)
        }
        return tokens
    }

    findBrackets(tokens) {
        let open = tokens.lastIndexOf('(')
        let close = tokens.indexOf(')')
        return [open, close]
    }

    evaluate(exp) {
        var done = false
        while(!done) {
            done = true
            for(var op of operations) {
                for(var part of exp) {
                    if(!op.includes(part)) continue
                    for(var opi of op) {
                        if(part == opi) {
                            done = false
                            exp = this.evaluateFirst(exp, opi)
                        }
                    }
                }
            }
        }
        return exp
    }

    // go through PEMDAS and evaluate in order
    evaluateFirst(tokens, op) {
        for(var t in tokens) {
            t = Number(t)
            const tt = tokens[t]
            if(tt == op) {
                var evaled = this.evaluateTwo([ tokens[t-1], tokens[t], tokens[t+1] ])
                delete tokens[t-1]
                tokens[t] = evaled
                delete tokens[t+1]
                tokens = tokens.filter(e => e != null)
                return tokens
            }
        }
        return tokens
    }
    
    // evaluate a simple expression like a + b
    evaluateTwo(tokens) {
        if(tokens.length == 3) {
            if(tokens[1] == '*')
                var res = tokens[0].multiply(tokens[2])
            else if(tokens[1] == '/')
                var res = tokens[0].divide(tokens[2])
            else if(tokens[1] == '+') {
                var res = tokens[0].add(tokens[2])
                if(!res) {
                    throw new CalcError('error: different units, can\'t add/subtract')
                }
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

    clearVars(vars, defaults = true) {
        this.vars = vars || {}
        if(defaults) {
            this.vars.g = new Factor(9.81, { m: 1, s: -2 })
            this.vars.c = new Factor(299792458, { m: 1, s: -1 })
            this.vars.Na = new Factor(6.022140857e23, { mol: -1 })
            this.vars.pi = new Factor(3.1415)
        }
    }
}

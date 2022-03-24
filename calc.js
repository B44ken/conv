import { Factor } from './unit.js'

// const operations = ["^", "*", "/", "-", "+", " to ", "="]
const operations = ["(", ")", "^", "*", "/", "-", "+", " to ", "="]

export class CalcError extends Error {
    constructor(message) {
        super(message)
        this.name = "CalcError"
    }
}

export class Calculator {
    constructor(vars) {
        this.vars = vars || {}
        this.vars.g = new Factor(9.81, { m: 1, s: -2 })
        this.vars.pi = new Factor(3.1415)
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
        for(var o of operations) {
            while(exp.includes(o))
                exp = this.evaluate(exp, o)
        }
        if(variableName) this.vars[variableName] = exp[0]
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
                tokens[t] = this.vars[tt]                
            else
                tokens[t] = Factor.fromString(tt)
        }
        return tokens
    }

    // should finish this sooner rather than later
    bracketize(tokens) {
        // var open = tokens.indexOf("(")
        // var close = tokens.lastIndexOf(")")
        // if(open == -1 && close == -1) 
        //     return tokens
        // if(open == -1 || close == -1) 
        //     return new CalcError("unmatched brackets")
        // console.log("brackets: ", tokens.slice(open, close + 1))
        return tokens   
    }

    // go through PEMDAS and evaluate in order
    // bug: division/multiplication and subtraction/additon are done in 2 steps
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

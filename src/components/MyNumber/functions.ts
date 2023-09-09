import { ICombinations } from "../../interfaces";

export const findCombinations = (numbers: Array<number>, target: number): ICombinations => {
    const usedNumbers: Array<number> = Array(6).fill(0)
    const searchTree: Record<string, Array<string>> = buildGraph(numbers)

    let combinations: Array<string> = []
    let minDifference: number = Infinity
    let correctCombinationFound: boolean = false

    const backtrack = (
        index: number,
        expression: Array<string>,
        node: string,
        numOfOpenBrackets: number,
        numOfClosedBrackets: number,
        numbersUsed: number
    ): void => {
        const adjencyList: Array<string> = searchTree[node]

        if (numOfOpenBrackets === numOfClosedBrackets && (Number.isInteger(node) || node === ")")) {
            const result: number = evaluatePostfix(infixToPostfix(expression)) as number
            const difference: number = Math.abs(target - result)

            if (difference <= minDifference) {
                if (difference < minDifference) combinations = []
                minDifference = difference
                combinations.push(expression.slice().join("") + " = " + result)

                if (result === target || Math.abs(target - result) <= Number.EPSILON) {
                    correctCombinationFound = true
                    // zelim da proverim posle koliko ovo zapravo opimizuje kod, kad ne jurimo nadalje niz serach tree
                    // iako smo nasli broj
                    // return
                }
            }
        }

        if (index > 11 || numOfOpenBrackets > 2) {
            return
        }

        if (numOfOpenBrackets === numOfClosedBrackets && (Number.isInteger(node) || node === ")") && numbersUsed === numbers.length) {
            return
        }

        else if (numbersUsed === numbers.length && numOfOpenBrackets === numOfClosedBrackets) {
            return
        }

        for (let i = 0; i < adjencyList.length; i++) {
            if (Number.isInteger(parseInt(adjencyList[i]))) {
                if (!usedNumbers[i]) {
                    usedNumbers[i] = 1
                    expression.push(adjencyList[i])
                    backtrack(index + 1, expression, String(adjencyList[i]), numOfOpenBrackets, numOfClosedBrackets, numbersUsed + 1)
                    expression.pop()
                    usedNumbers[i] = 0
                }
            }

            // mozda da pogledam kako mogu da napravim da se ne ponavlja po 3 puta expression.push
            else {
                if (adjencyList[i] === "(" && numOfOpenBrackets >= numOfClosedBrackets && numOfOpenBrackets <= 3) {
                    expression.push(adjencyList[i])
                    backtrack(index + 1, expression, String(adjencyList[i]), numOfOpenBrackets + 1, numOfClosedBrackets, numbersUsed)
                    expression.pop()
                }

                else if (adjencyList[i] === ")" && numOfClosedBrackets < numOfOpenBrackets) {
                    expression.push(adjencyList[i])
                    backtrack(index + 1, expression, String(adjencyList[i]), numOfOpenBrackets, numOfClosedBrackets + 1, numbersUsed)
                    expression.pop()
                }

                else if (adjencyList[i] === "+" || adjencyList[i] === "-" || adjencyList[i] === "/" || adjencyList[i] === "*") {
                    expression.push(adjencyList[i])
                    backtrack(index + 1, expression, String(adjencyList[i]), numOfOpenBrackets, numOfClosedBrackets, numbersUsed)
                    expression.pop()
                }
            }
        }
    }


    console.time("vreme")

    backtrack(0, ["("], "(", 1, 0, 0)
    console.log(combinations)
    console.timeEnd("vreme")

    return { correctCombinationFound, combinations }
};

function buildGraph(numbers: Array<number>): Record<string, Array<string>> {
    const numbersAsStrings: Array<string> = numbers.map(String)
    const nodes: Array<string> = [...numbersAsStrings, "(", ")", "+", "-", "*", "/"]

    // objekat koji nam predstavlja moguce putanje trazenja za svaki cvor
    const searchTree: Record<string, Array<string>> = {}

    for (const node of nodes) {
        let adjacencyList: Array<string> = []

        if (Number.isInteger(parseInt(node)) || node === ")") {
            adjacencyList = ["+", "-", "*", "/", ")"]
        }

        else {
            adjacencyList = [...numbersAsStrings, "("]
        }

        searchTree[node] = adjacencyList
    }

    return searchTree
}

// algoritam za konverziju infiksne u postfiksnu notaciju sam video sa: https://www.geeksforgeeks.org/convert-infix-expression-to-postfix-expression/

function precedence(operator: string): number {
    if (operator === "*" || operator === "/") return 2
    if (operator === "+" || operator === "-") return 1
    return -1
}

function infixToPostfix(infix: Array<string>): Array<string> {
    let postfixString: Array<string> = []
    const stack: Array<string> = []
    const isOperand = (node: string): boolean => Number.isInteger(parseInt(node))

    for (const node of infix) {
        if (node === "(") {
            stack.push(node)
        }

        else if (isOperand(node)) {
            postfixString.push(node)
        }

        else if (node === ")") {
            while (stack[stack.length - 1] !== "(") {
                postfixString.push(stack.pop() as string)
            }
            stack.pop()
        }

        else {
            while (stack.length && precedence(stack[stack.length - 1]) >= precedence(node)) {
                postfixString.push(stack.pop() as string)
            }
            stack.push(node)
        }

    }

    while (stack.length) {
        postfixString.push(stack.pop() as string)
    }

    return postfixString
}

function evaluatePostfix(tokens: Array<string>): number {
    const stack: number[] = []

    for (let token of tokens) {
        if (token === '+' || token === '-' || token === '*' || token === '/') {

            // vrsimo cast jer dobijamo validan postfixni izraz
            let val1: number = stack.pop() as number
            let val2: number = stack.pop() as number
            let result: number

            switch (token) {
                case '+':
                    result = val2 + val1
                    break
                case '-':
                    result = val2 - val1
                    break
                case '*':
                    result = val2 * val1
                    break
                case '/':
                default:
                    result = val2 / val1
                    break
            }
            stack.push(result)
        }
        else {
            stack.push(Number(token))
        }
    }
    // sigurno na vrhu steka imamo broj jer moja gornja funkcija generise samo validne izraze
    return Number(stack.pop())
}
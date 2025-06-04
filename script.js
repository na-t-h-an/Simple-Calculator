let currentInput = '';

function appendValue(value) {
  // Prevent multiple decimals per number
  if (value === '.' && /(\.\d*|\.)$/.test(currentInput)) return;
  currentInput += value;
  updateDisplay();
}

function clearLast() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function clearDisplay() {
  currentInput = '';
  updateDisplay();
}

function updateDisplay() {
  document.getElementById('display').value = currentInput;
}

function compute() {
  try {
    const result = evaluateExpression(currentInput);
    currentInput = result.toString();
    updateDisplay();
  } catch (error) {
    alert("Invalid expression");
    clearDisplay();
  }
}

function evaluateExpression(expr) {
  const ops = [];
  const vals = [];

  const precedence = (op) => {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    return 0;
  };

  const applyOp = (op, b, a) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/':
        if (b === 0) throw new Error("Divide by zero");
        return a / b;
    }
  };

  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];

    if (ch === ' ') {
      i++;
      continue;
    }

    if (ch === '(') {
      ops.push(ch);
      i++;
    } else if (!isNaN(ch) || ch === '.') {
      let numStr = '';
      while (i < expr.length && (!isNaN(expr[i]) || expr[i] === '.')) {
        numStr += expr[i++];
      }
      vals.push(parseFloat(numStr));
    } else if (ch === ')') {
      while (ops.length && ops[ops.length - 1] !== '(') {
        const op = ops.pop();
        const b = vals.pop();
        const a = vals.pop();
        vals.push(applyOp(op, b, a));
      }
      if (ops.length === 0 || ops.pop() !== '(') throw new Error("Mismatched parentheses");
      i++;
    } else if ('+-*/'.includes(ch)) {
      while (
        ops.length &&
        precedence(ops[ops.length - 1]) >= precedence(ch)
      ) {
        const op = ops.pop();
        const b = vals.pop();
        const a = vals.pop();
        vals.push(applyOp(op, b, a));
      }
      ops.push(ch);
      i++;
    } else {
      throw new Error("Invalid character");
    }
  }

  while (ops.length) {
    const op = ops.pop();
    const b = vals.pop();
    const a = vals.pop();
    vals.push(applyOp(op, b, a));
  }

  if (vals.length !== 1) throw new Error("Invalid expression");
  return vals[0];
}

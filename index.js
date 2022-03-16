const output = document.getElementById('output-text');
const stack = ['0'];
const postfix = ['0'];
stack.length = 0;
postfix.length = 0;

let start = true;
let decimal = false;

//read operators
document.querySelectorAll('.operator').forEach(item => {
    item.addEventListener('click', event => {
        let value = item.innerHTML;
        let lastChar = output.innerHTML[output.innerHTML.length - 1];
        if (isOperator(deFormat(value))) {
            start = false;
            decimal = false;
            if (!isOperator(deFormat(lastChar)))
                output.innerHTML += value;
            else {
                output.innerHTML = output.innerHTML.substring(0, output.innerHTML.length - 1);
                output.innerHTML += value;
            }
        }
        output.scrollLeft = output.scrollWidth;
    })
});


//read numbers
document.querySelectorAll('.key').forEach(item => {
    item.addEventListener('click', event => {
        let value = item.innerHTML;
        if (start) {
            output.innerHTML = '';
            start = false;
        }
        if (value == '.' && !decimal) {
            if (output.innerHTML == '' || isOperator(output.innerHTML[output.innerHTML.length - 1])) {
                output.innerHTML += '0.';
                decimal = true;
            } else if (output.innerHTML[output.innerHTML.length - 1] != '.') {
                output.innerHTML += '.';
                decimal = true;
            }
        } else if (!isNaN(value))
            output.innerHTML += value;
        output.scrollLeft = output.scrollWidth;
    })
});


//convert text in output field to postfix, evaluate and display it
document.getElementById('equals').addEventListener('click', function() {
    while (isNaN(output.innerHTML[output.innerHTML.length - 1])) {
        let string = output.innerHTML;
        string = string.substring(0, string.length - 1);
        output.innerHTML = string;
    }

    let expression = deFormat(output.innerHTML);
    let tempStr = expression;
    let lastIndex = 0;
    let i = 0;

    for (i = 0; i < expression.length; i++) {
        let x = expression.charAt(i);
        if (isOperator(x)) {
            postfix.push(expression.substring(lastIndex, i));
            lastIndex = i + 1;
            if (stack.length > 0)
                if (isOperator(stack[stack.length - 1]))
                    while (precedCheck(stack[stack.length - 1]) >= precedCheck(x))
                        postfix.push(stack.pop());
            stack.push(x);
        }
    }

    postfix.push(expression.substring(lastIndex, expression.length));

    while (stack.length > 0)
        postfix.push(stack.pop());
    while (postfix.length != 0) {
        let val = postfix[0];
        postfix.shift();
        if (isOperator(val)) {
            let y = parseFloat(stack.pop());
            let x = parseFloat(stack.pop());
            switch (val) {
                case '*':
                    stack.push(x * y);
                    break;
                case '/':
                    stack.push(x / y);
                    break;
                case '+':
                    stack.push(x + y);
                    break;
                case '-':
                    stack.push(x - y);
                    break;
            }
        } else
            stack.push(val);
    }

    if (stack) {
        output.innerHTML = stack[stack.length - 1];
    } else output.innerHTML = 'ERROR';
    stack.length = 0;
    postfix.length = 0;
    start = true;
    output.scrollLeft = output.scrollWidth;
});

document.getElementById('backspace').addEventListener('click', function() {
    let string = output.innerHTML;
    string = string.substring(0, string.length - 1);
    if (output.innerHTML[output.innerHTML.length - 1] == '.')
        decimal = false;
    if (string.length == 0 || start) {
        output.innerHTML = '0';
        stack.length = 0;
        postfix.length = 0;
        start = true;
    } else
        output.innerHTML = string;
});

document.getElementById('clear').addEventListener('click', function() {
    output.innerHTML = '0';
    stack.length = 0;
    start = true;
    postfix.length = 0;
});

function isOperator(value) {
    if (value == '/' || value == '*' || value == '+' || value == '-')
        return true;
    return false;
}

function precedCheck(value) {
    if (value == '*' || value == '/')
        return 2;
    else if (value == '+' || value == '-')
        return 1;
    else return -1;
}

function format(val) {
    val = val.replace(/\*/g, '×');
    val = val.replace(/\//g, '÷');
    return val;
}

function deFormat(val) {
    val = val.replace(/\×/g, '*');
    val = val.replace(/\÷/g, '/');
    return val;
}

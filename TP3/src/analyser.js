const fs = require('fs');
const esprima = require('esprima');
const util = require('util');
const _ = require('lodash');

// Find a callexpression with the function/method name provided
const hasCallExpression = (node, funcName) => {

  if (node.type === 'CallExpression'
    && node.hasOwnProperty('callee')
    && node.callee.hasOwnProperty('property')
    && node.callee.property.hasOwnProperty('name')
    && node.callee.property.name === funcName) {

    return node;
  }
  return null;
};

const findCallInsideBody = node => {
  if (node instanceof Array) {
    const found = node.find(child => {
      if (child.hasOwnProperty('expression')) {
        return child.expression.type === 'CallExpression'
      }
    })
    if (found) return found.expression;
  }
}

const hasNestedCall = (node, funcName) => {

  if (node.hasOwnProperty('arguments')) {
    const cb = node.arguments[0];
    for (const key in cb) {
      if (key === 'body') {
        const callExpression = findCallInsideBody(cb[key].body)
        if (callExpression) {
          const nestedCallExpression = hasCallExpression(callExpression, funcName);
          if (nestedCallExpression) {
            return true;
          }
        }
      }
    }
  }
}

const findPromiseAntiPattern = node => {
  const thenCallNode = hasCallExpression(node, 'then');

  if (thenCallNode && hasNestedCall(thenCallNode, 'then')) {
    console.log('Promise Anti-Pattern encontrado na linha ' + getLine(thenCallNode));
  }
}

const getLine= node => node.callee.property.loc.start.line;
const getColumn = node => node.callee.property.loc.start.column;

const traverse = (node, cb) => {

  // Callback
  cb(node);

  for (const key in node) {
    if (node.hasOwnProperty(key)) {
      const child = node[key];
      if (typeof child === 'object' && child !== null) {

        if (Array.isArray(child)) {
          child.forEach(node => traverse(node, cb));
        } else {
          traverse(child, cb);
        }
      }
    }
  }
}

const analyzeCode = code => {

  // Generate AST
  const ast = esprima.parse(code, { loc: true });

  // Traverse nodes
  traverse(ast, findPromiseAntiPattern);

  // Print AST
  //console.log(util.inspect(ast, false, null));
};

// Read file to be analyzed
const filename = process.argv[2];
const code = fs.readFileSync(filename, 'utf-8');

console.log('---------------------');
console.log('Arquivo: ' + filename);
console.log('---------------------\n');

analyzeCode(code);

console.log('\n---------------------');
console.log('Finalizado');
console.log('---------------------');

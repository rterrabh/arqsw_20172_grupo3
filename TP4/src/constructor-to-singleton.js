const esprima = require('esprima');
const esquery = require('esquery');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

const fs = require('fs');
const util = require('util');
const _ = require('lodash');

const isUpperCase = char => char === char.toUpperCase();
const getFunctionBody = node => node.init.body;
const getStartLine = node => node.loc.start.line;
const getEndLine = node => node.loc.end.line;
const logConstructorLine = node => console.log(`Construtor '${node.id.name}' na linha ${getStartLine(node)} até linha ${getEndLine(node)}\n`)
const getCode = node => escodegen.generate(node)

const hasThisAsDirectChild = node => {

  const thisAsDirectChild = 'BlockStatement > ExpressionStatement > AssignmentExpression > MemberExpression > ThisExpression';

  const result = esquery.query(node.init, thisAsDirectChild)
  return !_.isEmpty(result);
}

const createObjectInstanceNode = thisArray => {
  const props = [];
  thisArray.forEach(t => {
    props.push(thisToPropertyNode(t))
  });

  return {
    type: 'ObjectExpression',
    properties: props
  };
}

const thisToPropertyNode = t => {
  return {
    type: 'Property',
    key: t.expression.left.property,
    value: t.expression.right
  }
}

const getAllThis = node => {
  const allThis = [];

  node.init.body.body.forEach(n => {
    if (n.expression
      && n.expression.type
      && (n.expression.type === 'AssignmentExpression'
        || n.expression.type === 'MemberExpression')) {
          allThis.push(n);
        }
  })

  return allThis;
}

const isConstructor = node => {

  if (node.type === 'VariableDeclarator'
    && node.init.type === 'FunctionExpression'
    && hasThisAsDirectChild(node)
    && isUpperCase(node.id.name.charAt(0))) {

      return node;
    }
}

const clearFile = () => {
  fs.writeFile('output.js', '', err => {
    if (err) return console.log(err);

    console.log('Dados do arquivo output foram limpos');
  })
}

const writeCode = (node, code) => {
  fs.appendFile('output.js', '\n\nvar ' + node.id.name + ' = '+ code, err => {
    if (err) return console.log(err)

    console.log('Código foi salvo no arquivo output.js');
  })
}

const analyzeCode = code => {

  clearFile();

  let codeResult = '';

  // Generate AST
  const ast = esprima.parse(code, { loc: true });

  estraverse.traverse(ast, {

    enter: function(node, parent) {
      const constructorNode = isConstructor(node)
      if (constructorNode) {
        logConstructorLine(constructorNode);
        const allThis = getAllThis(constructorNode)

        codeResult = getCode({
            type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'FunctionExpression',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        "type": "VariableDeclaration",
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "id": {
                              "type": "Identifier",
                              "name": "instance",
                            },
                            "init": {
                              "type": "Literal",
                              "value": null,
                              "rawValue": null,
                              "raw": "null",
                            },
                          }
                        ],
                        "kind": "var",
                      },
                      {
                        type: 'FunctionDeclaration',
                        id: {
                          type: 'Identifier',
                          name: 'createInstance'
                        },
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ReturnStatement',
                              argument: createObjectInstanceNode(allThis)
                            }
                          ]
                        }
                      },
                      {
                        type: 'ReturnStatement',
                        argument: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'getInstance'
                              },
                              value: {
                                type: 'FunctionExpression',
                                id: null,
                                params: [],
                                body: {
                                  type: 'BlockStatement',
                                  body: [
                                    {
                                      type: 'IfStatement',
                                      test: {
                                        type: 'BinaryExpression',
                                        left: {
                                          type: 'Identifier',
                                          name: 'instance'
                                        },
                                        operator: '===',
                                        right: {
                                          type: 'Literal',
                                          value: null,
                                          raw: 'null'
                                        }
                                      },
                                      consequent: {
                                        type: 'BlockStatement',
                                        body: [
                                          {
                                            type: 'ExpressionStatement',
                                            expression: {
                                              type: 'AssignmentExpression',
                                              left: {
                                                type: 'Identifier',
                                                name: 'instance'
                                              },
                                              operator: '=',
                                              right: {
                                                type: 'CallExpression',
                                                callee: {
                                                  type: 'Identifier',
                                                  name: 'createInstance'
                                                },
                                                arguments: []
                                              }
                                            }
                                          },
                                          {
                                            type: 'ReturnStatement',
                                            argument: {
                                              type: 'Identifier',
                                              name: 'instance'
                                            }
                                          }
                                        ]
                                      }

                                    }
                                  ]
                                },
                              }
                            }
                          ]
                        }
                      }
                    ]              }
                },
                arguments: []
              }
          });
        console.log(codeResult)
        writeCode(constructorNode, codeResult);
      }
    },
    leave: function () {}
  });

};

// Read file to be analyzed
const filename = process.argv[2];
const code = fs.readFileSync(filename, 'utf-8');

console.log('---------------------');
console.log('Arquivo: ' + filename);
console.log('---------------------\n');

analyzeCode(code);

console.log('---------------------');
console.log('Finalizado');
console.log('---------------------\n');


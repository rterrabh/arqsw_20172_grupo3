const espree = require('espree');
const estraverse = require('estraverse');
const fs = require('fs');
const escodegen = require('escodegen');

const restrictions = require('./restrictions');

const writeCode = (code) => {

  fs.appendFile('output.js', code, err => {
    if (err) return console.log(err)

    console.log('Código foi salvo no arquivo output.js');
  })
}

function hasRequired(node, moduleName) {

  if (node.type === 'CallExpression'
    && node.hasOwnProperty('callee')
    && node.callee.hasOwnProperty('name')
    && node.callee.name === 'require'
    // so restringe modulos locais por causa do ./
    && node.arguments[0].value === './' + moduleName) {

    return node;
  }
  return null;
};

function findViolations(node, parent) {
  restrictions.forEach(r => {
    if (hasRequired(node, r)) {
      console.log(` ${filename} esta violando uma restricao ao importar o modulo '${node.arguments[0].value}' `)
      const moduleCode = require('./' + r);
      const moduleAST = espree.parse(moduleCode);
      const codeResult = escodegen.generate(moduleAST)
      writeCode(codeResult);
    }
  })
}

function analyze(filename, forbiddenModules) {

  const code = fs.readFileSync(filename, 'utf-8');
  const ast = espree.parse(code);

  const newAST = estraverse.replace(ast, {
    enter: function (node, parent) {
      let ret;
      forbiddenModules.forEach(m => {
        if (hasRequired(node, m)) {
          console.log(` ${filename} esta violando uma restricao ao importar o modulo '${m}' `)
          const moduleCode = require('./' + m);
          const moduleAST = espree.parse(moduleCode, { ecmaVersion: 6 });
          ret = moduleAST;
        }
      });
      return ret;
    } ,
    leave: function (node, parent) {}
  });

  const codeResult = escodegen.generate(newAST)
  writeCode(codeResult);
  console.log(codeResult);
}

// ReadCode
const filename = process.argv[2];
analyze(restrictions[0].module, restrictions[0].shouldNotImport);

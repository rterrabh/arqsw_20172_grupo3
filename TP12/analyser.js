const espree = require('espree');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const fs = require('fs');

const restrictions = require('./restrictions');

const clearFile = (filename) => {
  fs.writeFile(filename, '', err => {
    if (err) return console.log(err);
  });
}

const writeCode = (code, filename) => {
  const newFilename = 'ref-' + filename;
  clearFile(newFilename);
  fs.appendFile(newFilename, code, err => {
    if (err) return console.log(err)

    console.log('[INFO] \'' + filename + '\' foi refatorado e salvo no arquivo', newFilename);
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

function analyze(restrictions) {

  restrictions.forEach(restriction => {

    const code = fs.readFileSync(restriction.module, 'utf-8');
    const ast = espree.parse(code);

    const newAST = estraverse.replace(ast, {
      enter: function (node, parent) {
        let ret;
        restriction.forbiddenModules.forEach(fb => {
          if (hasRequired(node, fb)) {
            console.log(`[VIOLATION] ${restriction.module} esta violando uma restricao ao importar o modulo '${fb}' `)
            const moduleCode = require('./' + fb);
            const moduleAST = espree.parse(moduleCode, { ecmaVersion: 6 });
            ret = moduleAST;
          }
        });
        return ret;
      } ,
      leave: function (node, parent) {}
    });

    const codeResult = escodegen.generate(newAST)
    writeCode(codeResult, restriction.module);
  });
}

analyze(restrictions);

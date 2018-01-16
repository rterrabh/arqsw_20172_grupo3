const esprima = require('esprima');
const esquery = require('esquery');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const fs = require('fs');
const _ = require('lodash');

//Dependencias
const dependencias = [];
function Dependencia(modulo, dependencia) {
  this.Modulo = modulo;
  this.Dependencia = dependencia;
}

//Mapeamentos dos arquivos do sistema
const arquivos = new Array();

function Arquivo(modulo, codigo, diretorio, dependencias){
	this.Modulo = modulo;
	this.Codigo = codigo;
	this.Diretorio = diretorio;
	this.Dependencias = new Array();
}

function Path(modulo, arquivo){
	this.Modulo = modulo;
	this.Arquivo = arquivo;
}


const isDefineMode = node => {

  if (node.type === 'CallExpression' && node.callee.name === 'define'){
      return node;
    }
}

const inicializaPaths = code => {
	var codigo = fs.readFileSync("SistemaExemplo\\boot.js", 'utf8');
	
	const ast = esprima.parse(codigo, { loc: true });
	estraverse.traverse(ast, {
		enter: function(node, parent) {
			
			if(node.type === "ObjectExpression")
			{
				node.properties.forEach(prop => {
					if((prop.value.type === "Literal" || prop.value.type === "ArrayExpression") && prop.key.name != "baseUrl"){
						
						if(prop.value.type === "Literal")
							arquivos.push(new Arquivo(prop.key.name, fs.readFileSync(prop.value.value + '.js', 'utf8'), prop.value.value));
						
						if(prop.value.type === "ArrayExpression")
						{
							prop.value.elements.forEach(element => {
								arquivos.push(new Arquivo(prop.key.name, fs.readFileSync(element.value + '.js', 'utf8') , element.value));
							})
						}
					}
				});
			}
			
		},
	leave: function () {}
	});
};

const escreveArquivo = function() {
	
	arquivos.forEach(arquivo => {
		arquivo.Dependencias.forEach(dependencia => {
			fs.appendFile('result.txt', arquivo.Modulo + ' -> ' + dependencia + '\n', err => {
				if (err) return console.log(err)
			})
		});
	});
}

const execute = function() {
	
	inicializaPaths();

	arquivos.forEach(arquivo => {
		const ast = esprima.parse(arquivo.Codigo, { loc: true });
		estraverse.traverse(ast, { 
			enter: function(node, parent) {
				const defineNode = isDefineMode(node)
				if (defineNode) {
					
					for (i = 0; i < node.arguments.length; i++) {
						if(node.arguments[i].type === 'ArrayExpression'){
							for (j = 0; j < node.arguments[i].elements.length; j++) {
								arquivo.Dependencias.push(node.arguments[i].elements[j].value);
							}
						}
					}
				}
			},
		leave: function () {}
		});
	});
	
	escreveArquivo();
	
};

console.log('---------------------');
console.log('Iniciando analise\n');


execute();

console.log('Finalizado');
console.log('---------------------\n');
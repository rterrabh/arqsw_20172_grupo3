const esprima = require('esprima');
const esquery = require('esquery');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const fs = require('fs');
const _ = require('lodash');

//Restricoes
const restricoes = new Array();
restricoes.push(new Dependencia("Controllers", "Models"));
restricoes.push(new Dependencia("Models", "Teste"));

//Dependencias
const dependencias = [];
function Dependencia(modulo, dependencia) {
  this.Modulo = modulo;
  this.Dependencia = dependencia;
}

//Mapeamentos dos arquivos do sistema
const paths = [];
paths.push(new Path("Controllers","C:\\Users\\Ramos\\Documents\\TP5\\js\\SISTEMA\\controllers"));
paths.push(new Path("Models", "C:\\Users\\Ramos\\Documents\\TP5\\js\\SISTEMA\\model"));;

function Arquivo(modulo, codigo, diretorio){
	this.Modulo = modulo;
	this.Codigo = codigo;
	this.Diretorio = diretorio;
}

function Path(modulo, arquivo){
	this.Modulo = modulo;
	this.Arquivo = arquivo;
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

const isDefineMode = node => {

  if (node.type === 'CallExpression' && node.callee.name === 'define'){
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

function GetRestricoes(){
	var associativeArray = {};
	associativeArray["Model"] = ["Controller", "View"];
	associativeArray["Controller"] = ["Model"];
	return associativeArray;
}

function readFiles() {

	var fs = require('fs');
	var path = require('path');
	
	var files = [];
	
	for (var arquivo in paths) {
	
		var dir = paths[arquivo].Arquivo;

		fs.readdirSync(dir).forEach(name => {
			if (fs.statSync(path.join(dir, name)).isDirectory()) return;
			
			files.push(new Arquivo(paths[arquivo].Modulo, fs.readFileSync(path.join(dir, name), 'utf8'), path.join(dir, name)));
		});
	}
	
    return files;
}

const analyzeCode = code => {
	
	var files = readFiles();
	
	console.log("-------------");
	files.forEach(arquivo => {
		const ast = esprima.parse(arquivo.Codigo, { loc: true });
		estraverse.traverse(ast, { 
			enter: function(node, parent) {
				const defineNode = isDefineMode(node)
				if (defineNode) {
					
					for (i = 0; i < node.arguments.length; i++) {
						if(node.arguments[i].type === 'ArrayExpression'){
							for (j = 0; j < node.arguments[i].elements.length; j++) {

								//Analise
								for(k = 0; k < restricoes.length; k++){	

									//console.log(arquivo.Modulo.toUpperCase() + " >> " + restricoes[k].Modulo.toUpperCase() + " && "+ node.arguments[i].elements[j].value.toUpperCase() + " >> " + restricoes[k].Dependencia.toUpperCase());
								
									if(arquivo.Modulo.toUpperCase() === restricoes[k].Modulo.toUpperCase() &&
									   node.arguments[i].elements[j].value.toUpperCase() === restricoes[k].Dependencia.toUpperCase())
											console.log("PERIGO !! Infracao de arquitetura encontrada no arquivo: "+ arquivo.Diretorio +" utilizando o modulo : "+ node.arguments[i].elements[j].value);
								}								
							}
						}
					}
				}
			},
		leave: function () {}
		});
		console.log("-------------");
	});	
};

console.log('---------------------');
console.log('Iniciando analise\n');
analyzeCode();
console.log('Finalizado');
console.log('---------------------\n');
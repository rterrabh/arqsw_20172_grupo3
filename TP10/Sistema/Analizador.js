const esprima = require('esprima');
const esquery = require('esquery');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const fs = require('fs');
const _ = require('lodash');

//Restricoes
const restricoes = new Array();
restricoes.push(new Dependencia("Controllers", "Models", false));
restricoes.push(new Dependencia("Models", "Views", false));
restricoes.push(new Dependencia("Views", "Models", false));

//Dependencias
const dependencias = [];
function Dependencia(modulo, dependencia, encontrada) {
  this.Modulo = modulo;
  this.Dependencia = dependencia;
  this.Encontrada = encontrada;
}

//Restricoes
const obrigatoriedades = new Array();
obrigatoriedades.push(new Obrigatoriedades("Controllers", "Controller2", false));

function Obrigatoriedades(modulo, dependencia, encontrada) {
  this.Modulo = modulo;
  this.Dependencia = dependencia;
  this.Encontrada = encontrada;
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
};

const escreveArquivo = function() {
	
	arquivos.forEach(arquivo => {
		arquivo.Dependencias.forEach(dependencia => {
			var cor = '';
			for(k = 0; k < restricoes.length; k++){	
				arquivo.Dependencias.forEach(depend => {
					
					if((arquivo.Modulo === restricoes[k].Modulo) && (depend === restricoes[k].Dependencia) && (restricoes[k].Encontrada === false)){
						restricoes[k].Encontrada = true;
						
						console.log((arquivo.Modulo === restricoes[k].Modulo) && (depend === restricoes[k].Dependencia) && (restricoes[k].Encontrada === false));
						
						cor = ' {color:red, weight:3}';
					}
				});
				
				fs.appendFile('result.txt', arquivo.Modulo + ' -> ' + dependencia + cor + '\n', err => {
					if (err) return console.log(err)
				})
			}
			
			
			for(k = 0; k < obrigatoriedades.length; k++){
				if(arquivo.Modulo === obrigatoriedades[k].Modulo &&
				   arquivo.Dependencia === obrigatoriedades[k].Dependencia)
				   obrigatoriedades[k].Encontrada = true;
			}
			
			
			
		});
	});
	
	obrigatoriedades.forEach(obrigatoriedade => {
		if(obrigatoriedade.Encontrada == false){
			fs.appendFile('result.txt', obrigatoriedade.Modulo + ' -> ' + obrigatoriedade.Dependencia + ' {color:gold, weight:3}' + '\n', err => {
				if (err) return console.log(err)
			})
		}
	});
}

console.log('---------------------');
console.log('Iniciando analise\n');


inicializaPaths();
escreveArquivo();

console.log('Finalizado');
console.log('---------------------\n');
const esprima = require('esprima');
const esquery = require('esquery');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const fs = require('fs');
const _ = require('lodash');

//Mapeamentos dos arquivos do sistema
const paths = [];
paths.push("C:\\Users\\MONTILA\\Documents\\TP8\\SistemaExemplo\\view");
paths.push("C:\\Users\\MONTILA\\Documents\\TP8\\SistemaExemplo\\model");
paths.push("C:\\Users\\MONTILA\\Documents\\TP8\\SistemaExemplo\\controllers");

const classes = [];
const similaridades = [];

function Classe(codigo, diretorio){
	this.Codigo = codigo;
	this.Diretorio = diretorio;
	this.Dependencias = [];
	this.Metodos = [];
}

function Cluster(classes){
	this.Classes = classes;
}

function Metodo(nome, parametros){
	this.Nome = nome;
	this.Parametros = parametros;
}

function Similaridade(classeA, classeB, similaridade){
	this.ClasseA = classeA;
	this.ClasseB = classeB;
	this.Similaridade = similaridade;
}

function CalculaSimilaridade(){
	
	var classesAnalisadas = [];
	
	for (i = 0; i < classes.length; i++) {
		for (j = 0; j < classes.length; j++) {	
			if(i != j && !classesAnalisadas.includes(i+"--"+j) && !classesAnalisadas.includes(j+"--"+i)){

				var a = classes[i].Dependencias.length + classes[i].Metodos.length;
				var b = classes[j].Dependencias.length + classes[j].Metodos.length;
				var c = 0;
				
				//verifica dependencias em comum
				classes[i].Dependencias.forEach(dependencia => {
					classes[j].Dependencias.forEach(proximaDependencia => {
						if(dependencia == proximaDependencia){
							c++;
						}
					});
				});
			
				//verifica metodos em comum
				classes[i].Metodos.forEach(metodo => {
					classes[j].Metodos.forEach(proximoMetodo => {
						if(metodo == proximoMetodo){
							c++;
						}
					});
				});
				
				classesAnalisadas.push(i+"--"+j);
				classesAnalisadas.push(j+"--"+i);
				similaridades.push(new Similaridade(classes[i].Diretorio, classes[j].Diretorio, (c/(a+b-c))));
			}
		}
	}
	console.log(" *** SIMILARIDADES ***\n")
	console.log(similaridades);
}

function Clusterizacao(){
	console.log(" \n\n*** AGRUPAMENTOS ***\n")
	for(i = 0; i < similaridades.length; i++)
	{
		//Agrupa classes
		if(similaridades[i].Similaridade > 0.70)
		{
			console.log("Classes Agrupadas: " + similaridades[i].ClasseA + " + " + similaridades[i].ClasseB);
			console.log("Similaridade: " + similaridades[i].Similaridade + "\n");
		}
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

function readFiles() {

	var fs = require('fs');
	var path = require('path');
	
	var files = [];
	
	for (i = 0; i < paths.length; i++) {
		var a = new Classe();
		var dir = paths[i];
		
		fs.readdirSync(dir).forEach(name => {
			if (fs.statSync(path.join(dir, name)).isDirectory()) return;
			files.push(new Classe(fs.readFileSync(path.join(dir, name), 'utf8'), path.join(dir, name)));
		});
	}
	
    return files;
}

const analyzeCode = code => {	
	var files = readFiles();
	
	files.forEach(classe => {
		const ast = esprima.parse(classe.Codigo, { loc: true });
		estraverse.traverse(ast, { 
			enter: function(node, parent) {
			
				//Mapeia os Métodos
				if(node.type === 'CallExpression' && node.callee.type === 'MemberExpression'){
					classe.Metodos.push(node.callee.property.name);
				}
				
				//Mapeia Dependencias
				if(node.type === 'CallExpression' && node.callee.name === 'define')
				{
					for (j = 0; j < node.arguments.length; j++) {
						if(node.arguments[j].type === 'ArrayExpression'){
							for (k = 0; k < node.arguments[j].elements.length; k++) {
								classe.Dependencias.push(node.arguments[j].elements[k].value);
							}
						}
					}
				}
				
			},
		leave: function () {}
		});
		classes.push(classe);
	});	
};

console.log('---------------------');
console.log('Iniciando analise');
console.log('---------------------\n');

analyzeCode();
CalculaSimilaridade();
Clusterizacao(similaridades);

console.log('\n---------------------');
console.log('Finalizado');
console.log('---------------------\n');
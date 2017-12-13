const esprima = require('esprima');
const esquery = require('esquery');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const fs = require('fs');
const _ = require('lodash');

//Mapeamentos dos arquivos do sistema
const paths = [];
paths.push("C:\\Users\\MONTILA\\Documents\\GitHub\\arqsw_20172_grupo3\\TP7\\SistemaExemplo\\view");
paths.push("C:\\Users\\MONTILA\\Documents\\GitHub\\arqsw_20172_grupo3\\TP7\\SistemaExemplo\\model");
paths.push("C:\\Users\\MONTILA\\Documents\\GitHub\\arqsw_20172_grupo3\\TP7\\SistemaExemplo\\controllers");


const classes = [];

function Classe(codigo, diretorio){
	this.Codigo = codigo;
	this.Diretorio = diretorio;
	this.Dependencias = [];
	this.Metodos = [];
}

function Metodo(nome, parametros){
	this.Nome = nome;
	this.Parametros = parametros;
}

function CalculaSimilaridade(){
	
	var classesAnalisadas = [];
	
	console.log('****************** RELATORIO ******************\n');	
	
	for (i = 0; i < classes.length; i++) {
		for (j = 0; j < classes.length; j++) {	
			if(i != j && !classesAnalisadas.includes(i+"--"+j) && !classesAnalisadas.includes(j+"--"+i)){
				console.log("---------------------------------")
				console.log("Classe A : " + classes[i].Diretorio);
				console.log("Classe B : " + classes[j].Diretorio)
				console.log("---------------------------------")
				var a = classes[i].Dependencias.length + classes[i].Metodos.length;
				var b = classes[j].Dependencias.length + classes[j].Metodos.length;
				var c = 0;
				
				//verifica dependencias em comum
				//console.log('\n* Dependencias\n');
				classes[i].Dependencias.forEach(dependencia => {
					classes[j].Dependencias.forEach(proximaDependencia => {
						if(dependencia == proximaDependencia){
							//console.log(dependencia);
							c++;
						}
					});
				});
			
				//verifica metodos em comum
				//console.log('\n* Metodos');
				classes[i].Metodos.forEach(metodo => {
					classes[j].Metodos.forEach(proximoMetodo => {
						if(metodo == proximoMetodo){
							//console.log(metodo);
							c++;
						}
					});
				});
				
				console.log("\na: " + a + " , b: " + b + " , c: " + c);
				console.log("Similaridade = " + (c/(a+b-c)));
				classesAnalisadas.push(i+"--"+j);
				classesAnalisadas.push(j+"--"+i);
			}
		}
	}
	console.log('\n***********************************************');
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

console.log('\n---------------------');
console.log('Finalizado');
console.log('---------------------\n');
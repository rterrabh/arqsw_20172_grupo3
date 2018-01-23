const esprima = require('esprima');
const esquery = require('esquery');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const fs = require('fs');
const _ = require('lodash');


//Mapeamentos dos arquivos do sistema
const arquivos = new Array();

function Arquivo(modulo, codigo, diretorio, linhas){
	console.log(linhas);
	this.Modulo = modulo;
	this.Codigo = codigo;
	this.Diretorio = diretorio;
	this.Linhas = linhas;
	this.Chamadas = 0;
	this.Metodos = 0;
	this.Variaveis = 0;
}

function ContarLinhasArquivos(arquivo){
	var lines = require('fs').readFileSync(arquivo, 'utf-8')
    .split('\n')
    .filter(Boolean);
	
	return lines.length;
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
												
						if(prop.value.type === "Literal"){
							var lines = ContarLinhasArquivos(prop.value.value + '.js');
							arquivos.push(new Arquivo(prop.key.name, fs.readFileSync(prop.value.value + '.js', 'utf8'), prop.value.value, lines));
						}
						
						if(prop.value.type === "ArrayExpression")
						{
							prop.value.elements.forEach(element => {
								var lines = ContarLinhasArquivos(element.value + '.js');
								arquivos.push(new Arquivo(prop.key.name, fs.readFileSync(element.value + '.js', 'utf8') , element.value, lines));
							})
						}
					}
				});
			}
			
		},
	leave: function () {}
	});
	
	arquivos.forEach(arquivo => {
		var metodos = 0;
		var variaveis = 0;
		var chamadas = 0;
		const ast = esprima.parse(arquivo.Codigo, { loc: true });
		estraverse.traverse(ast, { 
			enter: function(node, parent) {
				//Métodos
				if (node.type === 'FunctionDeclaration')
					metodos++;
				
				//Variaveis 
				if (node.type === 'VariableDeclaration')
					variaveis++;
				
				//Chamadas 
				if (node.type === 'CallExpression')
					chamadas++;
			},
		leave: function () {}
		});
		
		console.log("Arquivo: " + arquivo.Diretorio);
		console.log("Variaveis: " + variaveis);
		console.log("Chamadas: " + chamadas);
		console.log("Metodos: " + metodos);
		console.log("Linhas: " + arquivo.Linhas);
		console.log("X9: "  + ((variaveis + arquivo.Linhas)/metodos)+chamadas +"\n");
		
		
		arquivo.Metodos = metodos;
		arquivo.Variaveis = variaveis;
		arquivo.Chamadas = chamadas;
	});
};

const escreveArquivo = function() {

}

console.log('---------------------');
console.log('Iniciando analise\n');


inicializaPaths();
escreveArquivo();

console.log('Finalizado');
console.log('---------------------\n');
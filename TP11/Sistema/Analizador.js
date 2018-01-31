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
	this.Xnove = 0;
	this.Quadrados = 0;
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
		
		if(metodos == 0)
			metodos = 1;
		
		arquivo.Metodos = metodos;
		arquivo.Variaveis = variaveis;
		arquivo.Chamadas = chamadas;
		arquivo.Xnove = ((variaveis + arquivo.Linhas)/metodos)+chamadas;
	});
	
	var menor = 0;
	
	//Pega o menor x9
	for(i=0; i < arquivos.length; i++)
	{
		if(arquivos[i+1])
		{
			if(arquivos[i].Xnove < arquivos[i+1].Xnove){
				menor = i;
			}
		}
	}
	
	var somaQuadrados = 0;
	
	for(i=0; i < arquivos.length; i++)
	{
		arquivos[i].Quadrados = Math.round(Math.sqrt(arquivos[i].Xnove/arquivos[menor].Xnove));
		
		console.log("Arquivo: "   + arquivos[i].Diretorio);
		console.log("Variaveis: " + arquivos[i].Variaveis);
		console.log("Chamadas: "  + arquivos[i].Chamadas);
		console.log("Metodos: "   + arquivos[i].Metodos);
		console.log("Linhas: "    + arquivos[i].Linhas);
		console.log("Quadrados: " + arquivos[i].Quadrados);
		console.log("X9: "        + arquivos[i].Xnove + "\n");
		
		somaQuadrados += arquivos[i].Quadrados;
	}
	
	
	var quadradosPercorridos = 0;
	var texto = "{\"key\":\"G1\", \"isGroup\":true, \"pos\":\"0 0\", \"size\":\""+ (somaQuadrados*50)+ " " + (somaQuadrados*50) + "\"} ,\n";
					
	for(i=0; i < arquivos.length; i++)
	{
		texto += "{\"key\":\""+ arquivos[i].Diretorio +" X9= " + arquivos[i].Xnove + "\", \"color\":\""+gera_cor()+"\", \"pos\":\""+ (quadradosPercorridos*50) +" 0\", \"group\":\"G1\" ,\"size\":\"" + (arquivos[i].Quadrados*50) + " " + (arquivos[i].Quadrados*50) + "\"}, \n";
		quadradosPercorridos += arquivos[i].Quadrados;
	}
	
	fs.appendFile('result.txt', texto, err => {
		if (err) return console.log(err)
	})};

// gera uma cor aleatória em hexadecimal
function gera_cor(){
    var hexadecimais = '0123456789ABCDEF';
    var cor = '#';
  
    // Pega um número aleatório no array acima
    for (var i = 0; i < 6; i++ ) {
    //E concatena à variável cor
        cor += hexadecimais[Math.floor(Math.random() * 16)];
    }
    return cor;
}

console.log('---------------------');
console.log('Iniciando analise\n');


inicializaPaths();

console.log('Finalizado');
console.log('---------------------\n');
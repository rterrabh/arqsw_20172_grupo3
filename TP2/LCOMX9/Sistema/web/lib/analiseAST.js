define(["jquery", "parsejs"], function($, parsejs) {
    var start = function() {
        var x9ArquivosArray = [];
        
        
        $(document).ready(function() {
            var dir = 'C:\\Users\\MONTILA\\Google Drive\\Terra\\TP2\\Base Teste';

            $.ajax({
                type: "GET",
                dataType: 'json',
                url: 'http://localhost:8080/RestFul/Directory/GetFiles/' + dir,
                crossDomain: true,
                success: function(data) {
                    analise(data)
                }
            });   
        })

        
        function analise(data){
            var $ = document.querySelector.bind(document);
            
            data.arquivos.forEach(exec);            
            
            var mediaA = 0;
            
            //Calcula Media Aritmetica
            for (i = 0; i < x9ArquivosArray.length; i++) {
                mediaA += x9ArquivosArray[i];
            }
            mediaA = mediaA/x9ArquivosArray.length;
            
            $("#output").value =  "Media X9 = " + mediaA + "\n";
            
            //Calcula media para variancia
            var vetAux = [];
            for (i = 0; i < x9ArquivosArray.length; i++) {
                vetAux.push(Math.pow(x9ArquivosArray[i] - mediaA, 2));
            }
            
            //Calcula desvio padrão
            var desvioPadrao = 0;
            for (i = 0; i < vetAux.length; i++) {
                desvioPadrao += vetAux[i];
            }
            desvioPadrao = Math.pow((desvioPadrao/vetAux.length), 0.5);
            
            $("#output").value = $("#output").value + "Desvio Padrão = " + desvioPadrao + "\n\n";
             
            for (i = 0; i < data.arquivos.length ; i++) {
                if(x9ArquivosArray[i]  < (mediaA-desvioPadrao) ||
                   x9ArquivosArray[i]  > (mediaA+desvioPadrao) )
                {
                    $("#output").value = $("#output").value + x9ArquivosArray[i] + " X9  ---" + data.arquivos[i].path + "\n";
                }
           
            }
        }
        
        function exec(arquivo){
            var $ = document.querySelector.bind(document);

            try {
                var ast = parsejs.parse(arquivo.code);

                var numVariaveis = buscaString(ast.toString().replace(/(\r\n|\n|\r)/gm,""), "VarDecls");
                var numLinhas = arquivo.numLinhas;
                var numMetodos = buscaString(ast.toString().replace(/(\r\n|\n|\r)/gm,""), "Function") == 0 ? 1 : buscaString(ast.toPrettyString(), "Function");
                var numChamadas = buscaString(ast.toString().replace(/(\r\n|\n|\r)/gm,""), "Call");
                
                var metricaX9 = ((numVariaveis + numLinhas) / numMetodos ) + numChamadas;
                x9ArquivosArray.push(parseFloat(metricaX9.toFixed(2)));
                $("#output2").value =  $("#output2").value + parseFloat(metricaX9.toFixed(2)) + "  X9 --- " + arquivo.path + " -- X9 -- " + "\n";

            } catch(e) {
                console.log(e)
            }
        }
        
        function buscaString(texto, busca)
        {
            texto = texto.toUpperCase();
            busca = busca.toUpperCase();
            var pos = -1;
            var contagem = 0;
            while (true) {
                pos = texto.indexOf (busca, pos + 1); 
            
                if (pos < 0)
                    break;
                
                contagem++; 
            }
            return contagem;
        }
    }

    return {"start" : start};
});
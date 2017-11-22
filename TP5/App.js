define([ 'jquery', 'Controllers' ], function( $, Controllers) {
 
	//var carroController = new Controllers.CarroController();
	//var carro = carroController.CriaCarro("Ford","Ka");
	//carro.ShowMarca();
	
	console.log(GetRestricoes());
	
	
	
	
	function GetRestricoes(){
		var associativeArray = {};
		associativeArray["Model"] = ["Controller", "View"];
		associativeArray["Controller"] = ["Model"];
		return associativeArray;
	}
	
});


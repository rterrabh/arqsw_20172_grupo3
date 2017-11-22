define([ 'jquery', 'Controllers', 'Models' ], function( $, Controllers, mm) {
 
	var carroController = new Controllers.CarroController();
	var carro = carroController.CriaCarro("Ford","Ka");
	carro.ShowMarca();
	
});


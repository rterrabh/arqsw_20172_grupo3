define([ 'Controllers' ], function(Controllers) {
 
	var carroController = new Controllers.CarroController();
	var carro = carroController.CriaCarro("Ford","Ka");
	carro.ShowMarca();
	
});
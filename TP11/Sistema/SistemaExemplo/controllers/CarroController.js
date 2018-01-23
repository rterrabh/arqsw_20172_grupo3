define([ 'jquery', 'Models' ], function( $, Models ) {
  'use strict';

  var CarroController = function() {
    var $public = {};

    $public.CarroController = function CarroController(){
		this.CriaCarro = CriaCarro;
		
		function CriaCarro(_marca, _modelo) {
			var carro = new Models.Carro()
			carro.SetMarca(_marca);
			carro.SetModelo(_modelo);
			return carro;
		}
	};
	
    return $public;
  };

  return CarroController();
});
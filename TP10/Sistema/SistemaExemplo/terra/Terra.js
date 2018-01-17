define([ 'jquery'], function( $ ) {
  'use strict';

  var Terra = function() {
    var $public = {};

    $public.Terra = function Terra(){
		var Marca = "Sem marca";
		var Modelo = "Sem modelo";
		
		this.SetMarca = SetMarca;
		this.SetModelo = SetModelo;
		this.ShowMarca = DisplayMarca;
		this.ShowModelo = DisplayModelo; 
		
		function DisplayMarca(){
			alert(Marca);
		}
		
		function DisplayModelo(){
			alert(Modelo);
		}
		
		function SetMarca(_marca) {
			Marca = _marca;
		}
		
		function SetModelo(_modelo) {
			Modelo = _modelo;
		}
   
	};

    return $public;
  };

  return Terra();
});
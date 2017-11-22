;(function( undefined ) {
  'use strict';

  require.config({
    baseUrl: '../',
    paths: {
      jquery: 'node_modules/jquery',
      lodash: 'node_modules/lodash',
	  Models: 'SistemaExemplo/model/Carro',
	  Controllers: 'SistemaExemplo/controllers/CarroController',
	  Terra: 'SistemaExemplo/terra/terra'
    }
  });

  require([ 'jquery', 'lodash', 'Models', 'Controllers', 'Terra'], function( $, _, Models, Controllers, terra ) {
    require([ 'SistemaExemplo/view/App' ]);
  });
})();
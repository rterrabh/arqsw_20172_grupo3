;(function( undefined ) {
  'use strict';

  require.config({
    baseUrl: './js',
    paths: {
      jquery: 'vendor/jquery',
      lodash: 'vendor/lodash',
	  Models: 'model/Carro',
	  Controllers: 'controllers/CarroController'
    }
  });

  require([ 'jquery', 'lodash', 'Models', 'Controllers' ], function( $, _, Models, Controllers ) {
    require([ 'App' ]);
  });
})();
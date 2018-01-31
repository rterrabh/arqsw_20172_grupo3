// Arquivo: controler.js
var model = require('./model');
var util = require('./util');

// Test
var db = require('./db');
console.log('Usando banco de dados: ', db().getDBName());

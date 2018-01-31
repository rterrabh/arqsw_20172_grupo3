// Arquivo: controler.js

var model = require('./model');
var util = require('./util');
var db = require('./db');

var userData = model();
console.log(userData);

console.log('Usando banco de dados: ', db().getDBName());

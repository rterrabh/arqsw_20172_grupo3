var view = require('./view');
var model = require('./model');

// Test 1
var db = require('./db');
console.log('Usando banco de dados: ', db().getDBName());

// Test 2
var util = require('./util');
var x = 'tp12';
var result = util().checkString(x);
console.log('Variável x é uma string: ', result);

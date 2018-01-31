var util = require('./util');

var result;

var x = 'tp12';
result = util().checkString(x);

console.log('Variável x é uma string? ', result);

var y = 1234;
result = util().checkString(y);

console.log('Variável y é uma string? ', result);

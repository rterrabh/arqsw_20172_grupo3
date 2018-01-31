// Arquivo: model.js

const db = require('./db');
module.exports = function model() {
  return db().getData();
};

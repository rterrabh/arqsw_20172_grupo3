// Arquivo: restrictions.js

module.exports = [
  {
    module: 'controler.js',
    forbiddenModules: ['db', 'util']
  },
  {
    module: 'view.js',
    forbiddenModules: ['util']
  }
]

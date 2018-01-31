module.exports = [
  {
    module: 'controler.js',
    forbiddenModules: ['db']
  },
  {
    module: 'view.js',
    forbiddenModules: ['util']
  }
]

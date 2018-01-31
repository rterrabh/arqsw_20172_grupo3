module.exports =  [
    {
      name: 'delete console.logs',
      enter: function (node, parent) {
        if (node.type === 'Identifier' &&
          node.hasOwnProperty('name') &&
          node.hasOwnProperty('property') &&
          node.hasOwnProperty('property') &&
          node.name === 'console'){
            console.log('found console');
        }
      }
    }
  ]

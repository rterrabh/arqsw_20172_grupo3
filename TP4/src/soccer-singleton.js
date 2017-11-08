var Coach = (function () {
  var instance = null;

  function createInstance() {

    return {
      scream: function (message) {
        console.log(message.toUpperCase() + '!!!')
      },

      instruct: function (player) {
        switch(player.position) {
          case 'goalkeeper':
            instance.scream(player.name + ', take care with lobs');
            break;
          case 'defender':
            instance.scream(player.name + ', you should mark them, c\'mon');
            break;
        }
      }
    }
  }

  return {
    getInstance: function () {
      if (instance === null) {
        instance = createInstance();
        console.log('New instance created.')
      }
      return instance;
    }
  }
})();


var player1 = {
  position: 'goalkeeper',
  name: 'Neto'
};

var player2 = {
  position: 'defender',
  name: 'Ale'
};

const coach1 = Coach.getInstance();
const coach2 = Coach.getInstance();
const coach3 = Coach.getInstance();

console.log(coach1 === coach2);
console.log(coach1 === coach3);

//c.instruct(player1);
//c.instruct(player2);

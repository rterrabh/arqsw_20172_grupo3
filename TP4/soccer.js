var Coach = function () {
  this.scream = function (message) {
    console.log(message.toUpperCase() + '!!!');
  }

  this.instruct = function (player) {

    switch(player.position) {
      case 'goalkeeper':
        this.scream(player.name + ', take care with lobs');
        break;
      case 'defender':
        this.scream(player.name + ', you should mark them, c\'mon');
        break;
    }
  }
};

// Data
var player1 = {
  position: 'goalkeeper',
  name: 'Neto'
};

var player2 = {
  position: 'defender',
  name: 'Ale'
};

const c = new Coach();

c.instruct(player1);
c.instruct(player2);


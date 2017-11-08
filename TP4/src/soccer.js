var Championship = function () {
  this.teams = [];
  this.location = 'Europe';

  this.addTeam = function (team) {
    this.teams.push(team);
  }
}

var Coach = (function () {
    var instance = null;
    function createInstance() {
        return {
            shout: function (message) {
                console.log(message.toUpperCase() + '!!!');
            },
            instruct: function (player) {
                switch (player.position) {
                case 'goalkeeper':
                    this.shout(player.name + ', não saia muito do gol');
                    break;
                case 'defender':
                    this.shout(player.name + ', não para de marcar o atacante');
                    break;
                }
            }
        };
    }
    return {
        getInstance: function () {
            if (instance === null) {
                instance = createInstance();
                return instance;
            }
        }
    };
}());

// Data
var player1 = {
  position: 'goalkeeper',
  name: 'Alexandre'
};

var player2 = {
  position: 'defender',
  name: 'Guilherme'
};

const coach = Coach.getInstance();

coach.instruct(player1);
coach.instruct(player2);


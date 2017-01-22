var Main = Main || {};
Main.Lobby = function(game) {

}

Main.Lobby.prototype.preload = function() {}
Main.Lobby.prototype.create = function() {
  this.add.text(80, 80, "Lobby Scene Needs to be built out", {font: '50px Arial', fill: '#ffffff'});
  this.setupConsole();
}
Main.Lobby.prototype.start = function() {
  this.state.start('play')
}
Main.Lobby.prototype.setupConsole = function() {
  var that = this;

  Main.airconsole.broadcast({'message':'STATE', 'state':'LOBBY'});

  Main.airconsole.onConnect = function(device_id) {
    console.log("Client Connected");
    Main.airconsole.message(device_id, {'message': 'STATE', 'state':'LOBBY'});
  }

  Main.airconsole.onDisconnect = function(device_id) {
    console.log("Client Disconnected");
  }

  Main.airconsole.onMessage = function(device_id, data) {
    if( data ) {
      console.log(data);
      if( data.message === "LOBBY" && data.action === 'START') {
        that.start();
      }
    }
  }
}

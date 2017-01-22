var Main = Main || {};
Main.Lobby = function(game) {
  this.players = [];
}

Main.Lobby.prototype.preload = function() {
  this.load.image('cat0', 'assets/game/cat9.png');
  this.load.image('cat1', 'assets/game/cat2.png');
  this.load.image('cat2', 'assets/game/cat3.png');
  this.load.image('cat3', 'assets/game/cat4.png');
  this.load.image('cat4', 'assets/game/cat5.png');
  this.load.image('cat5', 'assets/game/cat6.png');
  this.load.image('cat6', 'assets/game/cat7.png');
  this.load.image('cat7', 'assets/game/cat8.png');
  this.load.image('rock', 'assets/game/rock.png');
  this.load.image('hair', 'assets/game/hairball.png');
}
Main.Lobby.prototype.create = function() {
  //this.add.text(80, 80, "Lobby Scene Needs to be built out", {font: '50px Arial', fill: '#ffffff'});
  this.setupConsole();

  this.getCurrentConnectedDevicesAndCreatePlayers();
  this.PlacePlayersOnScreen();
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

        // Need to check to see if there are 2 or more ActivePlayers

        that.start();
      }

      if( data.message === 'JOIN' && data.action === 'CONNECT') {

      }
    }
  }
}

Main.Lobby.prototype.getCurrentConnectedDevicesAndCreatePlayers = function()
{
  Main.airconsole.setActivePlayers(8);
  devices = Main.airconsole.getControllerDeviceIds();
  console.log("Devices", devices);

  // Setup the devices to users
  for(var i = 0; i < devices.length; i++){
    var device = devices[i];
    console.log(device);
    var playerid = Main.airconsole.convertDeviceIdToPlayerNumber(device);
    console.log(playerid);
    var player = new Player(this.game, playerid, null, null)
    this.players.push(player);
  }
}

Main.Lobby.prototype.PlacePlayersOnScreen = function()
{

}

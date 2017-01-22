var Main = Main || {}
Main.Title = function(game){

}

Main.Title.prototype.preload = function() {
    this.game.load.image('logo', 'assets/logo.png');
}

Main.Title.prototype.create = function() {
  var logo = this.add.sprite(this.world.centerX, this.world.centerY, 'logo');
  logo.anchor.setTo(0.5, 0.5);

  this.setupConsole();
}

Main.Title.prototype.setupConsole = function() {
  var that = this;

  Main.airconsole.onConnect = function(device_id) {
    console.log("Client Connected");
    Main.airconsole.message(device_id, {'message': 'STATE', 'state':'TITLE'});
  }

  Main.airconsole.onDisconnect = function(device_id) {
    console.log("Client Disconnected");
  }

  Main.airconsole.onMessage = function(device_id, data) {
    if( data ) {
      if( data.message === "TITLE" && data.action === 'START') {
        that.start();
      }
    }
  }
}

Main.Title.prototype.start = function() {
    this.state.start('lobby')
  }

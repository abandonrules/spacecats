var Main = Main || {};
Main.airconsole = Main.airconsole || {};

Main.Boot = function(game) {

}

Main.Boot.prototype.init = function(){
  Main.airconsole = new AirConsole();

  Main.styleTextInfo = { font: '50px norse', fill : '#ff0044', align: 'center',wordWrap: true, wordWrapWidth: 450};
   //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
   this.stage.disableVisibilityChange = true;

   if (this.game.device.desktop)
   {
       this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
       this.scale.setMinMax(800, 600, 1920, 1080);
       this.scale.pageAlignHorizontally = true;
       this.scale.pageAlignVertically = true;
   }
   else
   {
       //  Same goes for mobile settings.
       //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
       this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
       this.scale.setMinMax(480, 260, 1024, 768);
       this.scale.forceLandscape = true;
       this.scale.pageAlignHorizontally = true;
   }

   this.physics.startSystem(Phaser.Physics.P2JS);
   this.physics.p2.setImpactEvents(true);
   this.physics.p2.restitution = 0.8;
}

Main.Boot.prototype.preload = function() {

}

Main.Boot.prototype.create = function() {


  this.state.start('title');

}

var Main = Main || {};
Main.Play = function(game)
{
  this.space;
  this.players = [];
  this.cat_num = 0;
  this.planets;
  this.bullets;
  this.logo;
  this.deadcats= 0;
  this.gracepts = 25;
  this.grace = 0;
  this.playersCollisionGroup;// = this.game.physics.p2.createCollisionGroup();
  this.planetsCollisionGroup;// = this.game.physics.p2.createCollisionGroup();
  this.bulletsCollisionGroup;// = this.game.physics.p2.createCollisionGroup();
  this.hairCollisionGroup;// = this.game.physics.p2.createCollisionGroup();
}

Main.Play.prototype.preload = function(){
  this.load.spritesheet('bullet', 'assets/game/explosion.png', 64, 64, 23);
  this.load.image('space', 'assets/game/starfield.jpg');
  this.load.spritesheet('kaboom', 'assets/game/explosion.png', 64, 64, 23);
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

Main.Play.prototype.create = function(){
  Main.airconsole.broadcast({'message': 'STATE', 'state':'PLAY'});
   this.playersCollisionGroup = this.game.physics.p2.createCollisionGroup();
   this.planetsCollisionGroup = this.game.physics.p2.createCollisionGroup();
   this.bulletsCollisionGroup = this.game.physics.p2.createCollisionGroup();
   this.hairCollisionGroup = this.game.physics.p2.createCollisionGroup();

  // Checks all objects  for world border
  this.game.physics.p2.updateBoundsCollisionGroup();

  // Setup background-color
  space = this.game.add.tileSprite(0, 0, 1280  , 720, 'space');
  space.width = this.game.width;
  space.height = this.game.height;
  space.fixedToCamera = true;

  bullets = this.game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.P2JS;
  bullets.createMultiple(20, "bullet",[0, 1, 2, 3]);

  for( var i = 0; i < bullets.children.length; i++ ) {
    bullets.children[i].body.setCollisionGroup(this.bulletsCollisionGroup);
    bullets.children[i].body.collides([this.planetsCollisionGroup, this.bulletsCollisionGroup], this.bulletHit, this);
  }
  bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetBullet);
  bullets.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
  bullets.setAll('checkWorldBounds', true);
  bullets.setAll('lifeSpan', 1);

  planets = this.game.add.group();
  hairs = this.game.add.group();
  hairs.enableBody = true;
  hairs.physicsBodyType = Phaser.Physics.P2JS;
  planets.enableBody = true;
  planets.physicsBodyType = Phaser.Physics.P2JS;

  for( var i = 0; i < 20; i++ )
  {
    var x = this.game.world.randomX;
    var y = this.game.world.randomY;
    var planet = planets.create(x, y, 'rock');
    planet.body.setRectangle(40, 40);
    planet.setHealth(10);
    planet.body.setZeroVelocity();
    planet.body.setCollisionGroup(this.planetsCollisionGroup);
    planet.body.collides([this.planetsCollisionGroup,this.playersCollisionGroup, this.bulletsCollisionGroup]);
  }

  this.game.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
  this.setupConsole();
  this.getCurrentConnectedDevicesAndCreatePlayers();
}

Main.Play.prototype.render = function(){
  this.game.debug.text("Players connected: " + this.players.length, 32, 32);
  var that = this;
  $(this.players).each(function(){
    var player = this;
    if( player.sprite)
    console.log(player.sprite.x);
  });
}

Main.Play.prototype.setupConsole = function(){
  var that = this;

  Main.airconsole.onConnect = function(device_id) {
    console.log("Client Connected");
    Main.airconsole.message(device_id, {'message': 'STATE', 'state':'PLAY'});
  }

  Main.airconsole.onDisconnect = function(device_id) {
    console.log("Client Disconnected");
  }

  Main.airconsole.onMessage = function(device_id, data) {
    console.log(data);
    if( data ) {
      if( data.message === "TITLE" && data.action === 'START') {
        that.start();
      }
      if( data["joystick-left"] )
      {
        if( data["joystick-left"].pressed )
        {
          var jlX = data["joystick-left"].message.x;
          var jlY = data["joystick-left"].message.y;
          if( jlX < 0 )
          {
            that.players[device_id].sprite.body.moveLeft(Math.abs(jlX) * 400);
          }
          else if( jlX > 0 )
          {
            that.players[device_id].sprite.body.moveRight(Math.abs(jlX) * 400);
          }

          if( jlY < 0 )
          {
            that.players[device_id].sprite.body.moveUp(Math.abs(jlY) * 400);
          }
          else if( jlY > 0 )
          {
            that.players[device_id].sprite.body.moveDown(Math.abs(jlY) * 400);
          }

        }
      }

      if( data['joystick-right'] && data['joystick-right'].pressed )
      {
        that.fire_bullet(device_id, data['joystick-right'].message.x, data['joystick-right'].message.y);
      }
      if (data.Poop && data.Poop.pressed)
      {
        that.poop(device_id);
      }
  }
}
}

Main.Play.prototype.start = function()
{
  this.state.start('leaderboard');
}

Main.Play.prototype.getCurrentConnectedDevicesAndCreatePlayers = function()
{
  Main.airconsole.setActivePlayers(8);
  devices = Main.airconsole.getControllerDeviceIds();

  // Setup the devices to users
  for(var i = 0; i < devices.length; i++){
    var device = devices[i];

    var playerid = Main.airconsole.convertDeviceIdToPlayerNumber(device);
    var player = new Player(this.game, device, this.playersCollisionGroup, [this.planetsCollisionGroup, this.playersCollisionGroup, this.bulletsCollisionGroup])
    //this.players.push(player);
    this.players[device] = player;
  }
}

Main.Play.prototype.sendPlayers = function(device_id)
{
  var names = [];
  $(players).each(function() {
    if( this.name !== undefined)
    {
      names.push(this.name);
    }
  });

  if( device_id )
  {
    airconsole.message(device_id, {'message':'Players', 'names': names});
  }
  else
  {
    airconsole.broadcast({'message':'Players', 'names': names});
  }
}

Main.Play.prototype.poop = function(device_id)
{
  this.players[device_id].sprite.damage(25);
  var hair = planets.create(this.players[device_id].sprite.x, this.players[device_id].sprite.y, 'hair');
  hair.body.setRectangle(10, 10);
  hair.scale.setTo(0.5,0.5);
  hair.setHealth(10);
  hair.body.setZeroVelocity();
  hair.body.setCollisionGroup(this.hairCollisionGroup);
  hair.body.collides([this.planetsCollisionGroup, this.hairCollisionGroup], this.playerHit, this);
}

Main.Play.prototype.fire_bullet = function(device_id,jrX,jrY)
{
  var bullet = bullets.getFirstExists(false);

  if( bullet)
  {
    console.log("Bullet X: " + jrX + ": Bully Y: " + jrY);
    bullet.reset(this.players[device_id].sprite.x + 30, this.players[device_id].sprite.y - 30);
    bullet.body.velocity.x = 500 * jrX;
    bullet.body.velocity.y = 500 * jrY;

    if( bullet.body.velocity.x < 0 )
    {
      bullet.scale.x *= -1;
    }
    else
    {
      bullet.scale.x = 1;
    }
  }
}

Main.Play.prototype.resetBullet = function(bullet)
{
  bullet.kill();
}

Main.Play.prototype.bulletHit = function(body1, body2)
{
  body1.sprite.kill();
}

Main.Play.prototype.playerHit = function(body1, body2)
{

}

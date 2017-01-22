var Main = Main || {}
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
  var playersCollisionGroup = this.game.physics.p2.createCollisionGroup();
  var planetsCollisionGroup = this.game.physics.p2.createCollisionGroup();
  var bulletsCollisionGroup = this.game.physics.p2.createCollisionGroup();
  var hairCollisionGroup = this.game.physics.p2.createCollisionGroup();

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
    bullets.children[i].body.setCollisionGroup(bulletsCollisionGroup);
    bullets.children[i].body.collides([planetsCollisionGroup, bulletsCollisionGroup], bulletHit, this);
  }
  bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetBullet);
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
    //planet.body.immovable = true;
    //planet.body.moves = false;
    //planet.angle = game.rnd.angle();
    planet.body.setZeroVelocity();
    planet.body.setCollisionGroup(planetsCollisionGroup);
    planet.body.collides([planetsCollisionGroup, playersCollisionGroup, bulletsCollisionGroup]);
  }

  this.game.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
}

Main.Play.prototype.render = function(){
  this.game.debug.text("Players connected: " + players.length, 32, 32);
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
             players[device_id].body.moveLeft(Math.abs(jlX) * 400);
           } else if( jlX > 0 )
           {
             players[device_id].body.moveRight(Math.abs(jlX) * 400);
           }
 
           if( jlY < 0 )
           {
             players[device_id].body.moveUp(Math.abs(jlY) * 400);
           } else if( jlY > 0 )
           {
             players[device_id].body.moveDown(Math.abs(jlY) * 400);
           }
 
         }
       }
 
       if( data['joystick-right'] && data['joystick-right'].pressed )
       {
         fire_bullet(device_id,data['joystick-right'].message.x,data['joystick-right'].message.y);
         }
       if (data.Poop && data.Poop.pressed)
       {
         poop(device_id);
       }
     };

}

Main.Play.prototype.start = function(){
  this.state.start('leaderboard');
}





function PlayerJoinGame(device_id, data)
{
  var player = new Player(game, device_id, playersCollisionGroup, [planetsCollisionGroup, playersCollisionGroup, bulletsCollisionGroup]);
  player.name = data.name;
  players[device_id] = player;
  sendPlayers();
}

function sendPlayers(device_id)
{
  var names = [];
  $(players).each(function() {
    if( this.name !== undefined)
    {
      names.push(this.name);
    }
  });

  if( device_id )
    airconsole.message(device_id, {'message':'Players', 'names': names});
  else {
    airconsole.broadcast({'message':'Players', 'names': names});
  }
}

function poop(device_id)
{
  players[device_id].damage(25);
  var hair = planets.create(players[device_id].x, players[device_id].y, 'hair');
  hair.body.setRectangle(10, 10);
  hair.scale.setTo(0.5,0.5);
  hair.setHealth(10);
  //planet.angle = game.rnd.angle();
  hair.body.setZeroVelocity();
  hair.body.setCollisionGroup(hairCollisionGroup);
  hair.body.collides([planetsCollisionGroup, hairCollisionGroup], playerHit, this);

}
function fire_bullet(device_id,jrX,jrY)
{
  var bullet = bullets.getFirstExists(false);

  if( bullet)
  {

    console.log("Bullet X: " + jrX + ": Bully Y: " + jrY);
    bullet.reset(players[device_id].x + 30, players[device_id].y - 30);
    bullet.body.velocity.x = 500 * jrX;
    bullet.body.velocity.y = 500 * jrY;

    if( bullet.body.velocity.x < 0 )
    {
      bullet.scale.x *= -1;
    }
    else {
      bullet.scale.x = 1;
    }
  }
}
function enableLogo()
{
  logo = game.add.sprite(300, 200, 'logo');
  logo.fixedToCamera = true;
  game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
  game.camera.focusOnXY(0, 0);
}

function resetBullet(bullet)
{
  bullet.kill();
}

function bulletHit(body1, body2)
{
  body1.sprite.kill();
}

function playerHit(body1, body2)
{
  if ( grace > gracepts )
  {
  body1.damage -= 25;
  body2.damage -= 25;
  body1.sprite.alpha -= 0.2;
  body2.sprite.alpha -= 0.2;
  body2.setZeroVelocity();
  if (body1.sprite.alpha < 0 )
    {
    body1.sprite.kill();
    if (cat_num = deadcats )
      enableLogo();
      else
        deadcats++;
    }
  if (body2.sprite.alpha < 0 )
    body2.sprite.kill();

  if( body2.sprite.name == 'rock')
  {
    body2.sprite.body.setZeroVelocity();
  }

}
  else {
    grace++;
  }
}

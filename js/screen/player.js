Player = function(game, playerid, collisionGroups, collidesWith )
{
  this.grace = 0;
  this.gracepts = 25;
  this.name = "Anonymous";
  this.playerid = playerid;
  var x = game.world.randomX;
  var y = game.world.randomY;
  this.sprite = game.add.sprite(x, y, 'cat1');
  if( this.playerid)
  {
    var pText = "Player " + playerid;
    this.playerText = game.add.text(x, y - 30, pText, {font:'32px Arial', fill:'#ffffff'});
    game.physics.p2.enable(this.playerText, false);
  }
  game.physics.p2.enable(this.sprite, false);

  this.sprite.body.setCircle(50);
  this.sprite.setHealth(250);
  this.sprite.scale.set(0.5, 0.5);
  this.sprite.anchor.setTo(0.5, 0.5);
  if( collisionGroups)
    this.sprite.body.setCollisionGroup(collisionGroups);

  if( collidesWith)
    this.sprite.body.collides(collidesWith, this.playerHit, this);
};

Player.prototype.playerHit = function(body1, body2)
{
  if ( this.grace > this.gracepts )
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
      {
        enableLogo();
      }
      else {
          deadcats++;
      }
      if (body2.sprite.alpha < 0 )
      {
          body2.sprite.kill();
      }
      if( body2.sprite.name == 'rock')
      {
        body2.sprite.body.setZeroVelocity();
      }
    }
  }
  else
  {
    this.grace++;
  }
};

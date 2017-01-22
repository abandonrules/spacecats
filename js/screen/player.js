Player = function(game, playerid, collisionGroups, collidesWith )
{
  this.name = "Anonymous";
  this.playerid = playerid;
  var x = game.world.randomX;
  var y = game.world.randomY;
  this.sprite = game.add.sprite(x, y, 'cat1');
  if( this.playerid)
  {
    this.playerText = this.add.text(x, y - 30, "Player " + this.playerid, {font:'32px Arial', fill:'#ffffff'});
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
    this.sprite.body.collides(collidesWith, playerHit, this);
};

Player.prototype.playerHit = function(body1, body2)
{

};

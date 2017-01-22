Player = function(game, collisionGroups, collidesWith )
{
  this.name = "Anonymous";
  this.sprite = game.add.sprite(game.world.randomX, game.world.randomY, 'cat'+cat_num);
  cat_num++;
  game.physics.p2.enable(this.sprite, false);
  this.sprite.body.setCircle(50);
  this.sprite.setHealth(250);
  this.sprite.scale.set(0.5, 0.5);
  this.sprite.anchor.setTo(0.5, 0.5);
  this.sprite.body.setCollisionGroup(collisionGroups);
  this.sprite.body.collides(collidesWith, playerHit, this);
};

Player.prototype.playerHit = function(body1, body2)
{

};

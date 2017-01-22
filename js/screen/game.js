(function(){
  var game = {};

  function init(){
    game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'phaser-airconsole', {preload: preload, create: create});
  }

  function preload(){

  }

  function create(){

    game.state.add('boot', Main.Boot);
    game.state.add('title', Main.Title);
    game.state.add('lobby', Main.Lobby);
    game.state.add('play', Main.Play);
    game.state.add('leaderboard', Main.Leaderboard);

    game.state.start('boot');
  }


  window.onload = init;
})();
var airconsole = null;

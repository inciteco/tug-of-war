// HowToPlay.js

var howtoplayState = {
	
	preload: function() {
		
		player1Obj = this.getMe(); // populate Player 1 object
		
		game.load.image('player1Pic', player1Obj.image); // Get Player 1 pic from object
	},
	
	create: function() {
		
		// Set play canvas background color
		game.stage.backgroundColor = '#000';
		
		// State title
		var gameTitleText = game.add.text(game.world.centerX, gHeight*.1, 'PHASER: howtoplay.js', { font: '30px Arial', fill: '#ff9900' });
		gameTitleText.anchor.set(0.5);
		
		// Player 1 Pic
		player1Pic = game.add.sprite(game.world.centerX, gHeight*.2, 'player1Pic');
		player1Pic.height = 200;
		player1Pic.width = 200;
		player1Pic.anchor.set(0.5);
		
		//Player1 Name
		player1Name = game.add.text(game.world.centerX, gHeight*.29, 'Player 1: ' + player1Obj.name, { font: '24px Arial', fill: '#fff' });
		player1Name.anchor.set(0.5);
		
		// How To Play text
		var howtoplayText = game.add.text(game.world.centerX, gHeight*.5, 'TUG-OF-WAR INSTRUCTIONS:\n\nTap the green circle before it disappears.\n\nThe quicker and more accurate your taps,\nthe stronger your pull on the chicken leg.\n\nFirst player to bring the chicken to their side wins\nOR\nwhoever is ahead after 45 seconds.', { font: '30px Arial', fill: '#fff', align: 'center' });
		howtoplayText.anchor.set(0.5);
		
		// Find a match text
		var findamatchText = game.add.text(game.world.centerX, gHeight*.75, 'FIND ME AN OPPONENT', { font: '30px Arial', fill: 'aqua' });
		findamatchText.anchor.set(0.5);
		findamatchText.inputEnabled = true;
		findamatchText.events.onInputDown.add(this.startGame, this);
	},
	
	// Get Player 1 data
	getMe: function () {
	  return {
		token:'secrettoken',
		image: 'http://incitemagic.net/brs/phaser/popeyes/testingAssets/brs.jpg',
		name: 'Brett S.'
	  }
	},
	
	// Call play state
	startGame: function() {
		game.state.start('waitforplayer');
	},
};
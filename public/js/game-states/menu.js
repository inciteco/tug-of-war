// Menu.js

var menuState = {
	
	create: function() {
		
		// Game title
		var gameTitleText = game.add.text(game.world.centerX, gHeight*.3, 'TUG OF WAR', { font: '50px Arial', fill: '#ffffff' });
		gameTitleText.anchor.set(0.5);
		
		// Countdown timer to start game
		counter = 5; // initialize countdown variable
		game.time.events.loop(Phaser.Timer.SECOND * 1, this.startGame, this);
		
		// Countdown text
		countdownText = game.add.text(game.world.centerX, gHeight*.5, counter, { font: '70px Courier', fill: '#33cc00' });
		countdownText.anchor.set(0.5);
		
		// User clicks this to start game
//		var startGameButton = game.add.sprite(game.world.centerX, gHeight*.7, 'startGameButton');
//		startGameButton.anchor.set(0.5);
//		startGameButton.inputEnabled = true;
//		startGameButton.width = gWidth*.3;
//		startGameButton.height = (gWidth*.3)/3;
//		startGameButton.events.onInputDown.add(this.startGame, this);
		
	},
	
	// Call play state
	startGame: function() {
		counter = counter-1;
		countdownText.text = counter;
		if(counter == 0) {
			game.state.start('play');
		}
	},
};
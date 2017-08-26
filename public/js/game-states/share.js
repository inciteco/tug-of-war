// Share.js

var shareState = {
	
	create: function() {
		
		// Set play canvas background
		popeyesBG = game.add.sprite(0, 0, 'popeyesBG');
		popeyesBG.height = gHeight;
		popeyesBG.width = gWidth;
		//game.stage.backgroundColor = '#F58426';
		
		// User clicks this to start game
		var restartGameButton = game.add.sprite(100, 1300, 'restartGameButton');
		restartGameButton.anchor.set(0.5);
		restartGameButton.inputEnabled = true;
		restartGameButton.events.onInputDown.add(this.playAgain, this);
	},
	
	// Call waitforplayer state
	playAgain: function() {
			game.state.start('waitforplayer');
	},
};
// Connecterror.js

var connecterrorState = {
	
	create: function() {
		
		// Set play canvas background
		popeyesBG = game.add.sprite(0, 0, 'popeyesBG');
		popeyesBG.height = gHeight;
		popeyesBG.width = gWidth;
		
		// Set logo
		craveoffLogo = game.add.sprite(game.world.centerX, 160, 'craveoffLogo');
		craveoffLogo.scale.setTo(.8, .8);
		craveoffLogo.anchor.set(0.5);
		
		// Show loading progress
		setLoadingText = game.add.text(game.world.centerX, game.world.centerY-300, 'Something went wrong!\nCheck your connection and try again.', { font: 'bold 64px Arial', fill: '#fff', align: 'center' });
		setLoadingText.anchor.set(0.5, 0.5);
		
		
		
		// User clicks this to start game
		tryAgainButton = game.add.sprite(game.world.centerX, 1000, 'tryAgainButton');
		tryAgainButton.anchor.set(0.5);
		tryAgainButton.inputEnabled = true;
		tryAgainButton.events.onInputDown.add(this.tryAgain, this);
	},
	
	// Call play state
	tryAgain: function() {	
			game.state.start('play');
	},
};
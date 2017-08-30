// Share.js

var shareState = {

	create: function() {

		// Set play canvas background
		popeyesBG = game.add.sprite(0, 0, 'popeyesBG');
		popeyesBG.height = gHeight;
		popeyesBG.width = gWidth;
		
		// mute button
		soundToggleButton = game.add.sprite(65, 60, 'soundToggleButton', muteVal);
		soundToggleButton.inputEnabled = true;
		soundToggleButton.events.onInputDown.add(this.muteSound, this);
		
		// Check for previously set Mute
		if(muteVal == 1) {
			game.sound.mute = true;
		}

		// Set logo
		craveoffLogo = game.add.sprite(game.world.centerX, 160, 'craveoffLogo');
		craveoffLogo.scale.setTo(.8, .8);
		craveoffLogo.anchor.set(0.5);

		// set the video
    	craveVid = game.add.video('craveVid');
		craveVid.play(true);
		craveVid.addToWorld(game.world.centerX, 700, 0.5, 0.5);

		// share on FB button
		fbShareButton = game.add.sprite(game.world.centerX, 1300, 'fbShareButton');
		fbShareButton.anchor.set(0.5);
		fbShareButton.inputEnabled = true;
		fbShareButton.events.onInputDown.add(this.playAgain, this);



		// User clicks this to start game
		playAgainButton = game.add.sprite(game.world.centerX, 1600, 'playAgainButton');
		playAgainButton.anchor.set(0.5);
		playAgainButton.inputEnabled = true;
		playAgainButton.events.onInputDown.add(this.playAgain, this);
	},
	
	muteSound: function() {
		if (!this.game.sound.mute) {
			game.sound.mute = true;
			muteVal = 1;
			soundToggleButton.frame = 1;
		} else {
			game.sound.mute = false;
			muteVal = 0;
			soundToggleButton.frame = 0;
		}
	},

	// Call waitforplayer state
	playAgain: function() {
			craveVid.stop();

			// Make sure to start clean!
			gameService.reset();

			game.state.start('howtoplay');
	},
};

// Boot.js

var bootState = {

	preload: function() {

		// Load background image
		game.load.image('popeyesBG', 'assets/images/popeyesCraveBG.jpg');

		// waiting circle shadow
		game.load.image('waitingCircleShadow', 'assets/images/waitingCircleShadow.png');

		// waiting circle
		game.load.image('waitingCircle', 'assets/images/waitingCircle.png');
		
		// loading label
		game.load.image('loadingLabel', 'assets/images/loadingLabel.png');
	},

	create: function() {

		// TODO: remove for production?
		// avoid pausing background tabs when testing on one machine
		game.stage.disableVisibilityChange = true;

		// enable smoothing
		game.stage.smoothed = true;

		// Scale game
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // always show entire game

		// if desktop browser
		if (game.device.desktop) {
			game.scale.minWidth = gWidth/4;
			game.scale.minHeight = gHeight/4;
			if (dpr == 2) { // mostly retina screens
				game.scale.maxWidth = (dHeightAdj/gameAspectRatio)/2; // keep aspect ratio of game on desktop
				game.scale.maxHeight = dHeightAdj/2; // give some room at the bottom
			} else {
				game.scale.maxWidth = dHeightAdj/gameAspectRatio; // keep aspect ratio of game on desktop
				game.scale.maxHeight = dHeightAdj; // give some room at the bottom
			}
		} else if (dpr == 2) { // mostly retina screens
				game.scale.maxWidth = (dHeight/gameAspectRatio)/2; // use as much height as possible (ipads)
				game.scale.maxHeight = dHeight/2; // use as much height as possible (ipads)
		}

		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;

		// Start physics engine
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Call load state
		game.state.start('load');
	}
};

// Boot.js

var bootState = {
	
	preload: function() {
		// Load progress bar
    	game.load.image('preLoadBar',  'assets/loading.png');
	},
	
	create: function() {
		
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
			
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;
		} 
		
		// Start physics engine
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		// Call load state
		game.state.start('load');
	}
};


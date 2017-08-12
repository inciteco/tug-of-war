// Boot.js

var bootState = {
	
	preload: function() {
		// Load progress bar
    	game.load.image('preLoadBar',  'assets/loading.png');
	},
	
	create: function() {
		
		// Start physics engine
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		// Call load state
		game.state.start('load');
	}
};


// HowToPlay.js

var howtoplayState = {
	
	preload: function() {
		
		player1Obj = gameService.getPlayer(); // populate Player 1 object
		
		game.load.image('player1Pic', player1Obj.image); // Get Player 1 pic from object
	},
	
	create: function() {
		
		// Set play canvas background
		popeyesBG = game.add.sprite(0, 0, 'popeyesBG');
		popeyesBG.height = gHeight;
		popeyesBG.width = gWidth;
		//game.stage.backgroundColor = '#F58426';
		
		// Player 1 Pic
		player1Pic = game.add.sprite(game.world.centerX, 300, 'player1Pic');
		player1Pic.height = 400;
		player1Pic.width = 400;
		player1Pic.anchor.set(0.5);
		
		// Player1 Name
		player1Caps = player1Obj.name.toUpperCase();
		player1Name = game.add.text(0, 0, player1Caps, playerNamesFont);
    	player1Name.alignTo(player1Pic, Phaser.BOTTOM_CENTER);
		
		// "You have entered" Text
		var youHaveEnteredText = game.add.text(0, 0, 'You have entered the contest and are almost ready to play', bodyFont);
		youHaveEnteredText.alignTo(player1Name, Phaser.BOTTOM_CENTER, 0, 80);
		
		// "Game Tips" Text
		var gameTipsText = game.add.text(150, 900, 'GAME TIPS', playerNamesFont);
		
		// How To Play text
		var howtoplayText = game.add.text(0, 0, '1) Tap the food item before it disappears.\n\n2) The quicker and more accurate your taps, the stronger your pull on the Big Box.\n\n3) First player to bring the chicken to their side wins, or whoever is ahead after 45 seconds.', tipsFont);
		howtoplayText.alignTo(gameTipsText, Phaser.BOTTOM_LEFT, 0, 20);
		
		
		// User clicks this to start game
		var findmatchButton = game.add.sprite(0, 0, 'findmatchButton');
		findmatchButton.anchor.set(0.5);
		findmatchButton.inputEnabled = true;
		findmatchButton.alignTo(howtoplayText, Phaser.BOTTOM_CENTER, 0, 100);
		findmatchButton.events.onInputDown.add(this.startGame, this);
	},
	
	// Call play state
	startGame: function() {
		game.state.start('waitforplayer');
	},
};
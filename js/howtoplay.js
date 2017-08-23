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
		
		// to Play card
		toPlayCard = game.add.sprite(game.world.centerX, 1000, 'toPlayCard');
		toPlayCard.scale.setTo(.9, .9);
		toPlayCard.anchor.set(0.5);
		
		// Button to start game
		startCravingButton = game.add.sprite(game.world.centerX, 1920, 'startCravingButton');
		startCravingButton.anchor.set(0.5);
		startCravingButton.inputEnabled = true;
		startCravingButton.events.onInputDown.add(this.startGame, this);
		
		// PLAYER 1
		
			// Player Pic Stroke
			player1PicStroke = game.add.sprite(game.world.centerX, 300, 'playerPicStroke');
			player1PicStroke.height = 400;
			player1PicStroke.width = 400;
			player1PicStroke.anchor.set(0.5);

			// Player 1 Pic
			player1Pic = game.add.sprite(game.world.centerX, 300, 'player1Pic');
			player1Pic.height = 300;
			player1Pic.width = 300;
			player1Pic.anchor.set(0.5);

			// Player 1 mask
			player1PicMask = game.add.graphics(game.world.centerX, 300);
			player1PicMask.anchor.set(0.5);
			player1PicMask.beginFill(0xffffff);
			player1PicMask.drawCircle(0, 0, 300);
			player1Pic.mask = player1PicMask;

			// Player1 Name
			//player1Caps = player1Obj.name.toUpperCase();
			player1Name = game.add.text(0, 0, player1Obj.name, playerNamesFont);
			player1Name.alignTo(player1PicStroke, Phaser.BOTTOM_CENTER);
		
		// "You have entered" Text
		var youHaveEnteredText = game.add.text(0, 0, 'You’re almost there! Check out the craving instructions below.', bodyFont);
		youHaveEnteredText.alignTo(player1Name, Phaser.BOTTOM_CENTER, 0, 40);
		
		// HOW TO PLAY CARD
		
			// "Game Tips" Text
			var gameTipsText = game.add.text(game.world.centerX, 895, 'TO PLAY', toPlayFont);
			gameTipsText.setShadow(3, 3, 'rgba(0,0,0,0.2)', 2);
			gameTipsText.anchor.set(0.5);

			// white line
			whiteLine = game.add.sprite(game.world.centerX, 990, 'whiteLine');
			whiteLine.scale.setTo(.9, 1);
			whiteLine.anchor.set(0.5);

			// How To Play text
			var howtoplayText = game.add.text(220, 1080, '1) Tap, tap, tap the Popeyes item as\nfast as you can.\n\n2) The quicker you tap, the stronger\nyour craving for the Big Box.\n\n3) Player to pull Big Box into their\ncrave zone (or closest to it) will prevail.', tipsFont);
			howtoplayText.setShadow(3, 3, 'rgba(0,0,0,0.2)', 2);	
	},
	
	// Call play state
	startGame: function() {
		game.state.start('waitforplayer');
	},
};
// Win.js

var winState = {
	
	create: function() {
		
		// Audio Declarations
		under500 = game.add.audio('under500');
		over500 = game.add.audio('over500');
		
		
		var splash;
		if(gameWinner == player1Obj.name){
			over500.play();
			splash = 'gameWon';
		} else {
			under500.play();
			splash = 'gameLost';
		}
		
		// add game table sprite
		gameBoardWait = game.add.sprite(0, 0, 'gameBoardWait');

		// Player2 Pic Stroke
		player2PicStroke = game.add.sprite(game.world.centerX, 300, 'playerPicStroke');
		player2PicStroke.height = 400;
		player2PicStroke.width = 400;
		player2PicStroke.anchor.set(0.5);

		// Player 2 Pic
		player2Pic = game.add.sprite(game.world.centerX, 300, 'player2Pic');
		player2Pic.height = 300;
		player2Pic.width = 300;
		player2Pic.anchor.set(0.5);

		// Player 2 mask
		player2PicMask = game.add.graphics(game.world.centerX, 300);
		player2PicMask.anchor.set(0.5);
		player2PicMask.beginFill(0xffffff);
		player2PicMask.drawCircle(0, 0, 300);
		player2Pic.mask = player2PicMask;
		
		// Player 2 Name 
		player2Name = game.add.text(0, 0, player2Obj.name, playerNamesFont);
		player2Name.anchor.set(0.5);
		player2Name.alignTo(player2PicStroke, Phaser.TOP_CENTER, 0, 0);

		// Player 1 Pic Shadow
		player1Shadow = game.add.sprite(game.world.centerX, 1700, 'player1Shadow');
		player1Shadow.height = 426;
		player1Shadow.width = 426;
		player1Shadow.anchor.set(0.5);

		// Player 1 Pic Stroke
		player1Stroke = game.add.sprite(game.world.centerX, 1694, 'player1Stroke');
		player1Stroke.height = 354;
		player1Stroke.width = 354;
		player1Stroke.anchor.set(0.5);

		// Player 1 Pic
		player1Pic = game.add.sprite(game.world.centerX, 1694, 'player1Pic');
		player1Pic.height = 348;
		player1Pic.width = 348;
		player1Pic.anchor.set(0.5);

		//Player 1 Name
		player1Name = game.add.text(0, 0, player1Caps, playerNamesFont);
		player1Name.anchor.set(0.5);
		player1Name.alignTo(player1Pic, Phaser.BOTTOM_CENTER, 0, 20);

		// Game Results
		gameResults = game.add.sprite(game.world.centerX, 875, splash);
		gameResults.anchor.set(0.5, 0.5);


		var continueButton = game.add.sprite(game.world.centerX, 1300, 'continueButton');
		continueButton.anchor.set(0.5);
		continueButton.inputEnabled = true;
		continueButton.events.onInputDown.add(this.callShare, this);
		
		// do some clean up
		gameService.addListener('onLeavingCurrentState', function () {
			console.log('[TestListener]: leaving win state');
		});
	},
	
	// Call share state
	callShare: function() {
		window.location = "share.html";
		//game.state.start('share');
	},
};
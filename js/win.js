// Win.js

var winState = {
	
	create: function() {
		
		// Audio Declarations
		youLose = game.add.audio('youLose');
		youWin = game.add.audio('youWin');
		
		
		var splash;
		if(gameWinner == player1Obj.name){
			youWin.play();
			splash = 'gameWon';
			setTimeout(winState.callShare, 10000);
		} else {
			youLose.play();
			splash = 'gameLost';
			setTimeout(winState.callShare, 8000);
		}
		
		// add game table sprite
		gameBoardWait = game.add.sprite(0, 0, 'gameBoardWait');
		
		// mute button
		soundToggleButton = game.add.sprite(65, 60, 'soundToggleButton', 0);
		soundToggleButton.inputEnabled = true;
		soundToggleButton.events.onInputDown.add(this.muteSound, this);

		// Player2 Pic Stroke
		player2PicStroke = game.add.sprite(game.world.centerX, 225, 'playerPicStroke');
		player2PicStroke.height = 300;
		player2PicStroke.width = 300;
		player2PicStroke.anchor.set(0.5);

		// Player 2 Pic
		player2Pic = game.add.sprite(game.world.centerX, 225, 'player2Pic');
		player2Pic.height = 225;
		player2Pic.width = 225;
		player2Pic.anchor.set(0.5);

		// Player 2 mask
		player2PicMask = game.add.graphics(game.world.centerX, 225);
		player2PicMask.anchor.set(0.5);
		player2PicMask.beginFill(0xffffff);
		player2PicMask.drawCircle(0, 0, 225);
		player2Pic.mask = player2PicMask;
		
		// Player 2 Name 
		player2Name = game.add.text(0, 0, player2Obj.name, playerNamesFont);
		player2Name.anchor.set(0.5);
		player2Name.alignTo(player2PicStroke, Phaser.TOP_CENTER, 0, -10);

//		// Player 1 Pic Shadow
//		player1Shadow = game.add.sprite(game.world.centerX, 1700, 'player1Shadow');
//		player1Shadow.height = 426;
//		player1Shadow.width = 426;
//		player1Shadow.anchor.set(0.5);
//
//		// Player 1 Pic Stroke
//		player1Stroke = game.add.sprite(game.world.centerX, 1694, 'player1Stroke');
//		player1Stroke.height = 354;
//		player1Stroke.width = 354;
//		player1Stroke.anchor.set(0.5);
//
//		// Player 1 Pic
//		player1Pic = game.add.sprite(game.world.centerX, 1694, 'player1Pic');
//		player1Pic.height = 348;
//		player1Pic.width = 348;
//		player1Pic.anchor.set(0.5);
//
//		//Player 1 Name
//		player1Name = game.add.text(0, 0, player1Caps, playerNamesFont);
//		player1Name.anchor.set(0.5);
//		player1Name.alignTo(player1Pic, Phaser.BOTTOM_CENTER, 0, 20);

		// Game Results
		gameResults = game.add.sprite(game.world.centerX, 875, splash);
		gameResults.anchor.set(0.5, 0.5);
		
//		var continueButton = game.add.sprite(game.world.centerX, 1300, 'continueButton');
//		continueButton.anchor.set(0.5);
//		continueButton.inputEnabled = true;
//		continueButton.events.onInputDown.add(this.callShare, this);
		
		// do some clean up
		gameService.addListener('onLeavingCurrentState', function () {
			console.log('[TestListener]: leaving win state');
		});
	},
	
	muteSound: function() {
		if (!this.game.sound.mute) {
			game.sound.mute = true;
			soundToggleButton.frame = 1;
		} else {
			game.sound.mute = false;
			soundToggleButton.frame = 0;
		}
	},
	
	// Call share state
	callShare: function() {
		window.location = "share.html";
		//game.state.start('share');
	},
};
// Win.js

var winState = {

	create: function() {

		// Audio Declarations
		youLose = game.add.audio('youLose');
		youWin = game.add.audio('youWin');


		var splash;

		// add game table sprite
		gameBoard = game.add.sprite(0, 0, 'gameBoard');

		// mute button
		soundToggleButton = game.add.sprite(65, 60, 'soundToggleButton', 0);
		soundToggleButton.inputEnabled = true;
		soundToggleButton.events.onInputDown.add(this.muteSound, this);

		if (gameWinner){

			// Player1 Pic Stroke
			player1PicStroke = game.add.sprite(game.world.centerX, 1740, 'playerPicStroke');
			player1PicStroke.height = 400;
			player1PicStroke.width = 400;
			player1PicStroke.anchor.set(0.5);

			// Player 1 Pic
			player1Pic = game.add.sprite(game.world.centerX, 1740, 'player1Pic');
			player1Pic.height = 300;
			player1Pic.width = 300;
			player1Pic.anchor.set(0.5);

			// Player 1 mask
			playerPicMask = game.add.graphics(game.world.centerX, 1740);
			playerPicMask.anchor.set(0.5);
			playerPicMask.beginFill(0xffffff);
			playerPicMask.drawCircle(0, 0, 300);
			player1Pic.mask = playerPicMask;

			// Player1 Name
			//player1Caps = player1Obj.name.toUpperCase();
			player1Name = game.add.text(0, 0, player1Obj.name, playerNamesFont);
			player1Name.setShadow(3, 3, 'rgba(0,0,0,0.2)', 2);
			player1Name.alignTo(player1PicStroke, Phaser.BOTTOM_CENTER);

			youWin.play();
			splash = 'gameWon';
			setTimeout(winState.callShare, 10000);

		} else {

			// Player2 Pic Stroke
			player2PicStroke = game.add.sprite(game.world.centerX, 140, 'playerPicStroke');
			player2PicStroke.height = 300;
			player2PicStroke.width = 300;
			player2PicStroke.anchor.set(0.5);

			// Player 2 Pic
			player2Pic = game.add.sprite(game.world.centerX, 140, 'player2Pic');
			player2Pic.height = 225;
			player2Pic.width = 225;
			player2Pic.anchor.set(0.5);

			// Player 2 mask
			player2PicMask = game.add.graphics(game.world.centerX, 140);
			player2PicMask.anchor.set(0.5);
			player2PicMask.beginFill(0xffffff);
			player2PicMask.drawCircle(0, 0, 225);
			player2Pic.mask = player2PicMask;

			// Player 2 Name
			player2Name = game.add.text(0, 0, player2Obj.name, playerNamesFont);
			player2Name.setShadow(3, 3, 'rgba(0,0,0,0.2)', 2);
			player2Name.alignTo(player2PicStroke, Phaser.BOTTOM_CENTER, 0, -10);

			youLose.play();
			splash = 'gameLost';
			setTimeout(winState.callShare, 7000);
		}

		// Game Results
		gameResults = game.add.sprite(game.world.centerX, 875, splash);
		gameResults.anchor.set(0.5, 0.5);

//		var continueButton = game.add.sprite(game.world.centerX, 1300, 'continueButton');
//		continueButton.anchor.set(0.5);
//		continueButton.inputEnabled = true;
//		continueButton.events.onInputDown.add(this.callShare, this);

		// do some clean up
		gameService.addListener('onLeavingCurrentState', function () {
			console.log('[WinState]: leaving win state');
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
		//window.location = "share.html";
		//game.state.start('share');
	},
};

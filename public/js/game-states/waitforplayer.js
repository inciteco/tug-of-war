// WaitForPlayer.js

var waitforplayerState = {

	preload: function() {

		// Start to listen for Player 2
		gameService.findOpponent();
	},

	create: function() {

		// Set play canvas background
		popeyesBG = game.add.sprite(0, 0, 'popeyesBG');
		popeyesBG.height = gHeight;
		popeyesBG.width = gWidth;

		// AUDIO Declarations
		playerfoundSound = game.add.audio('playerfoundSound');
		countdownSound = game.add.audio('countdownSound');
		playgameSound = game.add.audio('playgameSound');

		// add game table sprite
		gameBoard = game.add.sprite(0, 0, 'gameBoard');

		// mute button
		soundToggleButton = game.add.sprite(65, 60, 'soundToggleButton', muteVal);
		soundToggleButton.inputEnabled = true;
		soundToggleButton.events.onInputDown.add(this.muteSound, this);

		// PLAYER 1

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


		// PLAYER 2

			// Player2 Pic Stroke
			player2PicStroke = game.add.sprite(game.world.centerX, 140, 'playerPicStroke');
			player2PicStroke.height = 300;
			player2PicStroke.width = 300;
			player2PicStroke.anchor.set(0.5);

			// Waiting Pic
			waitingPic = game.add.sprite(game.world.centerX, 140, 'waitingPic');
			waitingPic.height = 225;
			waitingPic.width = 225;
			waitingPic.anchor.set(0.5);

			// Player 2 mask
			player2PicMask = game.add.graphics(game.world.centerX, 140);
			player2PicMask.anchor.set(0.5);
			player2PicMask.beginFill(0xffffff);
			player2PicMask.drawCircle(0, 0, 225);
			waitingPic.mask = player2PicMask;

			// Player 2 Name -- Initially set to OPPONENT
			player2Name = game.add.text(0, 0, 'Opponent', playerNamesFont);
			player2Name.setShadow(3, 3, 'rgba(0,0,0,0.2)', 2);
			player2Name.anchor.set(0.5);
			player2Name.alignTo(player2PicStroke, Phaser.BOTTOM_CENTER, 0, -10);


		// Waiting Circle Shadow
		waitingCircleShadow = game.add.sprite(game.world.centerX, game.world.centerY-135, 'waitingCircleShadow');
		waitingCircleShadow.anchor.set(0.5);

		// Waiting Circle
		waitingCircle = game.add.sprite(game.world.centerX, game.world.centerY-160, 'waitingCircle');
		waitingCircle.anchor.set(0.5);

		// Waiting For Player text
		waitingforplayerText = game.add.text(game.world.centerX, game.world.centerY-160, 'Waiting for\nLive Player', { font: '120px UTTriumph-Regular', fill: '#F58426', align: 'center' });
		waitingforplayerText.anchor.set(0.5);


		// GAME SERVICES

			// Check for previously set Mute
			if(muteVal == 1) {
				game.sound.mute = true;
			}

			// Player 2 has arrived, run popPlayer2Obj
			gameService.addListener('onOpponentArrived', waitforplayerState.popPlayer2Obj);

			// Start game countdown
			gameService.addListener('onCountDownStart', waitforplayerState.playerFound);

			// do some clean up
			gameService.addListener('onLeavingCurrentState', function () {

				gameService.removeListener('onOpponentArrived', waitforplayerState.popPlayer2Obj); // quit this listener
				gameService.removeListener('onCountDownStart', waitforplayerState.playerFound); // quit this listener

				console.log('[WaitForPlayerState]: leaving waitforplayer state');
			});
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

	// Populate Player 2 object
	popPlayer2Obj: function(opponent) {
    player2Obj = opponent; // reassign object to global variable

		//player2Caps = player2Obj.name.toUpperCase();
		player2Name.text = player2Obj.name; // change waiting text

		// load an asset outside of the preload function:
		const loader = new Phaser.Loader(game)

		if(player2Obj.image) {
			loader.image('player2Pic', player2Obj.image); // load FB pic
		} else {
			// Player 2 didn't login via FB, load avatar spritesheet instead
			loader.spritesheet('player2Pic', 'assets/images/nonFBPlayerPics.png', 225, 225, 8);
		}

		loader.onLoadComplete.addOnce(waitforplayerState.loadComplete);

		loader.start(); // load the pic


		console.log('Opponent has arrived:', player2Obj);
	},

	// load is complete, put player 2 image in a sprite
	loadComplete: function() {

		waitingPic.kill(); // delete waitingPic and replace it with P2 pic
		// pop in P2 pic
		player2Pic = game.add.sprite(game.world.centerX, 140, 'player2Pic');
		player2Pic.frame = game.rnd.integerInRange(0,7); // get a random avatar
		player2Pic.height = 225;
		player2Pic.width = 225;
		player2Pic.anchor.set(0.5);
		player2Pic.mask = player2PicMask;
		console.log('Player 2 pic load completed');
	},

	// Show player found text for 2 seconds
	playerFound: function() {
		waitingforplayerText.text = "Player\nFound!"; // change waiting text
		playerfoundSound.play(); // play sound effect
		waitingCircle.angle = 0; // spin waiting circle

		// Countdown timer to start game
		setTimeout(waitforplayerState.showCounter, 2000);
	},

	// Start countdown to game time
	showCounter: function() {
		counter = 3; // initialize countdown variable for 2s longer

		game.time.events.loop(Phaser.Timer.SECOND * 1, waitforplayerState.startGame, this);

		waitingforplayerText.kill(); // kill waiting text

		// Gameplay text
		gameplayText = game.add.text(game.world.centerX, game.world.centerY-320, ' Game Will \n Begin In ', { font: '90px UTTriumph-Regular', fill: '#C41230', align: 'center' });
		gameplayText.anchor.set(0.5);

		// Countdown text
		countdownText = game.add.text(game.world.centerX, game.world.centerY-40, counter, { font: '360px UTTriumph-Regular', fill: '#C41230' });
		countdownText.anchor.set(0.5);

		countdownSound.play(); // play sound effect first tick
	},

	update: function() {
		waitingCircle.angle += 1; // spin waiting circle
	},

	// Call play state when countdown finishes
	startGame: function() {
		counter = counter-1;
		countdownText.text = ' '+counter+' ';
		countdownSound.play(); // play sound effect
		if(counter == 0) {
			countdownSound.stop(); // kill counter sound
			playgameSound.play(); // play sound effect
			game.state.start('play');
		}
	},
};

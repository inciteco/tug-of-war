// WaitForPlayer.js

var waitforplayerState = {

	preload: function() {

		// Start to listen for Player 2
		gameService.findOpponent();
	},

	create: function() {

		// Set play canvas background color
		game.stage.backgroundColor = '#000';
		
		// AUDIO Declarations
		playerfoundSound = game.add.audio('playerfoundSound');
		countdownSound = game.add.audio('countdownSound');
		playgameSound = game.add.audio('playgameSound');
		
		// add game table sprite
		gameBoardWait = game.add.sprite(0, 0, 'gameBoardWait');

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

		// Player 2 Pic Stroke
		player2Stroke = game.add.sprite(game.world.centerX, 175, 'player1Stroke');
		player2Stroke.height = 261;
		player2Stroke.width = 261;
		player2Stroke.anchor.set(0.5);
		
		// Waiting Pic -- will eventually be replaced by Player 2 pic
		waitingPic = game.add.sprite(game.world.centerX, 175, 'waitingPic');
		waitingPic.height = 255;
		waitingPic.width = 255;
		waitingPic.anchor.set(0.5);

		// Player 2 Name -- Initially set to Waiting...
		player2Name = game.add.text(0, 0, 'OPPONENT', player2Font);
		player2Name.anchor.set(0.5);
    	player2Name.alignTo(waitingPic, Phaser.BOTTOM_CENTER, 0, 10);
		
		// Waiting Circle
		waitingCircle = game.add.sprite(game.world.centerX, game.world.centerY-160, 'waitingCircle');
		waitingCircle.anchor.set(0.5);

		// Waiting For Player text
		waitingforplayerText = game.add.text(game.world.centerX, game.world.centerY-160, 'WAITING\nFOR LIVE\nPLAYER', { font: 'bold 110px Arial', fill: '#000', align: 'center' });
		waitingforplayerText.anchor.set(0.5);

		// Player 2 has arrived, run popPlayer2Obj
		gameService.addListener('onOpponentArrived', waitforplayerState.popPlayer2Obj);

		// Start game countdown
		gameService.addListener('onCountDownStart', waitforplayerState.playerFound);

		// do some clean up
		gameService.addListener('onLeavingCurrentState', function () {

			gameService.removeListener('onOpponentArrived', waitforplayerState.popPlayer2Obj); // quit this listener
			gameService.removeListener('onCountDownStart', waitforplayerState.playerFound); // quit this listener

			console.log('[TestListener]: leaving waitforplayer state');
		});

	},

	// Populate Player 2 object
	popPlayer2Obj: function(opponent) {
		player2Obj = opponent; // reassign object to global variable
		
		waitingPic.kill(); // delete waitingPic and replace it with P2 pic

		player2Caps = player2Obj.name.toUpperCase();
		player2Name.text = player2Caps; // change waiting text

		// load an asset outside of the preload function:
		const loader = new Phaser.Loader(game)
		loader.image('player2Pic', player2Obj.image);
		loader.onLoadComplete.addOnce(waitforplayerState.loadComplete);
		
		loader.start(); // load the pic

		console.log('Opponent has arrived:', player2Obj);
	},

	// load is complete, put it in a sprite
	loadComplete: function() {
		// pop in P2 pic
		player2Pic = game.add.sprite(game.world.centerX, 175, 'player2Pic');
		player2Pic.height = 255;
		player2Pic.width = 255;
		player2Pic.anchor.set(0.5);
		console.log('Player 2 pic load completed');
	},

	// Show player found text for 2 seconds
	playerFound: function() {

		waitingforplayerText.text = "PLAYER\nFOUND!"; // change waiting text
		playerfoundSound.play(); // play sound effect
		
		// Countdown timer to start game
		setTimeout(waitforplayerState.showCounter, 2000);
	},
			
	// Start countdown to game time
	showCounter: function() {
		counter = 3; // initialize countdown variable for 2s longer
		
		game.time.events.loop(Phaser.Timer.SECOND * 1, waitforplayerState.startGame, this);
		
		waitingforplayerText.kill();
			
		// Gameplay text
		gameplayText = game.add.text(game.world.centerX, game.world.centerY-260, 'GAME WILL\nBEGIN IN', { font: 'bold 80px Arial', fill: '#000', align: 'center' });
		gameplayText.anchor.set(0.5);

		// Countdown text
		countdownText = game.add.text(game.world.centerX, game.world.centerY-40, counter, { font: 'bold 220px Arial', fill: '#000' });
		countdownText.anchor.set(0.5);
		
		countdownSound.play(); // play sound effect first tick
	},
	
	update: function() {
		waitingCircle.angle += 1;
	},

	// Call play state when countdown finishes
	startGame: function() {
		counter = counter-1;
		countdownText.text = counter;
		countdownSound.play(); // play sound effect
		if(counter == 0) {
			countdownSound.stop(); // kill counter sound
			playgameSound.play() // play sound effect
			game.state.start('play');
		}
	},
};

// WaitForPlayer.js

var waitforplayerState = {
	
	preload: function() {
		
		// Start to listen for Player 2
		gameService.findOpponent();
		
		game.load.image('avatarPic', 'testingAssets/waitingAvatar.png'); // Get waiting Avatar pic
	},
	
	create: function() {
		
		// Set play canvas background color
		game.stage.backgroundColor = '#000';
		
		// State title
		var gameTitleText = game.add.text(game.world.centerX, gHeight*.3, 'PHASER: waitforplayer.js', { font: '30px Arial', fill: 'yellow' });
		gameTitleText.anchor.set(0.5);
		
		// Player 1 Pic
		player1Pic = game.add.sprite(game.world.centerX-150, gHeight*.4, 'player1Pic');
		player1Pic.height = 100;
		player1Pic.width = 100;
		player1Pic.anchor.set(0.5);
		
		//Player 1 Name
		player1Name = game.add.text(game.world.centerX-150, gHeight*.46, player1Obj.name, { font: '16px Arial', fill: '#fff' });
		player1Name.anchor.set(0.5);
		
		// Avatar Pic -- will eventually be replaced by Player 2 pic
		avatarPic = game.add.sprite(game.world.centerX+150, gHeight*.4, 'avatarPic');
		avatarPic.height = 100;
		avatarPic.width = 100;
		avatarPic.anchor.set(0.5);
		
		//Player 2 Name -- Initially set to Waiting...
		player2Name = game.add.text(game.world.centerX+150, gHeight*.46, 'Player 2', { font: '16px Arial', fill: '#fff' });
		player2Name.anchor.set(0.5);
		
		// Versus text
		var versusText = game.add.text(game.world.centerX, gHeight*.4, 'vs.', { font: '30px Arial', fill: '#fff' });
		versusText.anchor.set(0.5);
		
		// Waiting For Player text
		waitingforplayerText = game.add.text(game.world.centerX, gHeight*.5, 'WAITING FOR PLAYER...', { font: '30px Arial', fill: '#fff' });
		waitingforplayerText.anchor.set(0.5);
		
		// Player 2 has arrived, run popPlayer2Obj
		gameService.addListener('onOpponentArrived', waitforplayerState.popPlayer2Obj);
		
		// Start game countdown
		gameService.addListener('onCountDownStart', waitforplayerState.showCounter); 
		
		// do some clean up
		gameService.addListener('onLeavingCurrentState', function () {
			
			gameService.removeListener('onOpponentArrived', waitforplayerState.popPlayer2Obj); // quit this listener
			gameService.removeListener('onCountDownStart', waitforplayerState.showCounter); // quit this listener
			
			console.log('[TestListener]: leaving waitforplayer state');
		});
		
	},
	
	// Populate Player 2 object
	popPlayer2Obj: function(opponent) {
		player2Obj = opponent; // reassign object to global variable

		waitingforplayerText.text = "PLAYER FOUND!"; // change waiting text

		player2Name.text = player2Obj.name; // change waiting text
		
		game.load.image('player2Pic', player2Obj.image); // Get Player 2 pic from object

		avatarPic.kill(); // delete avatarPic and replace it with P2 pic

		// pop in P2 pic
		player2Pic = game.add.sprite(game.world.centerX+150, gHeight*.4, 'player2Pic');
		player2Pic.height = 100;
		player2Pic.width = 100;
		player2Pic.anchor.set(0.5);

		console.log('[TestListener]: opponent arrived:', player2Obj);
	},
	
	// Show Countdown timer
	showCounter: function(secondsUntilStart) {
		
		// Countdown timer to start game
		counter = 10; // initialize countdown variable
		game.time.events.loop(Phaser.Timer.SECOND * 1, waitforplayerState.startGame, this);

		// Countdown text
		countdownText = game.add.text(game.world.centerX, gHeight*.6, counter, { font: '80px Courier', fill: '#ffffff' });
		countdownText.anchor.set(0.5);		
	},	
	
	// Call play state when countdown finishes
	startGame: function() {
		counter = counter-1;
		countdownText.text = counter;
		if(counter == 0) {
			game.state.start('play');
		}
	},
};
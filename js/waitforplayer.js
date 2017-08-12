// WaitForPlayer.js

var waitforplayerState = {
	
	preload: function() {
		
		// Start to listen for Player 2
		this.fetchRemotePlayer();
		
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
		
	},
	
	// When we're ready for another player to join, call this
	fetchRemotePlayer: function(forceFailure) {
		if (forceFailure) {
			// request cannot be made (assume connection problems, show try again button, etc...)
			return false;
		}
	  
		// For now, assume player found and load object
		player2Obj = this.getRemotePlayer(); // populate Player 2 object
		game.load.image('player2Pic', player2Obj.image); // Get Player 1 pic from object
		
		// For now, call it after 3 seconds
		setTimeout(this.onRemotePlayerArrived, 5000);

		// request has been made, a user should arrive shortly
		return true;
	},
	
	onConnectionError: function(error) {
		console.log('something went wrong: ', error)
	},
	
	onRemotePlayerArrived: function() {
		
		waitingforplayerText.text = "PLAYER FOUND!"; // change waiting text
		
		player2Name.text = player2Obj.name; // change waiting text
		
		avatarPic.kill(); // delete avatarPic and replace it with P2 pic
		
		// pop in P2 pic
		player2Pic = game.add.sprite(game.world.centerX+150, gHeight*.4, 'player2Pic');
		player2Pic.height = 100;
		player2Pic.width = 100;
		player2Pic.anchor.set(0.5);
		
		// Countdown timer to start game
		counter = 5; // initialize countdown variable
		game.time.events.loop(Phaser.Timer.SECOND * 1, waitforplayerState.startGame, this);
		
		// Countdown text
		countdownText = game.add.text(game.world.centerX, gHeight*.6, counter, { font: '80px Courier', fill: '#ffffff' });
		countdownText.anchor.set(0.5);	
		
		console.log('remote player arrived:', player2Obj.name);
		
		
		// remote player arrived: {
		//  image: 'http://service.game.com/player-1.png',
		//  name: 'remote-player-name'
		// }
	},
	
	// Get Player 2 data
	getRemotePlayer: function () {
	  return {
		image: 'http://incitemagic.net/brs/phaser/popeyes/testingAssets/sandy.jpg',
		name: 'Sandy L.'
	  }
	},
	
	// Call play state
	startGame: function() {
		counter = counter-1;
		countdownText.text = counter;
		if(counter == 0) {
			game.state.start('play');
		}
	},
};
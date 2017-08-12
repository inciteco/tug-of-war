// Win.js

var winState = {
	
	create: function() {
		
		// Audio Declarations
		under500 = game.add.audio('under500');
		over500 = game.add.audio('over500');
		
		if(gameWinner == player1Obj.name){
			over500.play();
		} else {
			under500.play();
		}
		
		// Game title
		var gameOverText = game.add.text(game.world.centerX, gHeight*.3, 'GAME OVER', { font: '50px Arial', fill: '#ffffff' });
		gameOverText.anchor.set(0.5);
		
		// Final Score
		var winnerText = game.add.text(game.world.centerX, gHeight*.5, 'Winner: ' + gameWinner, { font: '40px Arial', fill: '#ffff33' });
		winnerText.anchor.set(0.5);
		
		// Final Score
		//var finalScoreText = game.add.text(game.world.centerX, gHeight*.5, 'Final Score: ' + score, { font: '40px Arial', fill: '#ffff33' });
		//finalScoreText.anchor.set(0.5);
		
		// User clicks this to start game
		var restartGameButton = game.add.sprite(game.world.centerX, gHeight*.7, 'restartGameButton');
		restartGameButton.anchor.set(0.5);
		restartGameButton.inputEnabled = true;
		restartGameButton.width = gWidth*.3;
		restartGameButton.height = (gWidth*.3)/3;
		restartGameButton.events.onInputDown.add(this.restartGame, this);
	},
	
	// Call play state
	restartGame: function() {
		game.state.start('howtoplay');
	},
};
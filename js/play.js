// Play.js

var playState = {
	
	create: function() {
		
		// Set play canvas background color
		game.stage.backgroundColor = '#124184';
		
		// Initialize game variables
		score = 0; // Player 1 total score
		timerVal = 2; // initial seconds interval for bubble appearance

		// AUDIO Declarations
		blaster = game.add.audio('blaster');
		bgMusic = game.add.audio('bgMusic');
		badTap = game.add.audio('badTap');

		// TEXT declarations
		
			// Total Score text
			scoreText = game.add.text(10, 10, 'Total score: 0', { fontSize: '32px', fill: '#000' });
		
			// Tap response text initialization
			shoutOutText = game.add.text(0, 0, "");
		
			// Temp: game state title
			var stateTitle = game.add.text(gWidth-150, 30, 'PHASER: play.js', { fontSize: '32px', fill: '#fff' });
			stateTitle.anchor.set(0.5);
		
		// Add SPRITES
		
			// Set finger tap area
			tapArea = game.add.sprite(0,gHeight-400, 'tapArea');
			game.physics.enable(tapArea, Phaser.Physics.ARCADE);
			tapArea.width = gWidth;
			tapArea.height = 400;
			tapArea.inputEnabled = true;

			// Set tap bubbles
			tapBubble = game.add.sprite(randPosX, randPosY, 'tapBubble');
			game.physics.enable(tapBubble, Phaser.Physics.ARCADE);
			tapBubble.body.collideWorldBounds = true; // keep bubbles within stage
			tapBubble.width = randSizeXY;
			tapBubble.height = randSizeXY;
			tapBubble.anchor.set(0.5);
			tapBubble.inputEnabled = true;

			// Set tug of war path
			rail = game.add.sprite(game.world.centerX,200, 'rail');
			rail.width = 10;
			rail.height = gHeight-750;
		
			// Set tug of war crossbar
			crossbar = game.add.sprite(game.world.centerX, crossbarPos, 'rail');
			crossbar.width = gWidth*.8;
			crossbar.height = 10;
			crossbar.anchor.set(0.5);

			// Set chicken leg
			chicken = game.add.sprite(game.world.centerX,gHeight*.35, 'chicken');
			game.physics.enable(chicken, Phaser.Physics.ARCADE);
			chicken.width = gWidth*.2;
			chicken.height = chicken.width/1.29;
			chicken.anchor.set(0.5);

		// ACTIONS and EVENTS
			
			// Game play has started, run this stuff
			gameService.addListener('onGameplayStart', function () {
				console.log('[TestListener]: onGameplayStart');
			});
		
			// When opponent moves, do this stuff
			gameService.addListener('onOpponentMove', function (move) {
				
				// update P2 move
				p2Move = move;
				chicken.body.velocity.y += p2Move; // adjust chicken velocity
				console.log('[TestListener]: remote player moved:', move);
			});
		
			// When game is over, do this stuff
			gameService.addListener('onGameplayEnd', function (userWon) {
				
				bgMusic.stop(); // Stop background music
		
				// Find out where chicken box is to determine winner
				if(chicken.position.y > crossbarPos) {
					gameWinner = player1Obj.name;
				} else {
					gameWinner = player2Obj.name;
				}
				
				userWon = gameWinner;
				
				game.state.start('win'); // call win state
				
				console.log('[TestListener]: onGameplayEnd, user won?', userWon);
			});
		
			// Start the background music
			bgMusic.play();
		
			// Start the timer loop for bubble appear/disappear
			timerPos = game.time.events.loop(Phaser.Timer.SECOND * timerVal, this.newBubble.bind(this), this);
		
			// Get current time for very first tapBubble
			nowTime = this.time.now;
			tapTime = nowTime; //initialize tapTime for notTapping function
		
			// When player taps bubble, kill it and update score
			tapBubble.events.onInputDown.add(this.updateScore, this);
			tapArea.events.onInputDown.add(this.missedBubble, this);
	},

	update: function() {
		// If chicken leg crosses threshold, end game
		if(chicken.position.y >= gHeight-550 || chicken.position.y <= 200) {
			gameService.endGame();
		}
		
		// If user isn't tapping, give shoutOut and penalize
		this.notTapping();	
	},

	// function to create random bubbles
	newBubble: function() {
		
		tapBubble.kill(); // Destroy bubble
		
		nowTime = game.time.now; // Get time the bubble was killed
		
		// Set new random position and size for next bubble
		randPosX = game.rnd.integerInRange(0, gWidth);
		randPosY = game.rnd.integerInRange(gHeight-300, gHeight-150)
		randSizeXY = game.rnd.integerInRange(minBall, maxBall);

		// Create new bubble and its physics
		tapBubble = game.add.sprite(randPosX, randPosY, 'tapBubble');
		game.physics.enable(tapBubble, Phaser.Physics.ARCADE);
		tapBubble.body.collideWorldBounds = true;
		tapBubble.width = randSizeXY;
		tapBubble.height = randSizeXY;
		tapBubble.anchor.set(0.5);
		tapBubble.inputEnabled = true;
		tapBubble.events.onInputDown.add(this.updateScore, this);
		
		// Slowly increase bubble speed by 1/10 second up to point
		if(timerPos.delay >= 800) {
			timerPos.delay -= 100;
		}
	},
	
	// function called when P1 taps tapArea and not tapBubble
	missedBubble: function() {
		
		shoutOutText.kill(); // Destroy response text
		badTap.play(); // play badTap sound effect
		p1Move = -.5; // update Player 1 move
		tapMisses++; // update # of tapMisses
		chicken.body.velocity.y += p1Move;
		
		// Update Total Score and Text
			score += scoreValues[7]; 
			scoreText.text = ' Total Score: ' + score; 
		
			this.updateShoutOutText(scoreValues[7] + "pts \n" + scoreResponse[7]);
		
		// Send P1 move to server
		gameService.makeMove(p1Move);
	},
	
	notTapping: function() {
		
		// If 3 seconds have passed, shout and penalize
		if(tapTime+3000 <= game.time.now) {
			shoutOutText.kill(); // Destroy response text
			this.updateShoutOutText("Start Tapping!");
			p1Move = -.5;
			chicken.body.velocity.y += p1Move;
			
			gameService.makeMove(p1Move); // Send P1 move to server
			
			tapWarnings++; // update # of warnings
			
			tapTime = game.time.now; // reset time since warning	
		}
	},

	// function called when P1 taps tapBubble
	updateScore: function() {
		
		shoutOutText.kill(); // Destroy response text
		
		blaster.play(); // Play bubble pop effect

		tapBubble.kill(); // Destroy bubble
		
		tapTime = game.time.now; // Get time the bubble was popped

		tapScore = tapTime-nowTime; // Calculate speed of bubble pop
		
		tapsArray.push(tapScore); // store this tapScore
		
		totalTaps++; // update total # of successful taps
		
		// Determine speed score for response text and +/- chicken leg velocity
		switch (true) {
			case (tapScore <= 375):
				tmpY = 6;
				p1Move = 3;
				break;
			case (tapScore <= 550 && tapScore > 375):
				tmpY = 5;
				p1Move = 2;
				break;
			case (tapScore <= 750 && tapScore > 550):
				tmpY = 4;
				p1Move = 1;
				break;
			case (tapScore <= 850 && tapScore > 750):
				tmpY = 3;
				p1Move = -1;
				break;
			case (tapScore <= 1050 && tapScore > 850):
				tmpY = 2;
				p1Move = -2;
				break;
			case (tapScore <= 1300 && tapScore > 1050):
				tmpY = 1;
				p1Move = -3;
				break;
			case (tapScore > 1300):
				tmpY = 0;
				p1Move = 0;
				break;		
		}
		
		// update chicken velocity with P1 move
		chicken.body.velocity.y += p1Move;
		
		// Send P1 move to server
		gameService.makeMove(p1Move);

		//  Update the total score and give tap response text
		
			// Update Total Score and Text
			score += scoreValues[tmpY]; 
			scoreText.text = ' Total Score: ' + score; 
		
			this.updateShoutOutText(scoreValues[tmpY] + "pts \n" + scoreResponse[tmpY]);
			
		this.newBubble(); // Create a new tap bubble
	},
	
	// function called to update response text
	updateShoutOutText: function(shoutText){
		// Update tap response text
			shoutOutText = game.add.text(game.world.centerX, 100, shoutText, {
				font: "52px Arial",
				fill: "#fff",
				align: "center"
			});
			shoutOutText.anchor.set(0.5);
		
			game.add.tween(shoutOutText).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true); // Fade out response text	
	},

	render: function() {
		game.debug.text("Player 1 Move: " + p1Move, 10, 100);
    	game.debug.text("Player 2 Move: " + p2Move, 10, 130);

	}
}
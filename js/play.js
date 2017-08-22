// Play.js

var playState = {
	
	create: function() {
		
		// Set play canvas background color
		game.stage.backgroundColor = '#000';
		
		// Initialize game variables
		score = 0; // Player 1 total score
		timerVal = .9; // initial seconds interval for bubble appearance
		gameCount = 45 // duration of game
		threeMisses = 0; // initial threeMisses variable
		
		// start game timer
		gameTimer = game.time.create(false); // create timer
		gameTimer.loop(1000, this.updateGameCounter, this); // start 1s loop
		gameTimer.start(); // start timer

		// AUDIO Declarations
		blaster = game.add.audio('blaster');
		bgMusic = game.add.audio('bgMusic');
		badTap = game.add.audio('badTap');
		
		// Add SPRITES
		
			// add game table sprite
			gameBoard = game.add.sprite(0, 0, 'gameBoard');
		
			// Player 2 Pic Stroke
			player2Stroke = game.add.sprite(game.world.centerX, 175, 'player1Stroke');
			player2Stroke.height = 261;
			player2Stroke.width = 261;
			player2Stroke.anchor.set(0.5);
		
			// Player 2 Pic 
			player2Pic = game.add.sprite(game.world.centerX, 175, 'player2Pic');
			player2Pic.height = 255;
			player2Pic.width = 255;
			player2Pic.anchor.set(0.5);
		
			// Set finger tap area for missed taps
			tapArea = game.add.sprite(game.world.centerX, 1790, 'tapArea');
			game.physics.enable(tapArea, Phaser.Physics.ARCADE);
			tapArea.width = 1300;
			tapArea.height = 620;
			tapArea.anchor.set(0.5);
			tapArea.alpha = 0;
			tapArea.inputEnabled = true;
		
			// Initialize Shoutouts
			shoutOuts = game.add.sprite(game.world.centerX, 1385, 'shoutOuts', 0);
			shoutOuts.scale.setTo(.7,.7);
			shoutOuts.anchor.set(0.5);
			shoutOuts.visible = false;
		
			// Set game boundaries
			bounds = new Phaser.Rectangle(70, 1480, 1300, 540);
			game.physics.arcade.setBounds(70, 1480, 1300, 540);
		
			// create a bubble
			this.createTapBubble();

			// Set bigBox
			bigBox = game.add.sprite(game.world.centerX, 875, 'bigBox');
			game.physics.enable(bigBox, Phaser.Physics.ARCADE);
			bigBox.anchor.set(0.5);
		
		// TEXT declarations
		
			// Total Score text
			//scoreText = game.add.text(10, 10, 'Total score: 0', { fontSize: '32px', fill: '#000' });
		
			// Player 2 Name 
			player2Name = game.add.text(0, 0, player2Caps, player2Font);
			player2Name.anchor.set(0.5);
			player2Name.alignTo(waitingPic, Phaser.BOTTOM_CENTER, 0, 10);
		
			// Game timer countdown
			gameTimerText = game.add.text(90, 1340, ':' + 45, {
				font: "bold 110px Arial",
				fill: "#fff",
				align: "center"
			});

		// ACTIONS and EVENTS
			
			// Game play has started, run this stuff
			gameService.addListener('onGameplayStart', function () {
				console.log('[TestListener]: onGameplayStart');
			});
		
			// When opponent moves, do this stuff
			gameService.addListener('onOpponentMove', function (move) {
				
				// update P2 move
				p2Move = move;
				bigBox.body.velocity.y += p2Move; // adjust bigBox velocity
				console.log('[TestListener]: remote player moved:', move);
			});
		
			// When game is over, do this stuff
			gameService.addListener('onGameplayEnd', function (userWon) {
				
				bgMusic.stop(); // Stop background music
				gameTimer.stop(false); // stop and reset the game timer
				bigBox.body.velocity.y = 0; // stop the bigBox
		
				// Find out where bigBox box is to determine winner
				if(bigBox.position.y > crossbarPos) {
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
		
			// Listen for missed taps
			tapArea.events.onInputDown.add(this.missedBubble, this);
	},

	update: function() {
		// set scaling formula for big box
		diffY = baseY-bigBox.position.y;
		if(diffY > 0){
			scaleVal = 1-(diffY/1400);
			bigBox.scale.setTo(scaleVal, scaleVal);
		} else {
			diffY = Math.abs(diffY);
			scaleVal = 1+(diffY/2000);
			bigBox.scale.setTo(scaleVal, scaleVal);
		}
		
		// If bigBox crosses threshold, end game
		if(bigBox.position.y >= 1290 || bigBox.position.y <= 560) {
			gameService.endGame();
		}
		
		// If user isn't tapping, give shoutOut and penalize
		this.notTapping();
		
		// throttle velocity
		switch (true) {
			case (bigBox.body.velocity.y >= 40):
				bigBox.body.velocity.y += -20;
				break;
			case (bigBox.body.velocity.y <= -40):
				bigBox.body.velocity.y += 20;
				break;
		}
		
		//game.physics.arcade.collide(tapArea, tapBubble);
	},
	
	// Total game timer
	updateGameCounter: function() {
		gameCount = gameCount-1;
		gameTimerText.text = ':' + gameCount;	
	},
	
	createTapBubble: function() {
		// Set tap bubbles
		randSprite = game.rnd.integerInRange(0, 8); // pick a random sprite
		tapBubble = game.add.sprite(bounds.randomX, bounds.randomY, 'tapBubble', randSprite);
		game.physics.enable(tapBubble, Phaser.Physics.ARCADE);
		tapBubble.body.collideWorldBounds = true; // keep bubbles within stage
		tapBubble.width = randSizeXY;
		tapBubble.height = randSizeXY;
		tapBubble.anchor.set(0.5, 0.5);
		tapBubble.inputEnabled = true;
		
		tapBubble.events.onInputDown.add(this.updateScore, this);
	},

	// function to create random bubbles
	newBubble: function() {
		
		tapBubble.kill(); // Destroy bubble
		
		nowTime = game.time.now; // Get time the bubble was killed
		
		// Set size for next bubble
		randSizeXY = game.rnd.integerInRange(minBall, maxBall);

		// Create new bubble and its physics
		playState.createTapBubble();
		
		// Slowly increase bubble speed by 1/10 second up to point
		if(timerPos.delay >= 460) {
			timerPos.delay -= 40;
		}
		
		// if user misses three in a row, slow down the bubbles
		if(threeMisses >= 3) {
			timerPos.delay += 230;
			threeMisses = 0;
		}
	},
	
	// function called when P1 taps tapArea and not tapBubble
	missedBubble: function() {
		
		shoutOuts.kill(); // Destroy response text
		badTap.play(); // play badTap sound effect
		p1Move = missOrNoTap; // update Player 1 move
		tapMisses++; // update # of tapMisses
		threeMisses++; // add to threeMisses flag
		bigBox.body.velocity.y += p1Move; // update bigBox velocity
		tapArea.alpha = .4; // brings up alpha error flash
		setTimeout('tapArea.alpha = 0', 100); // turn off error
		
		// Update Total Score and Text
			score += scoreValues[7]; 
		//	scoreText.text = ' Total Score: ' + score; 
		
			this.updateShoutOut(8);
		
		// Send P1 move to server
		gameService.makeMove(p1Move);
	},
	
	notTapping: function() {
		
		// If 3 seconds have passed, shout and penalize
		if(tapTime+3000 <= game.time.now) {
			shoutOuts.kill(); // Destroy response text
			this.updateShoutOut(9);
			p1Move = missOrNoTap;
			bigBox.body.velocity.y += p1Move;
			
			gameService.makeMove(p1Move); // Send P1 move to server
			
			tapWarnings++; // update # of warnings
			
			tapTime = game.time.now; // reset time since warning	
		}
	},

	// function called when P1 taps tapBubble
	updateScore: function() {
		
		threeMisses = 0; // reset threeMisses variable
		
		shoutOuts.kill(); // Destroy response text
		
		blaster.play(); // Play bubble pop effect
		
		// play tap effects
		tapBubble.loadTexture('afterPulse', 0); // load pulse texture
		tapBubble.animations.add('tapped'); // add animation
		tapBubble.animations.play('tapped', 60, false); // play animation
		
		tapBubble.events.onAnimationComplete = new Phaser.Signal();
		tapBubble.events.onAnimationComplete.add(function() { playState.newBubble; });
		
		tapTime = game.time.now; // Get time the bubble was popped

		tapScore = tapTime-nowTime; // Calculate speed of bubble pop
		
		tapsArray.push(tapScore); // store this tapScore
		
		totalTaps++; // update total # of successful taps
		
		// Determine speed score for response text and +/- bigBox leg velocity
		switch (true) {
			case (tapScore <= 325):
				tmpY = 6;
				p1Move = 15;
				break;
			case (tapScore <= 375 && tapScore > 325):
				tmpY = 5;
				p1Move = 10;
				break;
			case (tapScore <= 450 && tapScore > 375):
				tmpY = 4;
				p1Move = 5;
				break;
			case (tapScore <= 525 && tapScore > 450):
				tmpY = 3;
				p1Move = -5;
				break;
			case (tapScore <= 625 && tapScore > 525):
				tmpY = 2;
				p1Move = -10;
				break;
			case (tapScore <= 750 && tapScore > 625):
				tmpY = 1;
				p1Move = -15;
				break;
			case (tapScore > 750):
				tmpY = 0;
				p1Move = -20;
				break;		
		}
		
		// update bigBox velocity with P1 move
		bigBox.body.velocity.y += p1Move;
		
		// Send P1 move to server
		gameService.makeMove(p1Move);

		//  Update the total score and give tap response text
		
			// Update Total Score and Text
			score += scoreValues[tmpY]; 
		//	scoreText.text = ' Total Score: ' + score; 
		
			this.updateShoutOut(tmpY);
	},
	
	// function called to update response text
	updateShoutOut: function(shoutOutSprite){
		// Update Shoutouts
		shoutOuts = game.add.sprite(game.world.centerX, 1385, 'shoutOuts', shoutOutSprite);
		shoutOuts.scale.setTo(.7,.7);
		shoutOuts.anchor.set(0.5);
		shoutOuts.visible = true;

		game.add.tween(shoutOuts).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true); // Fade out response text	
	},

	render: function() {
		game.debug.rectangle(bounds, '#ffffff', false);
		game.debug.text("Player 1 Move: " + p1Move, 10, 100);
    	game.debug.text("Player 2 Move: " + p2Move, 10, 130);
		game.debug.text("bigBox Velocity: " + bigBox.body.velocity.y, 10, 160);
    	game.debug.text("Box position: " + bigBox.position.y, 10, 190);

	}
}
// Load.js

var loadState = {
	
	// Preload all game assets
	preload: function() {
		
		// Set play canvas background
		popeyesBG = game.add.sprite(0, 0, 'popeyesBG');
		popeyesBG.height = gHeight;
		popeyesBG.width = gWidth;
		
		// Waiting Circle Shadow
		waitingCircleShadow = game.add.sprite(game.world.centerX, game.world.centerY-135, 'waitingCircleShadow');
		waitingCircleShadow.anchor.set(0.5);
		
		// Waiting Circle
		waitingCircle = game.add.sprite(game.world.centerX, game.world.centerY-160, 'waitingCircle');
		waitingCircle.anchor.set(0.5);
	
		// Load graphic assets
		game.load.image('toPlayCard', 'assets/images/toPlayCard.png');
		game.load.image('startCravingButton', 'assets/images/startCravingButton.png');
		game.load.image('whiteLine', 'assets/images/whiteLine.png');
		game.load.image('playerPicStroke', 'assets/images/playerPicStroke.png');
		game.load.spritesheet('tapBubble', 'assets/images/popeyesItemsSheet.png', 500, 500, 9);
		game.load.spritesheet('afterPulse', 'assets/images/afterPulse.png', 400, 400, 7);
		game.load.image('gameWon', 'assets/images/winSplash.png');
		game.load.image('gameLost', 'assets/images/loseSplash.png');
		game.load.image('waitingPic', 'assets/images/waitingPlayerPic.png'); // Get waiting player temp pic
		game.load.image('tapArea', 'assets/images/tapMissArea.png');
		game.load.spritesheet('soundToggleButton', 'assets/images/soundToggleButton.png', 98, 98, 2);
		game.load.spritesheet('nonFBPlayerPics', 'assets/images/nonFBPlayerPics.png', 225, 225, 8);
		game.load.image('bigBox', 'assets/images/bigBox.png');
		game.load.image('gameBoard', 'assets/images/gameTable.png');
		game.load.spritesheet('confetti', 'assets/images/confettisheet.jpg', 8, 8);
		game.load.spritesheet('shoutOuts', 'assets/images/shoutouts.png', 500, 200, 10);
		
	
		// Load audio assets
		game.load.audio('tapHit', 'assets/sounds/tapHit.wav');
		game.load.audio('tapHitCoke', 'assets/sounds/tapHitCoke.wav');
		game.load.audio('bgMusic', 'assets/sounds/bgMusic.wav');
		game.load.audio('tapMiss', 'assets/sounds/tapMiss.wav');
		game.load.audio('youLose', 'assets/sounds/youLose.wav');
		game.load.audio('youWin', 'assets/sounds/youWin.wav');
		game.load.audio('playerfoundSound', 'assets/sounds/playerFind.wav');
		game.load.audio('countdownSound', 'assets/sounds/321_cntdn.wav');
		game.load.audio('tenSecsLeft', 'assets/sounds/10s_cntdn.wav');
		game.load.audio('playgameSound', 'assets/sounds/GO_cntdn.wav');	
		
		// Show loading progress
		setLoadingText = game.add.text(game.world.centerX, game.world.centerY-100, '', { font: '320px UTTriumph-Regular', fill: '#F58426' });
		setLoadingText.anchor.set(0.5, 0.5);
	},
	
	loadUpdate: function() {     
		waitingCircle.angle += 1; // spin waiting circle
		// update loading text percent
		setLoadingText.text = game.load.progress+'%';
		if(game.load.progress > 96) {
			setLoadingText.text = 'Load Complete';
		}
	},
	
	create: function() {
		// Gameplay text
		gameplayText = game.add.text(game.world.centerX, game.world.centerY-360, ' Loading ', { font: '100px UTTriumph-Regular', fill: '#F58426' });
		gameplayText.anchor.set(0.5, 0.5);
		
		game.state.start("howtoplay");
	},
};
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
		
		// Loading Label
		loadingLabel = game.add.sprite(game.world.centerX, game.world.centerY-320, 'loadingLabel');
		loadingLabel.anchor.set(0.5);
	
		// Load graphic assets
		game.load.image('toPlayCard', 'assets/images/toPlayCard.png');
		game.load.image('fbShareButton', 'assets/images/shareOnFacebook.png');
		game.load.image('playAgainButton', 'assets/images/playAgain.png');
		game.load.image('tryAgainButton', 'assets/images/tryAgainButton.png');
		game.load.image('craveoffLogo', 'assets/images/popeyesCraveLogo.png');
		game.load.image('startCravingButton', 'assets/images/startCravingButton.png');
		game.load.image('whiteLine', 'assets/images/whiteLine.png');
		game.load.image('playerPicStroke', 'assets/images/playerPicStroke.png');
		game.load.spritesheet('tapBubble', 'assets/images/popeyesItemsSheet.png', 500, 500, 6);
		game.load.spritesheet('afterPulse', 'assets/images/afterPulse.png', 400, 400, 7);
		game.load.image('gameWon', 'assets/images/winSplash.png');
		game.load.image('gameLost', 'assets/images/loseSplash.png');
		game.load.image('waitingPic', 'assets/images/waitingPlayerPic.png'); // Get waiting player temp pic
		game.load.image('tapArea', 'assets/images/tapMissArea.png');
		game.load.spritesheet('soundToggleButton', 'assets/images/soundToggleButton.png', 98, 98, 2);
		game.load.image('bigBox', 'assets/images/bigBox.png');
		game.load.image('gameBoard', 'assets/images/gameTable.png');
		game.load.image('somethingWrongWindow', 'assets/images/somethingWrongWindow.png');
		game.load.spritesheet('confetti', 'assets/images/confettisheet.jpg', 8, 8);
		game.load.spritesheet('shoutOuts', 'assets/images/shoutouts.png', 500, 200, 10);
	
		// Load audio assets
		game.load.audio('tapHit', ['assets/sounds/tapHit.mp3', 'assets/sounds/tapHit.ogg']);
		game.load.audio('tapHitCoke', ['assets/sounds/tapHitCoke.mp3','assets/sounds/tapHitCoke.ogg']);
		game.load.audio('bgMusic', ['assets/sounds/bgMusic.mp3','assets/sounds/bgMusic.ogg']);
		game.load.audio('tapMiss', ['assets/sounds/tapMiss.mp3','assets/sounds/tapMiss.ogg']);
		game.load.audio('youLose', ['assets/sounds/youLose.mp3','assets/sounds/youLose.ogg']);
		game.load.audio('youWin', ['assets/sounds/youWin.mp3','assets/sounds/youWin.ogg']);
		game.load.audio('playerfoundSound', ['assets/sounds/playerFind.mp3','assets/sounds/playerFind.ogg']);
		game.load.audio('countdownSound', ['assets/sounds/321_cntdn.mp3','assets/sounds/321_cntdn.ogg']);
		game.load.audio('tenSecsLeft', ['assets/sounds/10s_cntdn.mp3','assets/sounds/10s_cntdn.ogg']);
		game.load.audio('playgameSound', ['assets/sounds/GO_cntdn.mp3','assets/sounds/GO_cntdn.ogg']);
		
		// Gameplay text
//		gameplayText = game.add.text(game.world.centerX, game.world.centerY-360, '', { font: '100px UTTriumph-Regular', fill: '#F58426' });
//		gameplayText.anchor.set(0.5, 0.5);
		
		// Show loading progress
		setLoadingText = game.add.text(game.world.centerX, game.world.centerY-100, ' ', loadingFont);
		setLoadingText.anchor.set(0.5, 0.5);
	},
	
	loadUpdate: function() {   
		
		waitingCircle.angle += 1; // spin waiting circle
		// update loading text percent
		setLoadingText.text = game.load.progress+'%';
		if(game.load.progress > 96) {
			//gameplayText.text = ' Complete! ';
			//setLoadingText.text = '100%';
		}
	},
	
	create: function() {
		game.state.start("howtoplay");
	},
};
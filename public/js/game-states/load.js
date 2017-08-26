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
		
//		preLoadBar = game.add.sprite(game.world.centerX, game.world.centerY+100, 'preLoadBar');
//		preLoadBar.anchor.set(0.5);
//    	this.load.setPreloadSprite(preLoadBar);
	
		// Load graphic assets
		game.load.image('toPlayCard', 'assets/finalassets/toPlayCard.png');
		game.load.image('startCravingButton', 'assets/finalassets/startCravingButton.png');
		game.load.image('whiteLine', 'assets/finalassets/whiteLine.png');
		game.load.image('playerPicStroke', 'assets/finalassets/playerPicStroke.png');
		game.load.spritesheet('tapBubble', 'assets/finalassets/popeyesItemsSheet.png', 500, 500, 9);
		game.load.spritesheet('afterPulse', 'assets/finalassets/afterPulse.png', 400, 400, 7);
		game.load.image('gameWon', 'assets/finalassets/winSplash.png');
		game.load.image('gameLost', 'assets/finalassets/loseSplash.png');
		game.load.image('waitingPic', 'assets/finalassets/waitingPlayerPic.png'); // Get waiting player temp pic
		game.load.image('tapArea', 'assets/finalassets/tapMissArea.png');
		game.load.spritesheet('soundToggleButton', 'assets/finalassets/soundToggleButton.png', 98, 98, 2);
		game.load.spritesheet('nonFBPlayerPics', 'assets/finalassets/nonFBPlayerPics.png', 225, 225, 8);
		game.load.image('bigBox', 'assets/finalassets/bigBox.png');
		game.load.image('gameBoard', 'assets/finalassets/gameTable.png');
		
		
		
		//game.load.image('gameBoardWait', 'testingAssets/gameBoardWait.jpg');
		
		
		game.load.spritesheet('shoutOuts', 'assets/finalassets/shoutouts.png', 500, 200, 10);
		
	
		// Load audio assets
		game.load.audio('tapHit', 'assets/finalassets/sounds/tapHit.wav');
		game.load.audio('bgMusic', 'assets/finalassets/sounds/bgMusic.wav');
		game.load.audio('tapMiss', 'assets/finalassets/sounds/tapMiss.wav');
		game.load.audio('youLose', 'assets/finalassets/sounds/youLose.wav');
		game.load.audio('youWin', 'assets/finalassets/sounds/youWin.wav');
		game.load.audio('playerfoundSound', 'assets/finalassets/sounds/playerFind.wav');
		game.load.audio('countdownSound', 'assets/finalassets/sounds/321_cntdn.wav');
		game.load.audio('tenSecsLeft', 'assets/finalassets/sounds/10s_cntdn.wav');
		game.load.audio('playgameSound', 'assets/finalassets/sounds/GO_cntdn.wav');	
		
		// Gameplay text
		gameplayText = game.add.text(game.world.centerX, game.world.centerY-260, 'LOADING...', { font: 'bold 80px Arial', fill: '#000', align: 'center' });
		gameplayText.anchor.set(0.5);
		
		// Show loading progress
		setLoadingText = game.add.text(game.world.centerX, game.world.centerY-100, '', { font: 'bold 220px Arial', fill: '#000'});
		setLoadingText.anchor.set(0.5, 0.5);
	},
	
	loadUpdate: function() {            // update loading text percent
		waitingCircle.angle += 1; // spin waiting circle
		setLoadingText.text = game.load.progress+'%';
		if(game.load.progress > 96) {
			setLoadingText.text = 'Load Complete';
		}
	},
	
	create: function() {
		game.state.start("howtoplay");
	},
};
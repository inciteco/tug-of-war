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
		game.load.image('toPlayCard', 'finalassets/toPlayCard.png');
		game.load.image('startCravingButton', 'finalassets/startCravingButton.png');
		game.load.image('whiteLine', 'finalassets/whiteLine.png');
		game.load.image('playerPicStroke', 'finalassets/playerPicStroke.png');
		game.load.spritesheet('tapBubble', 'finalassets/popeyesItemsSheet.png', 500, 500, 9);
		game.load.spritesheet('afterPulse', 'finalassets/afterPulse.png', 400, 400, 7);
		game.load.image('gameWon', 'finalassets/winSplash.png');
		game.load.image('gameLost', 'finalassets/loseSplash.png');
		game.load.image('waitingPic', 'finalassets/waitingPlayerPic.png'); // Get waiting player temp pic
		game.load.image('tapArea', 'finalassets/tapMissArea.png');
		game.load.spritesheet('soundToggleButton', 'finalassets/soundToggleButton.png', 98, 98, 2);
		game.load.spritesheet('nonFBPlayerPics', 'finalassets/nonFBPlayerPics.png', 225, 225, 8);
		game.load.image('bigBox', 'finalassets/bigBox.png');
		game.load.image('gameBoard', 'finalassets/gameTable.png');
		
		
		
		//game.load.image('gameBoardWait', 'testingAssets/gameBoardWait.jpg');
		
		
		game.load.spritesheet('shoutOuts', 'finalassets/shoutouts.png', 500, 200, 10);
		
	
		// Load audio assets
		game.load.audio('tapHit', 'finalassets/sounds/tapHit.wav');
		game.load.audio('bgMusic', 'finalassets/sounds/bgMusic.wav');
		game.load.audio('tapMiss', 'finalassets/sounds/tapMiss.wav');
		game.load.audio('youLose', 'finalassets/sounds/youLose.wav');
		game.load.audio('youWin', 'finalassets/sounds/youWin.wav');
		game.load.audio('playerfoundSound', 'finalassets/sounds/playerFind.wav');
		game.load.audio('countdownSound', 'finalassets/sounds/321_cntdn.wav');
		game.load.audio('tenSecsLeft', 'finalassets/sounds/10s_cntdn.wav');
		game.load.audio('playgameSound', 'finalassets/sounds/GO_cntdn.wav');	
		
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
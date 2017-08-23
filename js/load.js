// Load.js

var loadState = {
	
	// Preload all game assets
	preload: function() {
		
		preLoadBar = game.add.sprite(game.world.centerX, game.world.centerY+100, 'preLoadBar');
		preLoadBar.anchor.set(0.5);
    	this.load.setPreloadSprite(preLoadBar);
	
		// Load graphic assets
		game.load.image('popeyesBG', 'finalassets/popeyesCraveBG.jpg');
		game.load.image('toPlayCard', 'finalassets/toPlayCard.png');
		game.load.image('startCravingButton', 'finalassets/startCravingButton.png');
		game.load.image('whiteLine', 'finalassets/whiteLine.png');
		game.load.image('playerPicStroke', 'finalassets/playerPicStroke.png');
		
		
		
		
		game.load.image('gameBoard', 'testingAssets/gameBoard.jpg');
		game.load.image('gameBoardWait', 'testingAssets/gameBoardWait.jpg');
		game.load.image('bigBox', 'testingAssets/bigbox.png');
		game.load.image('tapArea', 'assets/tapArea.png');
		game.load.image('waitingCircle', 'testingAssets/waitingCircle.png');
		game.load.image('player1Shadow', 'testingAssets/picShadow.png');	
		game.load.image('player1Stroke', 'assets/whiteStroke.jpg');	
		game.load.image('player1Stroke', 'testingAssets/waitingCircle.png');
		
		game.load.image('gameWon', 'http://via.placeholder.com/1000x400/fff/000/?text=You Won!');
		game.load.image('gameLost', 'http://via.placeholder.com/1000x400/fff/000/?text=Better Luck Next Time!');
		game.load.image('restartGameButton', 'http://via.placeholder.com/500x150/00cc66/fff/?text=Play Again');game.load.image('continueButton', 'http://via.placeholder.com/500x150/3399ff/fff/?text=Continue');
		game.load.image('waitingPic', 'testingAssets/waitingPlayerPic.jpg'); // Get waiting Avatar pic
		
		game.load.spritesheet('tapBubble', 'assets/food.png', 200, 188, 9);
		game.load.spritesheet('afterPulse', 'assets/pulse.png', 200, 200, 5);
		game.load.spritesheet('shoutOuts', 'testingAssets/shoutouts.png', 500, 200, 10);
		
	
		// Load audio assets
		game.load.audio('blaster', 'assets/sounds/blaster.mp3');
		game.load.audio('bgMusic', 'assets/sounds/sd-ingame1.wav');
		game.load.audio('badTap', 'assets/sounds/badTap.mp3');
		game.load.audio('under500', 'assets/sounds/under500.mp3');
		game.load.audio('over500', 'assets/sounds/over500.mp3');
		game.load.audio('playerfoundSound', 'assets/sounds/playerfound.mp3');
		game.load.audio('countdownSound', 'assets/sounds/countdown.mp3');
		game.load.audio('playgameSound', 'assets/sounds/playgame.mp3');	
		
		// Show loading progress
		setLoadingText = game.add.text(game.world.centerX, game.world.centerY, '', { font: '50px Arial', fill: '#ffffff'});
		setLoadingText.anchor.set(0.5, 0.5);
	},
	
	loadUpdate: function() {            // update loading text percent
		setLoadingText.text = game.load.progress+'%';
		if(game.load.progress > 96) {
			setLoadingText.text = 'Load Complete';
		}
	},
	
	create: function() {
		game.state.start("howtoplay");
	},
};
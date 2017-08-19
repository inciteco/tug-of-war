// Game.js

// Set game height and width to device height and width

var gWidth = 1440; // game width per assets
var gHeight = 2100; // game height per assets
var gameAspectRatio = 1.45833333; // aspect ratio of game canvas
var dpr = window.devicePixelRatio; // dpr of device
var dWidth = window.innerWidth * dpr; // viewport width
var dHeight = window.innerHeight * dpr; // viewport height
var dHeightAdj = dHeight-dHeight*.08; // give a little room at the bottom on desktop
//alert(window.devicePixelRatio+','+dWidth+','+dHeight); // for testing

// Initialize game
var game; // instantiate variable

game = new Phaser.Game(gWidth, gHeight, Phaser.CANVAS, 'popeye-game');

// Global game variables

	//  Time and Timers
	var counter; // countdown to gametime
	var timerPos; // bubble creation timer
	var timerVal; // interval for tapBubble creation
	var nowTime; // the exact time a tapBubble is created
	var tapTime; // the exact time a tapBubble is tapped/destroyed
	var gameTimer; // full game timer
	var gameCount = 45; // game length
	var gameTimerText; // game timer text
	
	// Text
	var countdownText; // text for var counter
	var shoutOutText; // tap response text
	var scoreText; // total score text
	var waitingforplayerText; // text while waiting for Player 2
	
	// Fonts
	var playerNamesFont = { font: '70px Futura', fill: '#fff' };
	var player2Font = { font: '44px Futura', fill: '#fff' };
	var bodyFont = { font: '50px Helvetica', fill: '#fff', wordWrap: true, wordWrapWidth: 700, align: 'center' };
	var tipsFont = { font: '46px Helvetica', fill: '#fff', wordWrap: true, wordWrapWidth: 1170, align: 'left' };
	

	// Sprites
	var tapBubble; // sprite: the bubbles the player taps
	var tapArea; // sprite: area where player taps
	var preLoadBar; // sprite: progress loading bar
	var chicken; // sprite: chickenbox
	var gameBoard; // sprite: game table
	var gameBoardWait; // sprite: low opacity game table
	var waitingCircle; // sprite: spins while waiting for player

	// Audio
	var blaster;
	var bgmusic;
	var badTap;
	var under500;
	var over500;
	var playerfoundSound;
	var countdownSound;
	var playgameSound;

	// Gameplay variables
	var score; // player's total game score
	var tapScore; // player's per tap score
	var tapMisses = 0; // how many times a player misses a tapBubble
	var tapsArray = new Array(); // store tapScores for final tally
	var tapWarnings = 0; // how many times you were warned to start tapping
	var totalTaps = 0; // how many successful taps
	var missOrNoTap = -4.5 // velocity penalty for miss or not tapping
	var threeMisses; // flag for user doing poorly
	var crossbarPos = gHeight*.365; // position of crossbar
	var minBall = 280; // min tapBubble h+w
	var maxBall = 360; // max tapBubble h+w
	var randPosX = game.rnd.integerInRange(70, 1370); // rnd x pos for tapBubble appearance
	var randPosY = game.rnd.integerInRange(1790, gHeight) // rnd y pos for tapBubble appearance
	var randSizeXY = game.rnd.integerInRange(minBall, maxBall); // ball size for next tapBubble
	var bounds; // coordinates of tapArea
	var foodItems; // collision group
	var randSprite; // instantiate pick a random sprite var
	var scoreResponse = ["Pathetic!", "So Slow Bro", "Eh, Fine", "Very Nice", "So Good!", "Amazing!", "Incredi-Fast!", "You missed!"]; // array of tap responses
	var scoreValues = [0, 1, 2, 5, 10, 20, 50, -5]; // array of tap score values
	
	var simulateRemotePlayerMoveInterval; // temp variable for P2 moves
	var gameDuration = 45000; // duration of game
	var endGameTimeout; // game duration object
	var gameWinner; // name of game winner

	// Player data
	var player1Obj; // Player 1 object
	var player1Pic; // sprite: Player 1 pic
	var player1Name; // text: Player 1 name
	var player1Caps; // text: for uppercase names
	var p1Move; // integer sent to server to move game box

	var player2Obj; // Player 2 object
	var player2Pic; // sprite: Player 2 pic
	var player2Name; // text: Player 2 name
	var player2Caps; // text: for uppercase names
	var p2Move; // integer sent to server to move game box
	
	var waitingPic; // waiting for player pic
	

// Add game states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('howtoplay', howtoplayState);
game.state.add('waitforplayer', waitforplayerState);
//game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('win', winState);

// call boot state
game.state.start('boot');
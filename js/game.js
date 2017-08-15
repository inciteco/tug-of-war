// Game.js

// Set game height and width to device height and width
var gWidth = window.innerWidth;
var gHeight = window.innerHeight;

// Initialize game
var game = new Phaser.Game(gWidth, gHeight, Phaser.CANVAS, 'popeye-game');

// Global game variables

	//  Time and Timers
	var counter; // countdown to gametime
	var timerPos; // interval for tapBubble creation
	var nowTime; // the exact time a tapBubble is created
	var tapTime; // the exact time a tapBubble is tapped/destroyed

	// Text
	var countdownText; // text for var counter
	var shoutOutText; // tap response text
	var scoreText; // total score text
	var waitingforplayerText; // text while waiting for Player 2

	// Sprites
	var tapBubble; // sprite: the bubbles the player taps
	var tapArea; // sprite: the area where the player taps
	var preLoadBar; // sprite: progress loading bar
	var rail; // sprite: line chickenbox rides on
	var crossbar; // sprite: middle line for tug of war
	var chicken; // sprite: chickenbox

	// Gameplay variables
	var score; // player's total game score
	var tapScore; // player's per tap score
	var tapMisses = 0; // how many times a player misses a tapBubble
	var tapsArray = new Array(); // store tapScores for final tally
	var tapWarnings = 0; // how many times you were warned to start tapping
	var totalTaps = 0; // how many successful taps
	var crossbarPos = gHeight*.365; // position of crossbar
	var minBall = 80; // min tapBubble h+w
	var maxBall = 200; // max tapBubble h+w
	var randPosX = game.rnd.integerInRange(0, gWidth); // rnd x pos for tapBubble appearance
	var randPosY = game.rnd.integerInRange(gHeight-300, gHeight-250) // rnd y pos for tapBubble appearance
	var randSizeXY = game.rnd.integerInRange(minBall, maxBall); // ball size for next tapBubble
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
	var p1Move; // integer sent to server to move game box

	var player2Obj; // Player 2 object
	var player2Pic; // sprite: Player 2 pic
	var player2Name; // text: Player 2 name
	var p2Move; // integer sent to server to move game box
	
	var avatarPic; // waiting for player pic
	

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
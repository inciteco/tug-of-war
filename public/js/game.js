// Game.js

// Set game height and width to device height and width

var gWidth = 1440; // game width per assets
var gHeight = 2100; // game height per assets
var gameAspectRatio = 1.45833333; // aspect ratio of game canvas
var dpr = window.devicePixelRatio; // dpr of device
var dWidth = window.innerWidth * dpr; // viewport width
var dHeight = window.innerHeight * dpr; // viewport height
var dHeightAdj = dHeight-dHeight*.09; // give a little room at the bottom on desktop
//alert(window.devicePixelRatio+','+dWidth+','+dHeight); // for testing

// Initialize game
var game; // instantiate variable

game = new Phaser.Game(
	gWidth,
	gHeight,
	Phaser.CANVAS, 	// TODO: test w/ Phaser.AUTO?
	'popeye-game',
	null,						//
	true,						//
	true						// antialias
);

// Global game variables

	//  Time and Timers
	var counter; // countdown to gametime
	var timerPos; // bubble creation timer
	var timerVal; // interval for tapBubble creation
	var nowTime; // the exact time a tapBubble is created
	var tapTime; // the exact time a tapBubble is tapped/destroyed
	var gameTimer; // full game timer
	var gameCount; // game length
	var gameTimerText; // game timer text

	// Text
	var countdownText; // text for var counter
	var scoreText; // total score text
	var waitingforplayerText; // text while waiting for Player 2
	var setLoadingText; // loading percentage
	var timeLeftText; // for "time left"
	var gameplayText; // for loading screen

	// Fonts
	var playerNamesFont = { font: 'bold 60px Trebuchet MS', fill: '#F58426' };
	var playerHowFont = { font: 'bold 60px Trebuchet MS', fill: '#fff' };
	var bodyFont = { font: 'italic 46px Trebuchet MS', fill: '#fff', wordWrap: true, wordWrapWidth: 700, align: 'center' };
	var loadingFont = { font: '280px UTTriumph-Regular', fill: '#F58426' };
	var notYouFont = { font: 'italic 38px Trebuchet MS', fill: '#fff', align: 'center' };
	var tipsFont = { font: '56px Trebuchet MS', fill: '#fff', wordWrap: true, wordWrapWidth: 1170, align: 'left' };
	var toPlayFont = { font: 'bold 64px Trebuchet MS', fill: '#fff', wordWrap: true, wordWrapWidth: 1170, align: 'left' };
	var timeLeftFont = { font: ' 36px Trebuchet MS', fill: '#fff'};


	// Sprites
	var tapBubble; // sprite: the bubbles the player taps
	var tapArea; // sprite: area where player taps
	var bigBox; // sprite: bigBox
	var gameBoard; // sprite: game table
	var gameBoardWait; // sprite: low opacity game table
	var soundToggleButton; // sprite: mute button
	var waitingCircleShadow; // sprite: shadow behind waiting circle
	var waitingCircle; // sprite: spins while waiting for player
	var loadingLabel; // sprite: shows while assets load
	var shoutOuts; // response feedback to player
	var gameResults; // Winner/Loser graphic
	var somethingThingWrongWindow; // window for connection error

	var popeyesBG; // background image
	var craveoffLogo; // campaign logo
	var toPlayCard; // card behind game tips
	var startCravingButton; // button to begin game
	var whiteLine; // white line separator
	var player1PicStroke; // background setting for player pics
	var player1PicMask; // mask to round off player pics
	var player2PicStroke; // background setting for player pics
	var player2PicMask; // mask to round off player pics
	var fbShareButton; // fb share button
	var playAgainButton; // play again button
	var tryAgainButton; // for connection error

	// Audio
	var tapHit;
	var tapHitCoke;
	var bgmusic;
	var tapMiss;
	var youLose;
	var youWin;
	var playerfoundSound;
	var countdownSound;
	var playgameSound;
	var tenSecsLeft;
	var muteVal = 0; // for carryover between states

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
	var randSizeXY = game.rnd.integerInRange(minBall, maxBall); // ball size for next tapBubble
	var bounds; // coordinates of tapArea
	var randSprite; // instantiate pick a random sprite var
	var scoreResponse = ["Pathetic!", "So Slow Bro", "Eh, Fine", "Very Nice", "So Good!", "Amazing!", "Incredi-Fast!", "You missed!"]; // array of tap responses
	var scoreValues = [0, 1, 2, 5, 10, 20, 50, -5]; // array of tap score values
	var baseY = 860; // used for scaling calculation, this is "0" Y
	var diffY; // how far away from baseY are we
	var scaleVal; // how much to scale by
	var bigBoxInitScale = .75; // how big is the box

	var simulateRemotePlayerMoveInterval; // temp variable for P2 moves
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
game.state.add('play', playState);
game.state.add('win', winState);
game.state.add('share', shareState);
game.state.add('connecterror', connecterrorState);

// call boot state
if (gameService.getPlayer()) {
	startBootState();
} else {
	waitForBootState();
}

function waitForBootState() {
	console.log('[Game] waitForBootState');
	gameService.addListener('onPlayerReady', startBootState);
}

function startBootState() {
	console.log('[Game] startBootState');
	game.state.start('boot');
}

function toggleShareOn() {
	console.log('[Game] toggleShareOn');

	document.getElementById("popeye-game").style.display = "none";
	document.getElementById("forShareOnly").style.display = "block";
}

function toggleShareOff() {
	console.log('[Game] toggleShareOff');
	
	// Reload youTube source to keep audio from playing into next game
	document.getElementById("popeyeVid").src = "https://www.youtube.com/embed/4Sf20y3Hd8A";
	
	document.getElementById("popeye-game").style.display = "block";
	document.getElementById("forShareOnly").style.display = "none";
}

// Return to How to Play to start again
function playAgain() {
	console.log('[Game] playAgain');

	// Make sure to start clean!
	gameService.reset();

	// Hide sharedCopyCanvas
	toggleShareOff();

	game.state.start('howtoplay');
}

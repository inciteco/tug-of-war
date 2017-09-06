// Share.js

var shareState = {

	create: function() {

		toggleShareOn();

		$("#primary").fitVids();

		trackEvent("final-screen");
	},

// Call waitforplayer state
//	playAgain: function() {
//			craveVid.stop();
//
//			// Make sure to start clean!
//			gameService.reset();
//
//			game.state.start('howtoplay');
//	},

};

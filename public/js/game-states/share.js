// Share.js

var shareState = {
	
	create: function() {
		
		document.getElementById("forShareOnly").style.display = "block";
		document.getElementById("popeye-game").style.display = "none";
		$("#primary").fitVids();
	
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

